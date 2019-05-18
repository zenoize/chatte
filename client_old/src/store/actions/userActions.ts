import axios from "axios";
import { handleActionError } from "../store";
import { string } from "joi";

export const userAccountLogin = ({ password, login, token }: any) => async (dispatch: any) => {
  dispatch({ type: "USER_ACCOUNT_AUTH_LOADING" });
  try {
    const res = await axios.get("/api/account/auth", { params: { login, password, token } });
    sessionStorage.setItem("authToken", res.data.token);
    dispatch({ type: "USER_ACCOUNT_AUTH_SUCCESS", payload: res.data });
  } catch (err) {
    handleActionError(dispatch, "USER_ACCOUNT_AUTH_ERROR", err);
  }
};

export const userAccountLogout = () => {
  sessionStorage.removeItem("authToken");
  return { type: "USER_ACCOUNT_LOGOUT_SUCCESS" };
};

export const userAccountDataFetch = () => async (dispatch: any, getState: any) => {
  dispatch({ type: "USER_ACCOUNT_FETCH_LOADING" });
  const token = sessionStorage.getItem("authToken");
  try {
    const res = await axios.get("/api/account/data", { headers: { "x-auth-token": token } });
    dispatch({ type: "USER_ACCOUNT_FETCH_SUCCESS", payload: res.data });
  } catch (err) {
    handleActionError(dispatch, "USER_ACCOUNT_FETCH_ERROR", err);
  }
};
