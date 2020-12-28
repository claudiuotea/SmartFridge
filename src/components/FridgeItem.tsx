import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonImg,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonAlert,

} from "@ionic/react";
import React, { useContext, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { getLogger } from "../core";
import { FridgeItemState, ItemContext } from "../custom hooks/useFridgeItems";
import { FridgeItemInterface } from "../interfaces/FridgeItemInterface";
import { addOutline, removeOutline } from "ionicons/icons";
import { AuthContext } from "../auth/AuthProvider";

const log = getLogger("FridgeItem");

//ca sa pot extrage id-ul din URL
interface FridgeItem extends RouteComponentProps<{ id: string }> {}

export const FridgeItem: React.FC<FridgeItem> = ({ match,history }) => {
  const { items, fetching, fetchingError,removeFromFridge ,addToFridge} = useContext(ItemContext);
  const {jwt} = useContext(AuthContext);
  const [item, setItem] = useState<FridgeItemInterface>();
  const [showAlert,setShowAlert] = useState<boolean>(false);
  function removeClicked(id:string){
      history.goBack();
      removeFromFridge?.(id,jwt);
  }

  function addClicked(item:FridgeItemInterface){
    let newQuantity:string = (item.quantity + 1).toString();
    addToFridge?.({type:item.type,quantity:newQuantity},jwt);
  }
  function substractClicked(item:FridgeItemInterface)
  {
    if(item.quantity <2)
    {
      setShowAlert(true);
      return;
    }
    setShowAlert(false);
    let newQuantity:string = (item.quantity - 1).toString();
    addToFridge?.({type:item.type,quantity:newQuantity},jwt);
  }
  useEffect(() => {
    const item = items?.find((x:FridgeItemInterface) => x.id === +match.params.id!);
    setItem(item);
  }, [match.params.id, items]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="dark">
          <IonTitle className="ion-text-center ion-no-border">
            {item?.type}
          </IonTitle>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/list" />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid className="ion-padding ion-text-center ion-margin">
          <IonRow>
            <IonCol>
              <IonCard>
                <IonCardHeader>
                  <IonImg src={item?.url_img} />
                </IonCardHeader>
                <IonCardContent>{item?.description}</IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton onClick={()=>addClicked(item!)} color="dark">
                <IonIcon slot="icon-only" icon={addOutline}></IonIcon>
              </IonButton>
            </IonCol>
            <IonCol>
              <h3>Quantity: {item?.quantity}</h3>
            </IonCol>
            <IonCol>
              <IonButton onClick={()=>substractClicked(item!)} color="dark">
                <IonIcon slot="icon-only" icon={removeOutline}></IonIcon>
              </IonButton>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton onClick={()=>removeClicked(item!.id.toString())} color = "dark">Remove</IonButton>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonAlert isOpen={showAlert} message="Quantity can't be lower than 1"></IonAlert>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};
