import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { addOutline, alertSharp, image } from "ionicons/icons";
import React, { useContext, useState } from "react";
import { RouteComponentProps } from "react-router";
import { getLogger } from "../core";
import { useAliments } from "../custom hooks/useAliments";
import { ItemContext } from "../custom hooks/useFridgeItems";
import { FridgeItemInterface } from "../interfaces/FridgeItemInterface";
import { AddForm } from "./AddAlimentForm";

const log = getLogger("FridgeList");

export const FridgeList: React.FC<RouteComponentProps> = ({ history }) => {
  const { items, fetching, fetchingError} = useContext(
    ItemContext
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="dark">
          <IonTitle className="ion-text-center ion-no-border">
            What's in my fridge?
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLoading
          isOpen={fetching}
          message="Please wait,getting data from the server!"
        />
        {fetchingError && (
          <IonCard>
            <IonItem>
              <IonIcon icon={alertSharp} slot="start" />
              <IonLabel>Communication error</IonLabel>
            </IonItem>
            <IonCardContent>{fetchingError.message}</IonCardContent>
          </IonCard>
        )}
        {items && (
          <IonList className="ion-padding">
            {items.map((x: FridgeItemInterface) => (
              <IonItem key={x.id} onClick={() => history.push(`/list/${x.id}`)}>
                <IonThumbnail slot="start">
                  <IonImg src={x.url_img} />
                </IonThumbnail>
                {x.type}
                <IonItem slot="end" lines="none">
                  Quantity:
                  <IonButton fill="outline" color="dark">
                    {x.quantity}
                  </IonButton>
                </IonItem>
              </IonItem>
            ))}
          </IonList>
        )}
        <AddForm/>
        
      </IonContent>
    </IonPage>
  );
};
