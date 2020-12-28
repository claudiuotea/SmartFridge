import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';
import { AuthContext, AuthState } from './AuthProvider';
import { getLogger } from '../core';

const log = getLogger('PrivateRoute');

//sunt proprietatile pe care le primim
export interface PrivateRouteProps {
  component: PropTypes.ReactNodeLike; //componenta react, pentru a continua daca e autentificat [se afiseaza componenta asa cum e oferita]
  path: string;
  exact?: boolean;
}

//se va folosi ca un wrapper pentru route, face doar o verificare daca userul este autentificat, si daca da, ii permite sa mearga mai departe, altfel il redirecteaza spre login
//este un higher-order component, instantiaza doar in anumite conditii componenta
export const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useContext<AuthState>(AuthContext);
  log('render, isAuthenticated' + isAuthenticated);

  //render permite sa spunem cum se afiseaza componenta
  return (
    <Route {...rest} render={props => {
      if (isAuthenticated) {
        // @ts-ignore
        return <Component {...props} />;
      }
      return <Redirect to={{ pathname: '/login' }}/>
    }}/>
  );
}
