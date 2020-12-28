import axios from "axios";
import { getLogger } from "../core";

const log = getLogger("authApi");
const authUrl = `http://localhost:8080/user/login`;

//asta va returna autentificarea daca e success
export interface AuthProps {
  jwt: string;
}

export const loginApi: (
  username?: string,
  password?: string
) => Promise<AuthProps> = (username, password) => {
  let config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  log("Login api -- start")
  return axios
    .post(authUrl, { username, password }, config)
    .then((res) => {
       log("login succeded");
      return Promise.resolve(res.data);
    })
    .catch((error) => {
       log("Login failed " +error );
      Promise.reject(error);
    });
};
