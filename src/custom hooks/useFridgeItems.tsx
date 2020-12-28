import React, { useContext, useEffect, useState } from "react";
import { getLogger } from "../core";
import { FridgeItemInterface } from "../interfaces/FridgeItemInterface";
import { addItem, getItems, removeItem } from "../utils/fridgeItemApi";
import PropTypes from "prop-types";
import { FridgeAlimentInterface } from "../interfaces/addToFridgeInterface";
import { AuthContext } from "../auth/AuthProvider";

const log = getLogger("useFridgeItems");

//punem intr-un context itemele
export const ItemContext = React.createContext<FridgeItemState>({
  fetching: false,
  addToFridge: () => log("Add to fridge function"),
  removeFromFridge: () => log("remove from fridge function"),
});

interface ItemProviderProps {
  children: PropTypes.ReactNodeLike;
}

//ca sa pot returna tot ce am nevoie in componenta care tine lista de elemente
export interface FridgeItemState {
  items?: FridgeItemInterface[];
  fetching: boolean;
  fetchingError?: Error;
  addToFridge: (item: FridgeAlimentInterface) => void;
  removeFromFridge: (id: string) => void;
}


//hook-ul asta va returna itemele si va apela functia de request
export const ItemProvider: React.FC<ItemProviderProps> = ({ children }) => {
  //iau din context jwt ca sa il pot adauga requesturilor
  const { jwt,isAuthenticated } = useContext(AuthContext);
  log('Token ' + jwt);
  //folosit ca sa fac un nou fetch cand adaug sau modific ceva din frigider
  const [needToFetch, setNeedToFetch] = useState<Boolean>(false);
  //add function, it will be used to add,update or increase/decrease quantity
  const addToFridgee = (item: FridgeAlimentInterface) => {
    log("addToFridgee");
    addFct(item);
  };

  async function addFct(item: FridgeAlimentInterface) {
    log("Await to add in rest service --addFct");
    try {
      const added = await addItem(item, jwt);
      setNeedToFetch(true);
    } catch (error) {
      log("Error on adding item");
      return false;
    }
  }

  //remove one item
  const removeFromFridge = (id: string) => {
    log("removeFromFridge " + id);
    try {
      removeItem(id, jwt);
      setNeedToFetch(true);
    } catch (error) {
      log("Error on removing item");
    }
  };

  const [state, setState] = useState<FridgeItemState>({
    items: undefined, //pot lipsi
    fetching: false,
    fetchingError: undefined,
    addToFridge: addToFridgee,
    removeFromFridge: removeFromFridge,
  });

  //destructuring
  const { items, fetching, fetchingError, addToFridge } = state;

  useEffect(getItemsEffect, [needToFetch,isAuthenticated]);
  //creez un context cu care voi face wrap aplicatiei. Partea cu {children} e ca sa permit sa am noduri in interiorul contextului meu
  return <ItemContext.Provider value={state}>{children}</ItemContext.Provider>;

  //apeleaza server-ul si aduce datele
  function getItemsEffect() {
    //add function
    if(!isAuthenticated)
    return;
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
        const items = await getItems(jwt);
        
       
        log("fetch items succeded");
        if (!canceled) setState({ ...state, items, fetching: false });
      } catch (error) {
        log("fetch failed");
        setState({ ...state, fetchingError: error, fetching: false });
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
