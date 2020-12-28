import axios from "axios";
import { getLogger } from "../core";
import { FridgeItemInterface } from "../interfaces/FridgeItemInterface";

const log = getLogger("alimentsApi");
const baseUrl="http://localhost:8080";

//All the aliments that can be inside the fridge
export const getAliments: (jwt:string) => Promise<FridgeItemInterface[]> = (jwt) =>{
   let config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwt}`
      },
    };
   log("call for aliments api started");
   return axios.get(`${baseUrl}/aliments`,config)
   .then(res=>{
      log("get aliments from api succeded");
      return Promise.resolve(res.data);
   })
   .catch(err=>{
      log("get aliments from api failed");
      return Promise.reject(err);
   })
}
