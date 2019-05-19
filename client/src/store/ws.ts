import io from "socket.io-client";
import store from "./store";
// import { IMessage } from "./actions/dialogActions";

const socket = io();

export const emit = (type: string, payload: any) => socket.emit(type, payload);

export const init = (store: any) => {
  const { dispatch } = store;

  socket
    .on("connect", () => {
      socket.emit("account.auth", {
        token: sessionStorage.getItem("auth-token")
        //"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjZTAyZDZlNzY3OTQyMjZjNDY1ODQwMCIsImlhdCI6MTU1ODI2NDUwMCwiZXhwIjoxNTU4MzAwNTAwfQ.Zo9s73WIJNdtYrXUKenDrnVFgJ0BIfDOKGkcM-UX820"
      });
      socket.once("account.auth", (data: any) => {
        console.log("auth succeful:", data);
        store.dispatch({ type: "ACCOUNT_AUTH_SUCCESS", payload: data });
      });
    })
    .on("api_error", (err: any) => {
      console.log("socket error:", err);
      switch (err.method) {
        case "account.auth": {
          sessionStorage.removeItem("auth-token");
          store.dispatch({ type: "ACCOUNT_LOGOUT" });
        }
      }
    });
  // .on("error", (data: any) => {
  //   console.log(data);
  // });

  socket.on("dialog.stop", (data: any) => {
    dispatch({ type: "DIALOG_STOP_SUCCESS", payload: data });
  });

  socket.on("dialog.create", (data: any) => {
    dispatch({ type: "DIALOG_CREATE_SUCCESS", payload: data });
  });

  socket.on("dialog.founded", (data: any) => {
    dispatch({ type: "DIALOG_SEARCH_SUCCESS", payload: data });
  });

  socket.on("dialog.messages.new", (message: any) => {
    dispatch({ type: "DIALOG_MESSAGES_NEW", payload: message });
  });

  // socket.on("dialog.leave", (data: any) => {
  //   dispatch({ type: "DIALOG_STOP_SUCCESS", payload: data });
  // });
  socket.on("dialog.messages.send", (data: any) => {
    dispatch({ type: "DIALOG_MESSAGES_SEND_SUCCESS", payload: data });
    // console.log(data);
  });
  socket.on("dialog.messages.fetch", (data: any) => {
    dispatch({ type: "DIALOG_MESSAGES_FETCH_SUCCESS", payload: data.messages });
    // console.log(data);
  });
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

// export default function emit(type: string, payload: any) {}
