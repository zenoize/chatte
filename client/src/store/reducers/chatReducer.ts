import { IReduxAction, ActionStatus } from "../types";
import { IMessage } from "../../components/ChatContent";
import { Reducer, IInitialState, createState } from "../store";

const initialState: IInitialState = createState({
  history: {
    actions: ["fetch"],
    entity: { messages: [] as IMessage[] }
  },
  account: {
    actions: ["auth"],
    entity: {}
    // actions
  }
  // stat
});

export default (s = initialState, action: any) => {
  switch (action.type) {
    case "ACCOUNT_AUTH_SUCCESS":
      return new Reducer(s).status("account", "auth", "SUCCESS").state;
    case "DIALOG_MESSAGES_FETCH_SUCCESS":
      return new Reducer(s).status("history", "fetch", "SUCCESS").entity("history", "messages", action.payload).state;
    case "DIALOG_MESSAGES_FETCH_LOADING":
      return new Reducer(s).status("history", "fetch", "LOADING").state;
    case "DIALOG_MESSAGES_SEND_LOADING":
      return new Reducer(s).status("history", "send", "LOADING").state;
    case "DIALOG_MESSAGES_SEND_SUCCESS":
      return new Reducer(s).status("history", "send", "SUCCESS").custom(s => {
        return {
          ...s,
          history: {
            ...s.history,
            entity: {
              ...s.history.entity,
              messages: [...s.history.entity.messages, { ...action.payload, type: "USER" }]
            }
          }
        };
      }).state;
    default:
      return s;
  }
};
