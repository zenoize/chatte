export type UserAccountAction = "USER_ACCOUNT_AUTH_LOADING" | "USER_ACCOUNT_AUTH_SUCCESS" | "USER_ACCOUNT_AUTH_ERROR";
export type DialogAction = "USER_ACCOUNT_AUTH_LOADING" | "USER_ACCOUNT_AUTH_SUCCESS" | "USER_ACCOUNT_AUTH_ERROR";

export type ActionStatus = "IDLE" | "LOADING" | "ERROR" | "SUCCESS";

export type ActionType = UserAccountAction | DialogAction;

export interface IReduxAction<T = ActionType, U = any> {
  type: T;
  entityName: string;
  payload?: U;
}
