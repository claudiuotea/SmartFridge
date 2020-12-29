import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonLoading,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useContext, useState } from "react";
import { Redirect, RouteComponentProps } from "react-router";
import { AuthContext } from "./AuthProvider";
import { getLogger } from "../core";
import "../theme/Login.scss";
import { Plugins } from "@capacitor/core";
const log = getLogger("Login");

interface LoginState {
  username?: string;
  password?: string;
}

export const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const {
    isAuthenticated,
    isAuthenticating,
    login,
    authenticationError,
  } = useContext(AuthContext);
  const [state, setState] = useState<LoginState>({});
  const { username, password } = state;
  //am preluat functia login de la context, o folosesc intr-un handleLogin pe care butonul il va apela
  const handleLogin = () => {
    log("handleLogin");
    login?.(username, password);
  };

  //daca e autentificat poate trece mai departe
  if (isAuthenticated) {
    return <Redirect to={{ pathname: "/" }} />;
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="dark">
          <IonTitle className="ion-text-center ion-no-border">
            Welcome, please login!
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid className="ion-text-center">
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel color="dark" position="floating">
                  Username:
                </IonLabel>
                <IonInput
                  value={username}
                  onIonChange={(e) =>
                    setState({
                      ...state,
                      username: e.detail.value || "",
                    })
                  }
                  color="dark"
                ></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel color="dark" position="floating">
                  Password:
                </IonLabel>
                <IonInput
                  color="dark"
                  type="password"
                  value={password}
                  onIonChange={(e) =>
                    setState({
                      ...state,
                      password: e.detail.value || "",
                    })
                  }
                />
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton color="tertiary" fill="outline" onClick={handleLogin}>
                Login
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonLoading isOpen={isAuthenticating} />
        {authenticationError && (
          <h2 className="ion-text-center">{"Failed to authenticate"}</h2>
        )}
      </IonContent>
    </IonPage>
  );
};
