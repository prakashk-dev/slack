import React, { createContext, useReducer } from "react";
import { retrieveState, preserveState } from "src/utils";
import { usePost } from "src/utils/axios";
import axios from "axios";

// Define constacts action verbs
const SAVE_USER = "SAVE_USER";

// Initial state of the application
export const initialStaate = retrieveState() || {
  user: {
    username: "",
    gender: "",
    ageGroup: "",
  },
};

// Reducer
export const appReducer = (state, { type, payload }) => {
  switch (type) {
    case SAVE_USER:
      return { ...state, user: payload };
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
      console.log("Error");
      return error.message;
    }
  };
  const value = { state, saveUser };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
