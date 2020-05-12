import React, { createContext, useReducer } from "react";
import { retrieveState, preserveState } from "src/utils";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";

import axios from "axios";

// Define constacts action verbs
const DECODE_TOKEN = "DECODE_TOKEN";
const SAVE_CONFIG = "SAVE_CONFIG";

// Initial state of the application
export const initialState = () => {
  const token = Cookies.get("token");
  if (token) {
    const decoded = jwt.decode(token);
    return {
      user: { username: decoded.username },
      config: { SOCKET_URL: decoded.socket },
    };
  }
  return { user: { username: "" }, config: { SOCKET_URL: "" } };
};

const INIT_STATE = initialState();

console.log(initialState());
// Reducer
export const appReducer = (state, { type, payload }) => {
  switch (type) {
    case DECODE_TOKEN:
      return {
        user: { username: payload.username },
        config: { SOCKET_URL: payload.socket },
      };
    default:
      return INIT_STATE;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, INIT_STATE);
  // Actions
  const saveOrAuthenticateUser = async (user) => {
    try {
      const res = await axios.post("/api/auth", user);
      if (res.data.error) return res.data.error;
      const token = res.data.token;

      return dispatch({
        type: DECODE_TOKEN,
        payload: jwt.decode(token),
      });
    } catch (error) {
      return error.message;
    }
  };

  const isAuthenticated = () => {
    return Cookies.get("token");
  };
  const isAuthorised = (role) => {
    const token = isAuthenticated();
    if (token) {
      const decoded = jwt.decode(token);
      return decoded.roles.includes(role);
    }
    return false;
  };

  const logout = () => {
    const token = isAuthenticated();
    if (token) Cookies.remove("token");
  };

  const value = {
    state,
    saveOrAuthenticateUser,
    isAuthenticated,
    isAuthorised,
    logout,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
export const AppContext = createContext(INIT_STATE);
