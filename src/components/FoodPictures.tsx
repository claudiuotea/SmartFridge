import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBackButton,
  IonButtons,
  IonFab,
  IonFabButton,
  IonIcon,
  IonCol,
  IonGrid,
  IonImg,
  IonRow,
  IonActionSheet,
} from "@ionic/react";
import { camera, trash,close } from "ionicons/icons";
import React, { useState } from "react";
import { usePhotoGallery, Photo } from "../custom hooks/usePhotoGallery";

export const FoodPictures: React.FC = () => {
  const { photos, takePhoto, deletePhoto } = usePhotoGallery();
  const [photoToDelete, setPhotoToDelete] = useState<Photo>();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="dark">
          <IonTitle className="ion-text-center ion-no-border">
            Your pictures
          </IonTitle>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/list" />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonFab vertical="bottom" horizontal="center">
          <IonFabButton onClick={() => takePhoto()} color="dark">
            <IonIcon icon={camera} />
          </IonFabButton>
        </IonFab>
        <IonGrid>
          <IonRow>
            {photos.map((photo, index) => (
              <IonCol size="6" key={index}>
                <IonImg onClick={() => setPhotoToDelete(photo)}
                        src={photo.webviewPath}/>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
        <IonActionSheet
          isOpen={!!photoToDelete}
          buttons={[{
            text: 'Delete',
            role: 'destructive',
            icon: trash,
            handler: () => {
              if (photoToDelete) {
                deletePhoto(photoToDelete);
                setPhotoToDelete(undefined);
              }
            }
          }, {
            text: 'Cancel',
            icon: close,
            role: 'cancel'
          }]}
          onDidDismiss={() => setPhotoToDelete(undefined)}
        />
      </IonContent>
    </IonPage>
  );
};
