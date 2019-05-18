import io from "socket.io-client";
import store from "./store";
// import { IMessage } from "./actions/dialogActions";

const socket = io();

export const init = (store: any) => {
  // socket.on("connect", () => {
  //   store.dispatch({ type: "ON_CHAT_CONNECTION" });
  //   emit("authenticate", { token: "eyJhbGciOiJIUzI1NiJ9.NWNjMTY1MTE5NWU2NWQ0YTI0MTcxMTdj.EIvYLxpWzEnW0DYzkJ9GhTzp4xTciUW7BKKT6OdgP_4" });
  // });
  // socket.on("authenticated", () => {
  //   store.dispatch({ type: "ON_MESSAGES_NEW", payload: [{ type: "SYSTEM_MESSAGE", time: Date.now(), author: "LEFT", text: "Успешное подключение!" }] });
  // });
  // socket.on("messages_new", (data: IMessage[]) => {
  //   const state = store.getState();
  //   const messages = state.dialog.history.messages as IMessage[];
  //   const ids = data.map(m => m.randomId);
  //   const msg = messages.filter(m => m.status === "LOADING");
  //   for (let i = 0; i < ids.length; i++) {
  //     const m = msg.find(m => m.randomId === ids[i]);
  //     if (m) {
  //       store.dispatch({ type: "MESSAGES_SEND_SUCCESS", payload: { ...data.find(d => d.randomId === m.randomId) } });
  //       ids.splice(i--, 1);
  //     }
  //   }
  //   if (ids.length > 0)
  //     store.dispatch({ type: "MESSAGES_NEW", payload: data.filter(d => ids.includes(d.randomId)).map(d => ({ ...d, time: new Date(d.time).getMilliseconds() })) });
  //   // });)
  // });
  // // if (state.history.messages.find()) store.dispatch({ type: "MESSAGES_NEW", payload: data });
  // // });
  // socket.on("messages_fetch", (data: any) => {
  //   // console.log(data);
  //   store.dispatch({ type: "MESSAGES_FETCH_SUCCESS", payload: data });
  // });
  // socket.on("disconnect", () => {
  //   store.dispatch({ type: "MESSAGES_NEW", payload: [{ type: "SYSTEM_MESSAGE", time: Date.now(), author: "LEFT", text: "Соединение потеряно..." }] });
  // });
};

export const emit = (type: string, payload: any) => socket.emit(type, payload);

// export default function emit(type: string, payload: any) {}
