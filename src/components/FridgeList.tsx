import { Plugins } from "@capacitor/core";
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
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonText,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { alertOutline,addOutline, alertSharp, image } from "ionicons/icons";
import React, { useContext, useState } from "react";
import { Redirect, RouteComponentProps } from "react-router";
import { AuthContext } from "../auth/AuthProvider";
import { getLogger } from "../core";
import { useAliments } from "../custom hooks/useAliments";
import { ItemContext } from "../custom hooks/useFridgeItems";
import { FridgeItemInterface } from "../interfaces/FridgeItemInterface";
import { AddForm } from "./AddAlimentForm";
import { useNetwork } from "../custom hooks/useNetwork";
const log = getLogger("FridgeList");

export const FridgeList: React.FC<RouteComponentProps> = ({ history }) => {
  const { items, fetching, fetchingError, workingLocal } = useContext(
    ItemContext
  );
  //Starea conectivitatii la internet
  const { networkStatus } = useNetwork();
  const [searchString, setSearchString] = useState<string>("");
  const { logout } = useContext(AuthContext);

  //sterge storage-ul + modifica isAuthenticated si JWT din memorie
  const logoutFn = () => {
    const { Storage } = Plugins;
    Storage.clear();
    logout?.();
    history.push("/login");
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="dark">
          <IonTitle className="ion-text-center ion-no-border">
            What's in my fridge?
          </IonTitle>
          {networkStatus.connected ? <>Status:connected</>:<>Status: no network</>}
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLoading
          isOpen={fetching}
          message="Please wait,getting data from the server!"
        />
        <IonSearchbar
          value={searchString}
          onIonChange={(e) => setSearchString(e.detail.value!)}
          debounce={500}
        ></IonSearchbar>
        {/**Filtrarea se face direct cand se afiseaza itemele */}
        {items && (
          <IonList className="ion-padding">
            {items
              .filter(
                (x) =>
                  x.type.toLowerCase().indexOf(searchString.toLowerCase()) >= 0
              )
              .map((x: FridgeItemInterface) => (
                <IonItem
                  key={x.id}
                  onClick={() => history.push(`/list/${x.id}`)}
                >
                  <IonThumbnail slot="start">
                    <IonImg src={x.url_img} />
                  </IonThumbnail>
                  {x.type}
                  <IonItem slot="end" lines="none">
                    Quantity:
                    <IonButton fill="outline" color="dark">
                      {x.quantity}
                    </IonButton>
                    {x.id==-1&&<IonIcon icon={alertOutline}></IonIcon>}
                  </IonItem>
                </IonItem>
              ))}
          </IonList>
        )}
        {fetchingError && (
          <IonCard>
            <IonItem>
              <IonIcon icon={alertSharp} slot="start" />
              <IonLabel>Communication error</IonLabel>
            </IonItem>
            <IonCardContent>{fetchingError.message}</IonCardContent>
          </IonCard>
        )}
        <AddForm />
        {workingLocal && (
          <h2 className="ion-text-center">
            No connection, working on local storage. To modify or add an item
            please connect to internet!
          </h2>
        )}
        <IonFab vertical="bottom" horizontal="center">
          <IonButton onClick={logoutFn} expand="full" color="dark">
            Logout
          </IonButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};
