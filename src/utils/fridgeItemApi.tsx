import axios from "axios";
import { getLogger } from "../core";
import { FridgeAlimentInterface } from "../interfaces/addToFridgeInterface";
import { FridgeItemInterface } from "../interfaces/FridgeItemInterface";
import { ReturnAddInterface } from "../interfaces/ReturnAddInterface";

const baseUrl = "http://localhost:8080";
const log = getLogger("fridgeItemApi");
export const getItems: (jwt:string,id:string) => Promise<FridgeItemInterface[]> = (jwt,id) => {
  let config = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`
    },
  };
  
  log("call for fridge items started");
  
  return axios
    .get(`${baseUrl}/fridge/${id}`,config)
    .then((res) => {
      log("get fridge items succeded");
      return Promise.resolve(res.data);
    })
    .catch((err) => {
      log("get fridge items failed");
      return Promise.reject(err);
    });
};

export const addItem: (
  item: FridgeAlimentInterface,jwt:string
) => Promise<ReturnAddInterface> = (item,jwt) => {
  
  let config = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`
    },
  };
  log("itemul " +  item.userId + " " + item.type + " " + item.quantity)
  log("Post an aliment to api");
  return axios
    .post(`${baseUrl}/fridge`, item,config)
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((err) => {
      log("Cannot add item to fridge");
      return Promise.reject(err);
    });
};

export const removeItem:(idUser:string,id:string,jwt:string) =>Promise<any> = (idUser,id,jwt)=>{
  log("Remove an aliment from api");
  let config = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`
    },
  };

  return axios
    .delete(`${baseUrl}/fridge/${idUser}/${id}`,config)
    .then((res) => {
      log("Item removed succesfully");
      return Promise.resolve(res.data);
      
    })
    .catch((err) => {
      log("Cannot remove item from fridge");
      return Promise.reject(err);
    });
}
//create a web socket to receive info from the server
// export const newWebSocket = (onMessage:(data:string)=>void)=>{
//    const ws = new WebSocket(`ws://${baseUrl}`)
//    ws.onopen = () =>{
//       log('web socket onopen');
//    };
//    ws.onclose = () =>{
//       log('web socket onclose');
//    };
//    ws.onmessage = messageEvent =>{
//       log('web socket on message');
//       onMessage(JSON.parse(messageEvent.data));
//    };
//    return () =>{
//       ws.close();
//    }
// }
