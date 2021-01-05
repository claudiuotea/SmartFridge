import React, { useCallback, useContext, useEffect, useState } from "react";
import { getLogger } from "../core";
import { FridgeItemInterface } from "../interfaces/FridgeItemInterface";
import { addItem, getItems, removeItem } from "../utils/fridgeItemApi";
import PropTypes from "prop-types";
import { FridgeAlimentInterface } from "../interfaces/addToFridgeInterface";
import { AuthContext } from "../auth/AuthProvider";
import { Plugins } from "@capacitor/core";
import { AddCalls } from "../interfaces/futureAPICalls";

const log = getLogger("useFridgeItems");

interface ItemProviderProps {
  children: PropTypes.ReactNodeLike;
}

type addToFridgeFn = (item: FridgeAlimentInterface, jwt: string) => void;
type removeFromFridgeFn = (id: string, jwt: string) => void;
type addToFridgeOfflineFn = (item: FridgeAlimentInterface, jwt: string) => void;
//ca sa pot returna tot ce am nevoie in componenta care tine lista de elemente
export interface FridgeItemState {
  items?: FridgeItemInterface[];
  fetching: boolean;
  fetchingError?: Error;
  addToFridge?: addToFridgeFn;
  addToFridgeOffline?: addToFridgeOfflineFn;
  removeFromFridge?: removeFromFridgeFn;
  workingLocal: boolean;
}

const initialState: FridgeItemState = {
  fetching: false,
  workingLocal: false,
};

//punem intr-un context itemele
export const ItemContext = React.createContext<FridgeItemState>(initialState);

//hook-ul asta va returna itemele si va apela functia de request
export const ItemProvider: React.FC<ItemProviderProps> = ({ children }) => {
  //iau din context jwt ca sa il pot adauga requesturilor
  const { jwt, isAuthenticated } = useContext(AuthContext);
  const [state, setState] = useState<FridgeItemState>(initialState);
  //folosit ca sa fac un nou fetch cand adaug sau modific ceva din frigider
  const [needToFetch, setNeedToFetch] = useState<Boolean>(false);
  const { Storage } = Plugins;
  const { fetching, fetchingError, items, workingLocal } = state;
  useEffect(getItemsEffect, [needToFetch, isAuthenticated]);

  //callbacks for async fc
  //add function, it will be used to add,update or increase/decrease quantity
  const addToFridge = useCallback<addToFridgeFn>(addToFridgeCallback, []);
  const removeFromFridge = useCallback<removeFromFridgeFn>(
    removeFromFridgeCallback,
    []
  );
  const addToFridgeOffline = useCallback<addToFridgeOfflineFn>(addOffline, []);

  const value = {
    fetching,
    addToFridge,
    fetchingError,
    items,
    removeFromFridge,
    workingLocal,
    addToFridgeOffline,
  };
  //creez un context cu care voi face wrap aplicatiei. Partea cu {children} e ca sa permit sa am noduri in interiorul contextului meu
  return <ItemContext.Provider value={value}>{children}</ItemContext.Provider>;

  async function addOffline(item: FridgeAlimentInterface, jwt: string) {
    //take all the calls until now
    let currentCalls = await (await Storage.get({ key: "addCalls" })).value;
    let choice: AddCalls[] = currentCalls ? JSON.parse(currentCalls) : [];

    //save the add call in local storage to take care of it later
    let newCall: AddCalls = { item, jwt };
    choice.push(newCall);
    log(choice);
    Storage.set({ key: "addCalls", value: JSON.stringify(choice) });

    //modify the item localy
    let elementExists = false;
    //take the items from local storage since no internet conn
    let fridgeItems = await (await Storage.get({ key: "fridgeItems" }))
    .value;
    const currentItems: FridgeItemInterface[] = fridgeItems
    ? JSON.parse(fridgeItems)
    : [];

    currentItems?.forEach((x) => {
      if (x.type == item.type) {
        //-1 la id ca sa recunosc itemele modificate. Se reface cand se face fetch de la server
        x.id=-1;
        x.quantity = +item.quantity!;
        elementExists = true;
      }
    });
   
    //if it doesn't exist add it
    if(!elementExists){
      currentItems?.push({id:-1,type:item.type,description:'',quantity:+item.quantity!,url_img:""})
    }
    //save to state
    setState({...state,items:currentItems});
    //but save to local storage too
    Storage.set({ key: "fridgeItems", value: JSON.stringify(currentItems) });

  }

  async function addToFridgeCallback(
    item: FridgeAlimentInterface,
    jwt: string
  ) {
    try {
      //localstorage
      let token = await (await Storage.get({ key: "jwt" })).value;
      let id = await (await Storage.get({ key: "id" })).value;
      item.userId = id!;
      await addItem(item, token!);
      setNeedToFetch(true);
    } catch (error) {
      //if the rest call fails we use offline behaviour and store locally
      addToFridgeOffline(item,jwt);
      log("Error on adding item");
    }
  }

  async function removeFromFridgeCallback(id: string, jwt: string) {
    log("removeFromFridge " + id);
    try {
      //localstorage
      let token = await (await Storage.get({ key: "jwt" })).value;
      let idUser = await (await Storage.get({ key: "id" })).value;
      log("remove id " + idUser);
      removeItem(idUser!, id, token!);
      setNeedToFetch(true);
    } catch (error) {
      log("Error on removing item");
    }
  }

  //apeleaza server-ul si aduce datele
  function getItemsEffect() {
    //add function
    if (!isAuthenticated) return;
    let canceled = false;
    fetchItems();
    return () => {
      canceled = true;
    };

    async function fetchItems() {
      setNeedToFetch(false);
      try {
        log("fetch items started");
        setState({ ...state, fetching: true });
        //localstorage
        let token = await (await Storage.get({ key: "jwt" })).value;
        let id = await (await Storage.get({ key: "id" })).value;

        log("Id user " + id);
        const items = await getItems(token!, id!);

        log("fetch items succeded");
        if (!canceled) {
          //le adaugam si in local storage, daca nu avem conectivitate sa putem lucra cu local
          Storage.set({ key: "fridgeItems", value: JSON.stringify(items) });

          setState({ ...state, items, fetching: false, workingLocal: false });
        }
      } catch (error) {
        log("fetch failed");
        //daca avem eroare la fetch, preluam totusi itemele din local storage
        let fridgeItems = await (await Storage.get({ key: "fridgeItems" }))
          .value;
        const choice: FridgeItemInterface[] = fridgeItems
          ? JSON.parse(fridgeItems)
          : [];
        setState({
          ...state,
          items: choice,
          fetchingError: error,
          fetching: false,
          workingLocal: true,
        });
      }
    }

    // function wsEffect() {
    //   let canceled = false;
    //   log('wsEffect - connecting');
    //   const closeWebSocket = newWebSocket(message => {
    //     if (canceled) {
    //       return;
    //     }

    //     log(`ws message: ${message}`);

    //   });
    //   return () => {
    //     log('wsEffect - disconnecting');
    //     canceled = true;
    //     closeWebSocket();
    //   }
    // }
  }
};
