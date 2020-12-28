import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getLogger } from "../core";
import { type } from "os";
import { loginApi } from "./authApi";

const log = getLogger("AuthProvider");

//functia de login
type LoginFn = (username?: string, password?: string) => void;

export interface AuthState {
  authenticationError: Error | null;
  isAuthenticated: boolean; //daca s-a terminat autentificarea
  isAuthenticating: boolean; //daca suntem in curs de autentificare, pentru un loading bar de ex
  login?: LoginFn;
  pendingAuthentication?: boolean; //flag care declanseaza login
  username?: string;
  password?: string;
  jwt: string;
}

//stare initiala
const initialState: AuthState = {
  isAuthenticated: false,
  isAuthenticating: false,
  authenticationError: null,
  pendingAuthentication: false,
  jwt: "CLAUDIU",
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
    jwt,
  } = state;

  const login = useCallback<LoginFn>(loginCallback, []);

  //functie side-effect care are posibilitatea de cancel pentru login. Ne folosim de flag-ul 'pendingAuthentication' ca sa stim daca userul este in proces de autentificare. Aici se face de fapt login
  useEffect(authenticationEffect, [pendingAuthentication]);

  const value = {
    isAuthenticated,
    login,
    isAuthenticating,
    authenticationError,
    jwt,
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
        const { jwt } = await loginApi(username, password);
        if (canceled) {
          return;
        }
        log("authentication succeded");
        setState({
          ...state,
          isAuthenticating: false,
          isAuthenticated: true,
          jwt,
          pendingAuthentication: false,
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
