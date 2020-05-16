import React, { createContext, useReducer } from "react";
import { retrieveState, preserveState } from "src/utils";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";

import axios from "axios";

// Define constacts action verbs
const USER_AUTHENTICATING = "USER_AUTHENTICATING";
const USER_AUTHENTICATING_ERROR = "USER_AUTHENTICATING_ERROR";
const USER_AUTHENTICATING_SUCCESS = "USER_AUTHENTICATING_SUCCESS";

const ROOM_FETCHING = "ROOM_FETCHING";
const ROOM_FETCHING_ERROR = "ROOM_FETCHING_ERROR";
const ROOM_FETCH_SUCCESS = "ROOM_FETCHING_SUCCESS";
const USER_FETCHING = "USER_FETCHING";
const USER_FETCHING_ERROR = "USER_FETCHING_ERROR";
const USER_FETCH_SUCCESS = "USER_FETCHING_SUCCESS";
const ROOMS_FETCHING = "ROOMS_FETCHING";
const ROOMS_FETCHING_ERROR = "ROOMS_FETCHING_ERROR";
const ROOMS_FETCH_SUCCESS = "ROOMS_FETCHING_SUCCESS";
const SMALL_SCREEN_LAYOUT = "SMALL_SCREEN_LAYOUT";
const DEFAULT_LAYOUT = "DEFAULT_LAYOUT";
const TOGGLE_SIDEBAR = "TOGGLE_SIDEBAR";

const LOGOUT = "LOGOUT";

const DEFAULT_STATE = {
  user: { data: {}, error: null, loading: false },
  config: { data: { SOCKET_URL: "" }, error: null, loading: false },
  room: { data: {}, error: null, loading: false },
  rooms: { data: [], error: null, loading: false },
  style: { showSidebar: true, showInfobar: true, device: "desktop" },
};
// Initial state of the application
export const initialState = () => {
  const token = Cookies.get("token");
  if (token) {
    const decoded = jwt.decode(token);
    return {
      ...DEFAULT_STATE,
      user: {
        ...DEFAULT_STATE.user,
        data: {
          username: decoded.username,
          _id: decoded.sub,
        },
      },
      config: {
        ...DEFAULT_STATE.config,
        data: { SOCKET_URL: decoded.socket },
      },
    };
  }
  return DEFAULT_STATE;
};

const INIT_STATE = initialState();

// Reducer
export const appReducer = (state, { type, payload }) => {
  switch (type) {
    case USER_AUTHENTICATING:
      return {
        ...state,
        user: { ...state.user, loading: true, error: null },
        config: { ...state.config, loading: true, error: null },
      };
    case USER_AUTHENTICATING_ERROR:
      return {
        ...state,
        user: { ...state.user, loading: false, error: payload },
      };
    case USER_AUTHENTICATING_SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          loading: false,
          error: null,
          data: {
            ...state.user.data,
            username: payload.username,
            _id: payload.sub,
          },
        },
        config: {
          ...state.config,
          data: {
            ...state.config.data,
            SOCKET_URL: payload.socket,
          },
          loading: false,
          error: null,
        },
      };

    case ROOM_FETCHING:
      return { ...state, room: { ...state.room, error: null, loading: true } };
    case ROOM_FETCHING_ERROR:
      return {
        ...state,
        room: { ...state.room, loading: false, error: payload },
      };
    case ROOM_FETCH_SUCCESS:
      return {
        ...state,
        room: { data: payload, loading: false, error: null },
      };
    case USER_FETCHING:
      return { ...state, user: { ...state.user, error: null, loading: true } };
    case USER_FETCHING_ERROR:
      return {
        ...state,
        user: { ...state.user, loading: false, error: payload },
      };
    case USER_FETCH_SUCCESS:
      return {
        ...state,
        user: { data: payload, loading: false, error: null },
      };
    case ROOMS_FETCHING:
      return {
        ...state,
        rooms: { ...state.rooms, error: null, loading: true },
      };
    case ROOMS_FETCHING_ERROR:
      return {
        ...state,
        rooms: { ...state.rooms, loading: false, error: payload },
      };
    case ROOMS_FETCH_SUCCESS:
      return {
        ...state,
        rooms: { data: payload, loading: false, error: null },
      };
    case LOGOUT:
      return {
        ...DEFAULT_STATE,
        style: {
          ...state.style,
        },
      };
    case SMALL_SCREEN_LAYOUT:
      return {
        ...state,
        style: {
          ...state.style,
          showSidebar: false,
          showInfobar: false,
          device: "mobile",
        },
      };
    case DEFAULT_LAYOUT:
      return {
        ...state,
        style: {
          ...state.style,
          showSidebar: true,
          showInfobar: true,
          device: "desktop",
        },
      };
    case TOGGLE_SIDEBAR:
      return {
        ...state,
        style: { ...state.style, ...payload },
      };
    default:
      return INIT_STATE;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, INIT_STATE);
  // Actions
  const saveOrAuthenticateUser = async (user) => {
    dispatch({ type: USER_AUTHENTICATING });

    try {
      const res = await axios.post("/api/auth", user);
      if (res.data.error) {
        return dispatch({
          type: USER_AUTHENTICATING_ERROR,
          payload: res.data.error,
        });
      }
      const token = res.data.token;
      return dispatch({
        type: USER_AUTHENTICATING_SUCCESS,
        payload: jwt.decode(token),
      });
    } catch (error) {
      return dispatch({
        type: USER_AUTHENTICATING_ERROR,
        payload: error.message,
      });
    }
  };

  const fetchGroup = async (groupId) => {
    dispatch({ type: ROOM_FETCHING });
    const decoded = decodeToken();
    try {
      const res = await axios.put(
        `/api/groups/${groupId}?user_id=${decoded.sub}`
      );
      if (res.data.error) {
        return dispatch({
          type: ROOM_FETCHING_ERROR,
          payload: res.data.error,
        });
      }
      const group = res.data;
      return dispatch({
        type: ROOM_FETCH_SUCCESS,
        payload: group,
      });
    } catch (error) {
      return dispatch({
        type: ROOM_FETCHING_ERROR,
        payload: error.message,
      });
    }
  };

  const fetchAuthUser = async () => {
    dispatch({ type: USER_FETCHING });
    const decoded = decodeToken();
    if (decoded) {
      try {
        const res = await axios.get(`/api/users/${decoded.sub}`);
        if (res.data.error) {
          return dispatch({
            type: USER_FETCHING_ERROR,
            payload: res.data.error,
          });
        }
        const user = res.data;
        return dispatch({
          type: USER_FETCH_SUCCESS,
          payload: user,
        });
      } catch (error) {
        return dispatch({
          type: USER_FETCHING_ERROR,
          payload: error.message,
        });
      }
    }
    return dispatch({
      type: USER_FETCHING_ERROR,
      payload: "Cookie expired or invalid",
    });
  };

  const fetchRooms = async () => {
    dispatch({ type: ROOMS_FETCHING });

    try {
      const res = await axios.get(`/api/groups`);
      if (res.data.error) {
        return dispatch({
          type: ROOMS_FETCHING_ERROR,
          payload: res.data.error,
        });
      }
      const groups = res.data;
      return dispatch({
        type: ROOMS_FETCH_SUCCESS,
        payload: groups,
      });
    } catch (error) {
      return dispatch({
        type: ROOMS_FETCHING_ERROR,
        payload: error.message,
      });
    }
  };

  const handleJoin = async (groupId) => {
    dispatch({ type: ROOMS_FETCHING });

    try {
      const res = await axios.get(`/api/groups`);
      if (res.data.error) {
        return dispatch({
          type: ROOMS_FETCHING_ERROR,
          payload: res.data.error,
        });
      }
      const groups = res.data;
      return dispatch({
        type: ROOMS_FETCH_SUCCESS,
        payload: groups,
      });
    } catch (error) {
      return dispatch({
        type: ROOMS_FETCHING_ERROR,
        payload: error.message,
      });
    }
  };

  // helper functions
  const decodeToken = () => {
    const token = Cookies.get("token");
    if (token) {
      const decoded = jwt.decode(token);
      return decoded;
    }
    return null;
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
    return dispatch({
      type: LOGOUT,
    });
  };

  const changeLayout = ({ width, height }) => {
    if (width < 800 || height < 600) {
      return dispatch({
        type: SMALL_SCREEN_LAYOUT,
      });
    } else {
      return dispatch({
        type: DEFAULT_LAYOUT,
      });
    }
  };

  const toggleSidebar = (payload) => {
    return dispatch({
      type: TOGGLE_SIDEBAR,
      payload,
    });
  };

  const value = {
    state,
    saveOrAuthenticateUser,
    isAuthenticated,
    isAuthorised,
    logout,
    fetchGroup,
    fetchAuthUser,
    fetchRooms,
    changeLayout,
    toggleSidebar,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
export const AppContext = createContext(INIT_STATE);
