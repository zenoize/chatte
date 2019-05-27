import * as io from "socket.io-client";
import { EventEmitter } from "events";

export default class Bot {
  token: string;
  socket: SocketIOClient.Socket;
  chat: EventEmitter = new EventEmitter();
  info: {
    dialog: any;
    user: any;
  } = {
    dialog: {},
    user: {}
  };

  constructor(token?: string) {
    console.log("starting..");
    this.token = token;
    this.socket = io("http://im.nekto.me", {
      transports: ["websocket"]
    });
    this.socket.on("notice", data => {
      // HTMLFormControlsCollection
      this.chat.emit(data.notice, data);
      // if()
      switch (data.notice) {
        case "error.code":
          return console.log("ERROR!".red, data.data);
        // default:
        // return console.log(this.info.user.id, " --- notice --- ", data.notice, " --- data --- \n", data.data, "\n");
      }
    });
  }

  handleNotice(filter?: (data: any) => boolean, error?: (data: any) => boolean): Promise<any> {
    return new Promise((res, rej) => {
      const notice = () =>
        this.socket.once("notice", async data => {
          if (error && data.notice === "error.code" && error(data.data)) return rej(data);
          if (filter(data)) {
            res(data);
          } else notice();
        });

      notice();
    });
  }

  async auth(token?: string) {
    let query;
    if (token)
      query = {
        action: "auth.sendToken",
        token: token
      };
    else
      query = {
        action: "auth.getToken",
        deviceType: 2
      };
    this.socket.emit("action", query);
    const event = (await this.handleNotice(data => data.notice === "auth.successToken")) as any;
    // this.token = token;
    this.info.dialog.id = event.data.statusInfo.anonDialogId;
    this.info.user = event.data;
  }

  async readMessages(lastMessageId: number) {
    const { id: dialogId } = this.info.dialog;
    this.socket.emit("action", {
      acion: "anon.readMessages",
      dialogId: dialogId,
      lastMessageId: [lastMessageId]
    });
  }

  async setTyping(typing: boolean = true) {
    const { id: dialogId } = this.info.dialog;
    let data = {
      action: "dialog.setTyping",
      typing: typing,
      dialogId: dialogId
    };
    // await?
    // this.socket.emit("action", data);
  }

  async sendMessage(messageText: string, randomId: string = Date.now().toString()) {
    // return new Promise((res, rej) => {
    const { id: dialogId } = this.info.dialog;
    const { id: userId } = this.info.user;
    let message = {
      action: "anon.message",
      dialogId: dialogId,
      message: messageText,
      randomId
    };
    this.socket.emit("action", message);
    return await this.handleNotice(data => data.notice === "messages.new" && data.data.senderId === userId);

    // });
  }
  async searchDialog(userInfo: any = {}) {
    userInfo.action = "search.run";
    this.socket.emit("action", userInfo);
    const dialog = await this.handleNotice(data => data.notice === "dialog.opened");
    this.info.dialog = dialog.data;
  }
  async stopSearch() {
    this.socket.emit("action", { action: "search.sendOut" });
    await this.handleNotice(data => data.notice === "search.out");
  }
  async leaveDialog() {
    const { id: dialogId } = this.info.dialog;
    if (!dialogId) return;
    let query = {
      action: "anon.leaveDialog",
      dialogId
    };
    this.socket.emit("action", query);
    const data = await this.handleNotice(
      e => e.notice === "dialog.closed",
      e => {
        return e.id === 205;
      }
    );
    this.info.dialog = {};
  }
}
