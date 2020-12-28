//hook-ul asta va returna toate alimentele posibile pentru a fi adaugate in frigider

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
  const {jwt} = useContext(AuthContext);
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
      try {
        log("fetch aliments started");
        setState({ ...state, fetchingAliments: true });
        const aliments = await getAliments(jwt);
        log("fetch aliments succeded");
        if (!canceled)
          setState({ ...state, aliments, fetchingAliments: false });
      } catch (error) {
        log("fetch failed");
        setState({
          ...state,
          fetchingAlimentsError: error,
          fetchingAliments: false,
        });
      }
    }
  }
};
