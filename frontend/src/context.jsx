import React, { createContext, useReducer } from "react";
import { retrieveState, preserveState } from "src/utils";
import axios from "axios";

// Define constacts action verbs
const SAVE_USER = "SAVE_USER";
const SAVE_CONFIG = "SAVE_CONFIG";

// Initial state of the application
const state = retrieveState() || {};
const user = state.user || {
  username: "",
};
const config = state.config || {};

export const initialStaate = {
  user,
  config,
};

// Reducer
export const appReducer = (state, { type, payload }) => {
  switch (type) {
    case SAVE_USER:
      return { ...state, user: payload };
    case SAVE_CONFIG:
      return { ...state, config: payload };
    default:
      return initialStaate;
  }
};

export const AppContext = createContext(initialStaate);
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialStaate);
  // Actions
  const saveUser = async (user) => {
    try {
      await axios.post("/api/users", user);
      preserveState("user", user);
      return dispatch({
        type: SAVE_USER,
        payload: user,
      });
    } catch (error) {
      return error.message;
    }
  };

  const fetchConfig = async () => {
    try {
      const res = await axios.get("/api/config");
      preserveState("config", res.data);
      return dispatch({
        type: SAVE_CONFIG,
        payload: res.data,
      });
    } catch (error) {
      return dispatch({
        type: SAVE_CONFIG,
        payload: null,
      });
    }
  };
  const value = { state, saveUser, fetchConfig };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
