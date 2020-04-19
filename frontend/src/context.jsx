import { createContext } from "react";

const saveApplicationState = (value) => {
  localStorage.setItem("state", JSON.stringify(value));
};

const getApplicationState = (key) => {
  const context = localStorage.getItem(key);
  return context ? JSON.parse(context) : undefined;
};

const INIT_STATE = getApplicationState("state") || {
  user: {
    gender: "",
    ageGroup: "",
    chatGroup: [],
  },
};

const AppContext = createContext([INIT_STATE, () => {}]);

// remove storage after saving to global state
localStorage.removeItem("state");

export { INIT_STATE, AppContext, saveApplicationState };
