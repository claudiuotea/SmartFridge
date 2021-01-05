import { useContext, useEffect, useState } from "react";
import { NetworkStatus, Plugins } from "@capacitor/core";
import { AddCalls } from "../interfaces/futureAPICalls";
import { ItemContext } from "./useFridgeItems";

const { Network,Storage ,BackgroundTask} = Plugins;

const initialState = {
  connected: false,
  connectionType: "unknown",
};

export const useNetwork = () => {
  const [networkStatus, setNetworkStatus] = useState(initialState);
  const {addToFridge} = useContext(ItemContext);
  //se apeleaza o singura data cand afisez componenta
  useEffect(() => {
    //adaugam un listener care returneaza handler-ul (are metoda remove)
    const handler = Network.addListener(
      "networkStatusChange",
      handleNetworkStatusChange
    );
    Network.getStatus().then(handleNetworkStatusChange);
    let canceled = false;
    //cand distrug componenta distrug si handler-ul, ca sa nu ramana leak-uri din cauza handler
    return () => {
      canceled = true;
      handler.remove();
    };

    async function handleAddCalls() {
      
      let currentCalls = await (await Storage.get({ key: "addCalls" })).value;
      let choice: AddCalls[] = currentCalls ? JSON.parse(currentCalls) : [];
      
      choice.forEach(x=>{
          addToFridge?.(x.item,x.jwt);
      })
      Storage.remove({key:'addCalls'});
    }

    function handleNetworkStatusChange(status: NetworkStatus) {
      console.log("useNetwork - status change", status);

      //pentru situatii in care componenta este in decurs de distrugere dar se mai primeste totusi un apel spre functie
      if (!canceled) {
        setNetworkStatus(status);
        //background task pentru APLICATII MOBILE
        // let taskId = BackgroundTask.beforeExit(async () => {
        //   console.log('useBackgroundTask - executeTask started');
        //   await handleAddCalls();
        //   console.log('useBackgroundTask - executeTask finished');
        //   BackgroundTask.finish({ taskId });
        // });
        handleAddCalls(); //Pentru WEB!
      }
    }
  }, []);
  return { networkStatus };
};
