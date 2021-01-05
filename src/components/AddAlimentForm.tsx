import { Plugins } from "@capacitor/core";
import {
  IonLoading,
  IonCard,
  IonItem,
  IonIcon,
  IonLabel,
  IonCardContent,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonButton,
  IonAlert,
} from "@ionic/react";
import { alertSharp, addOutline } from "ionicons/icons";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth/AuthProvider";
import { getLogger } from "../core";
import { useAliments } from "../custom hooks/useAliments";
import { ItemContext } from "../custom hooks/useFridgeItems";
import { useNetwork } from "../custom hooks/useNetwork";
import { FridgeAlimentInterface } from "../interfaces/addToFridgeInterface";
import { FridgeItemInterface } from "../interfaces/FridgeItemInterface";

const log = getLogger("AddAlimentForm");

export const AddForm: React.FC = () => {
  const { addToFridge, addToFridgeOffline } = useContext(ItemContext);
  //Starea conectivitatii la internet
  const { networkStatus } = useNetwork();
  const { jwt } = useContext(AuthContext);
  const { aliments, fetchingAliments, fetchingAlimentsError } = useAliments();
  const [typeAliment, setTypeAliment] = useState<string>("");
  const [quantity, setQuantity] = useState<string | null | undefined>("0");
  const [failedToAdd, setFailedToAdd] = useState<boolean>(false);

  log("render fridge list");

  //check if the input from the user is valid and if yes, continue
  //also check if there is internet connection. If yes, then store call the api method, if not, then work locally
  function checkUserInput() {
    if (
      typeAliment === undefined ||
      typeAliment === null ||
      quantity === null ||
      quantity == undefined ||
      typeAliment === "" ||
      +quantity < 1
    ) {
      setFailedToAdd(true);
      log("failed to add in checkUserInput");
      return;
    } else {
      setFailedToAdd(false);
      //no connection?work local
      if (networkStatus.connected)
        addToFridge?.(
          { userId: "", type: typeAliment, quantity: quantity },
          jwt
        );
      else
        addToFridgeOffline?.(
          { userId: "", type: typeAliment, quantity: quantity },
          jwt
        );
    }
  }
  function clearError() {
    setFailedToAdd(false);
  }

  return (
    <>
      <IonLoading
        isOpen={fetchingAliments}
        message="Please wait,getting aliments from the server!"
      />
      {fetchingAlimentsError && (
        <IonCard>
          <IonItem>
            <IonIcon icon={alertSharp} slot="start" />
            <IonLabel>Aliments API not working</IonLabel>
          </IonItem>
          <IonCardContent>{fetchingAlimentsError.message}</IonCardContent>
        </IonCard>
      )}
      {aliments && (
        <>
          <IonText className="ion-text-center" color="dark">
            <h2>Add an aliment to fridge</h2>
          </IonText>

          <IonGrid className="ion-text-center ion-margin ion-padding">
            <IonRow>
              <IonCol>
                <IonSelect
                  value={typeAliment}
                  placeholder="Choose aliment"
                  onIonChange={(e) => setTypeAliment(e.detail.value)}
                >
                  {aliments.map((x: FridgeItemInterface) => (
                    <IonSelectOption value={x.type}>{x.type}</IonSelectOption>
                  ))}
                </IonSelect>
              </IonCol>
              <IonCol>
                <IonItem className="inputQuantity" lines="none">
                  <IonLabel color="dark" position="fixed">
                    Quantity
                  </IonLabel>
                  <IonInput
                    required
                    type="number"
                    max="20"
                    min="1"
                    onIonChange={(e) => setQuantity(e.detail.value)}
                  ></IonInput>
                </IonItem>
              </IonCol>
              <IonCol>
                <IonButton onClick={checkUserInput} color="dark">
                  <IonIcon size="full" icon={addOutline}></IonIcon>
                </IonButton>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonAlert
                isOpen={failedToAdd}
                message="Please complete the inputs to add an aliment to the fridge."
                buttons={[{ text: "Okay", handler: clearError }]}
              ></IonAlert>
            </IonRow>
          </IonGrid>
        </>
      )}
    </>
  );
};
