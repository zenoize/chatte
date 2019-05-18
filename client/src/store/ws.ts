import io from "socket.io-client";
import store from "./store";
// import { IMessage } from "./actions/dialogActions";

const socket = io();

export const emit = (type: string, payload: any) => socket.emit(type, payload);

export const init = (store: any) => {
  const { dispatch } = store;
  socket
    .on("connect", () => {
      emit("authenticate", {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjZTAyZDZlNzY3OTQyMjZjNDY1ODQwMCIsImlhdCI6MTU1ODE5NTU2OSwiZXhwIjoxNTU4MjMxNTY5fQ.duKkdGBdN_bzUt_bCJPwEFc-Vy6IhCJIActCLCp6Azk"
      });
    })
    .on("api_error", (err: any) => {
      console.log("socket error:", err);
    })
    .on("authenticated", () => {
      store.dispatch({ type: "ACCOUNT_AUTH_SUCCESS" });
      // store.dispatch({ type: "ON_MESSAGES_NEW", payload: [{ type: "SYSTEM_MESSAGE", time: Date.now(), author: "LEFT", text: "Успешное подключение!" }] });
    });

  socket.on("dialog.search", (data: any) => {
    console.log(data);
  });
  socket.on("dialog.leave", (data: any) => {
    console.log(data);
  });
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
