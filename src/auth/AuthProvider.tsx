import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getLogger } from "../core";
import { loginApi } from "./authApi";
import { Plugins } from "@capacitor/core";

const log = getLogger("AuthProvider");

//functia de login
type LoginFn = (username?: string, password?: string) => void;

type LogoutFn = () => void;

export interface AuthState {
  authenticationError: Error | null;
  isAuthenticated: boolean; //daca s-a terminat autentificarea
  isAuthenticating: boolean; //daca suntem in curs de autentificare, pentru un loading bar de ex
  login?: LoginFn;
  pendingAuthentication?: boolean; //flag care declanseaza login
  username?: string;
  password?: string;
  jwt: string;
  logout?:LogoutFn;
}

//stare initiala
const initialState: AuthState = {
  isAuthenticated: false,
  isAuthenticating: false,
  authenticationError: null,
  pendingAuthentication: false,
  jwt: "CLAUDIU"
};

export const AuthContext = React.createContext<AuthState>(initialState);

//ca sa pot face wrapp peste mai multe componente react cand le dau contextul
interface AuthProviderProps {
  children: PropTypes.ReactNodeLike;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);
  const {
    isAuthenticated,
    isAuthenticating,
    authenticationError,
    pendingAuthentication,
    jwt
  } = state;

  const login = useCallback<LoginFn>(loginCallback, []);
  const logout = useCallback<LogoutFn>(logoutCallback,[]);
  //functie side-effect care are posibilitatea de cancel pentru login. Ne folosim de flag-ul 'pendingAuthentication' ca sa stim daca userul este in proces de autentificare. Aici se face de fapt login
  useEffect(authenticationEffect, [pendingAuthentication]);
  //cand deschid prima data aplicatia, atunci verific daca am in local storage un token, daca da, sunt autentificat si pot trece mai departe.
  useEffect(checkIfAuth, []);
  function checkIfAuth() {
    const { Storage } = Plugins;
    waitForJWT();
    async function waitForJWT() {
      let jwt = await Storage.get({ key: "jwt" });
      
      if (jwt.value) {
        setState({ ...state, isAuthenticated: true });
        
      }
    }
  }
  const value = {
    isAuthenticated,
    login,
    isAuthenticating,
    authenticationError,
    jwt,
    logout
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

  //preia doar din componente datele si seteaza flag-ul de autentificare la true, ca mai apoi sa se execute effect-ul
  function loginCallback(username?: string, password?: string): void {
    log("login");
    setState({
      ...state,
      pendingAuthentication: true,
      username,
      password,
    });
  }

//apelata la logout, modifica isAuthenticated si sterge jwt
function logoutCallback(){
  log("Logout");
  setState({
    ...state,
    isAuthenticated:false,
    jwt:''
  });
}

  //este apelata ca side-effect cand se modifica flag-ul de pendingAuthentication. Ofera posibilitatea de cancel, care intrerupe functia asincrona
  function authenticationEffect() {
    let canceled = false;
    authenticate();
    return () => {
      canceled = true;
    };

    async function authenticate() {
      //daca nu se vrea autentificare
      if (!pendingAuthentication) {
        log("authenticate, !pendingAuthentication, return");
        return;
      }
      try {
        log("authenticate...");
        setState({
          ...state,
          isAuthenticating: true,
        });
        const { username, password } = state;
        //returneaza un promise AuthProps care contine un jwt
        const { jwt ,idUser} = await loginApi(username, password);
        //save the jwt in the local storage
        const { Storage } = Plugins;
        Storage.set({ key: "jwt", value: jwt });
        Storage.set({ key: "id", value: idUser });
        log(
          "Saved inside local storage token: " +
            (await Storage.get({ key: "jwt" })).value + " --> id " +
            (await Storage.get({ key: "id" })).value 
        );
        if (canceled) {
          return;
        }
        log("authentication succeded");
        setState({
          ...state,
          isAuthenticating: false,
          isAuthenticated: true,
          jwt,
          pendingAuthentication: false
        });
      } catch (error) {
        if (canceled) {
          return;
        }
        log("authenticate failed");
        setState({
          ...state,
          authenticationError: error,
          pendingAuthentication: false,
          isAuthenticating: false,
        });
      }
    }
  }
};
