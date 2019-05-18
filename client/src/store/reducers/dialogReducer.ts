import { IReduxAction, ActionStatus } from "../types";
import { IMessage } from "../../components/ChatContent";
import { Reducer, IInitialState, createState } from "../store";

const initialState: IInitialState = createState({
  history: {
    actions: ["fetch"],
    entity: { messages: [] }
  }
});

export default (s = initialState, action: any) => {
  switch (action.type) {
    case "DIALOG_HISTORY_FETCH_SUCCESS":
      return new Reducer(s).status("history", "fetch", "SUCCESS").entity("history", "messages", action.payload).state;
    case "DIALOG_HISTORY_FETCH_LOADING":
      return new Reducer(s).status("history", "fetch", "LOADING").state;
    default:
      return s;
  }
};
