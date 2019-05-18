import { IReduxAction, ActionStatus } from "../types";
import { handleFetchReducer, createState, IInitialState, handleEntityReducer, handleLoadingReducer, handleErrorReducer } from "../store";

const defaultState = {
  account: ["auth"]
};

const initalState = createState(defaultState);

const userAccountAuth = ["USER_ACCOUNT_AUTH_SUCCESS", "USER_ACCOUNT_AUTH_LOADING", "USER_ACCOUNT_AUTH_ERROR"];

export default (s = initalState, action: IReduxAction): IInitialState => {
  if (userAccountAuth.includes(action.type)) return handleEntityReducer(s, action, "account", "auth");

  return s;
};
