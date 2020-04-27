import { createContext } from "react";

const saveApplicationState = (value) => {
  sessionStorage.setItem("state", JSON.stringify(value));
};

const getApplicationState = (key) => {
  const context = sessionStorage.getItem(key);
  return context ? JSON.parse(context) : undefined;
};

const INIT_STATE = getApplicationState("state") || {
  user: {
    gender: "",
    ageGroup: "",
    username: "",
    chatGroup: [],
  },
};

const AppContext = createContext([INIT_STATE, () => {}]);

// remove storage after saving to global state
sessionStorage.removeItem("state");

export { INIT_STATE, AppContext, saveApplicationState };
