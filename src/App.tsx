import React from "react";
import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import { FridgeList } from "./components/FridgeList";
import { ItemProvider } from "./custom hooks/useFridgeItems";
import { FridgeItem } from "./components/FridgeItem";
import { AuthProvider } from "./auth/AuthProvider";
import { Login } from "./auth/Login";
import { PrivateRoute } from "./auth/PrivateRoute";
import { FoodPictures } from "./components/FoodPictures";

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <AuthProvider>
          <Route path="/login" component={Login} exact={true} />
          <ItemProvider>
            <PrivateRoute path="/list" component={FridgeList} exact={true} />
            <PrivateRoute path="/foods" component={FoodPictures} exact={true}/>
            <PrivateRoute
              path="/list/:id"
              component={FridgeItem}
              exact={true}
            />
          </ItemProvider>
          <Route exact path="/" render={() => <Redirect to="/list" />} />
        </AuthProvider>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
