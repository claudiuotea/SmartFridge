//hook-ul asta va returna toate alimentele posibile pentru a fi adaugate in frigider

import { Plugins } from "@capacitor/core";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth/AuthProvider";
import { getLogger } from "../core";
import { FridgeItemInterface } from "../interfaces/FridgeItemInterface";
import { getAliments } from "../utils/alimentsApi";

const log = getLogger("useAliments");

export interface AlimentsState {
  aliments?: FridgeItemInterface[];
  fetchingAliments: boolean;
  fetchingAlimentsError?: Error;
}

export const useAliments = () => {
  const [state, setState] = useState<AlimentsState>({
    aliments: undefined, //pot lipsi
    fetchingAliments: false,
    fetchingAlimentsError: undefined,
  });

  //iau din context jwt ca sa il pot adauga requesturilor
  //const {jwt} = useContext(AuthContext);
  //preiau jwt direct din local storage
  const {Storage} = Plugins;


  //destructuring
  const { aliments, fetchingAliments, fetchingAlimentsError } = state;
  useEffect(getAlimentsEffect, []);
  return{
    aliments, fetchingAliments, fetchingAlimentsError
  };

  //apeleaza server-ul si aduce datele
  function getAlimentsEffect() {
    let canceled = false;
    fetchAliments();
    return () => {
      canceled = true;
    };

    async function fetchAliments() {
      //I used jwt from local Storage here
      let jwt = (await Storage.get({key:'jwt'})).value;
      try {
        log("fetch aliments started");
        setState({ ...state, fetchingAliments: true });
        const aliments = await getAliments(jwt!);

        //save them in local storage
        Storage.set({key:'aliments',value:JSON.stringify(aliments)});


        log("fetch aliments succeded");
        if (!canceled)
          setState({ ...state, aliments, fetchingAliments: false });
      } catch (error) {
        log("fetch failed");
        //daca avem eroare la fetch, preluam totusi itemele din local storage
        let aliments = await (await Storage.get({key:'aliments'})).value;
        const choice:FridgeItemInterface[] = aliments? JSON.parse(aliments):[];
        setState({
          ...state,
          aliments:choice,
          fetchingAlimentsError: error,
          fetchingAliments: false,
        });
      }
    }
  }
};
