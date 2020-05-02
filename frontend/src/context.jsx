import { createContext } from "react";
const saveApplicationState = (value) => {
  localStorage.setItem("state", JSON.stringify(value));
};

const getApplicationState = (key) => {
  const context = localStorage.getItem(key);
  return context ? JSON.parse(context) : undefined;
};

// initialise with persisted state if exists
/**
 * { user: { username, gender, ageGroup } }
 *
 * username: String:  username of the user
 *
 * gender: String:  gender of the user (m or f)
 *
 * ageGroup: String: age group of the user 1,2,3 or 4
 */
const INIT_STATE = getApplicationState("state") || {
  user: {
    username: "",
    gender: "",
    ageGroup: "",
  },
};

const AppContext = createContext([
  INIT_STATE,
  (data) => {
    console.log("Change data", data);
  },
]);

export { INIT_STATE, AppContext, saveApplicationState };
