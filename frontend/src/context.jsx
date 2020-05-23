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
const ROOM_FETCHING_SUCCESS = "ROOM_FETCHING_SUCCESS";
const UPDATE_USERS_LIST = "UPDATE_USERS_LIST";
const GROUP_FETCHING = "GROUP_FETCHING";
const GROUP_FETCHING_ERROR = "GROUP_FETCHING_ERROR";
const GROUP_FETCHING_SUCCESS = "GROUP_FETCHING_SUCCESS";
const USER_FETCHING = "USER_FETCHING";
const USER_FETCHING_ERROR = "USER_FETCHING_ERROR";
const USER_FETCHING_SUCCESS = "USER_FETCHING_SUCCESS";
const ROOMS_FETCHING = "ROOMS_FETCHING";
const ROOMS_FETCHING_ERROR = "ROOMS_FETCHING_ERROR";
const ROOMS_FETCH_SUCCESS = "ROOMS_FETCHING_SUCCESS";
const SMALL_SCREEN_LAYOUT = "SMALL_SCREEN_LAYOUT";
const DEFAULT_LAYOUT = "DEFAULT_LAYOUT";
const TOGGLE_SIDEBAR = "TOGGLE_SIDEBAR";

const LOGOUT = "LOGOUT";

const DEFAULT_STATE = {
  user: { data: {}, error: null, loading: false },
  config: { data: { socket: "" }, error: null, loading: false },
  room: { data: {}, error: null, loading: false },
  rooms: { data: [], error: null, loading: false },
  style: { showSidebar: true, showInfobar: false, device: "desktop" },
  globals: { loading: true, error: null },
};
// Initial state of the application
export const initialState = () => {
  const token = Cookies.get("token");
  if (token) {
    // try to verify that token
    const decoded = jwt.decode(token);
    if (decoded) {
      return {
        ...DEFAULT_STATE,
        user: {
          ...DEFAULT_STATE.user,
          data: {
            username: decoded.username,
            id: decoded.id,
          },
        },
        config: {
          ...DEFAULT_STATE.config,
          data: { socket: decoded.socket },
        },
      };
    } else {
      Cookies.remove("token");
    }
  }

  return DEFAULT_STATE;
};

const INIT_STATE = initialState();

// Reducer
export const appReducer = (state, { type, payload }) => {
  // console.log({ type, payload });
  // console.log("state:", state);
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
          loading: false,
          error: null,
          data: payload.user,
        },
        config: {
          data: payload.socket,
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
    case ROOM_FETCHING_SUCCESS:
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
    case USER_FETCHING_SUCCESS:
      return {
        ...state,
        user: { data: payload, loading: false, error: null },
      };
    case UPDATE_USERS_LIST:
      const { entity, user } = payload;
      return {
        ...state,
        [entity]: {
          ...state[entity],
          data: {
            users: [...state[entity].data.users, user],
          },
        },
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
      Cookies.remove("token");
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
          device: "mobile",
          showSidebar: false,
          showInfobar: false,
        },
      };
    case DEFAULT_LAYOUT:
      return {
        ...state,
        style: {
          ...state.style,
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
  const saveOrAuthenticateUser = async (user, callback) => {
    dispatch({ type: USER_AUTHENTICATING });

    try {
      const res = await axios.post("/api/auth", user);
      if (res.data.error) {
        callback(res.data.error);
        return dispatch({
          type: USER_AUTHENTICATING_ERROR,
          payload: res.data.error,
        });
      }
      callback(null, res.data.user);
      return dispatch({
        type: USER_AUTHENTICATING_SUCCESS,
        payload: {
          user: res.data.user,
          socket: decodeToken(res.data.token).socket,
        },
      });
    } catch (err) {
      callback(err.message);
      return dispatch({
        type: USER_AUTHENTICATING_ERROR,
        payload: err.message,
      });
    }
  };

  // change this once group feature is implemented from backend
  const fetchGroup = async (groupId) => {
    dispatch({ type: GROUP_FETCHING });
    const decoded = decodeToken();
    try {
      const res = await axios.put(
        `/api/groups/${groupId}?user_id=${decoded.id}`
      );
      if (res.data.error) {
        return dispatch({
          type: GROUP_FETCHING_ERROR,
          payload: res.data.error,
        });
      }
      const group = res.data;
      return dispatch({
        type: GROUP_FETCHING_SUCCESS,
        payload: group,
      });
    } catch (error) {
      return dispatch({
        type: GROUP_FETCHING_ERROR,
        payload: error.message,
      });
    }
  };

  const fetchRoomById = async (roomId) => {
    dispatch({ type: ROOM_FETCHING });
    try {
      const res = await axios.get(
        `/api/users/${state.user.data.id}/rooms/${roomId}`
      );
      if (res.data.error) {
        return dispatch({
          type: ROOM_FETCHING_ERROR,
          payload: res.data.error,
        });
      }
      const room = res.data;
      return dispatch({
        type: ROOM_FETCHING_SUCCESS,
        payload: room,
      });
    } catch (error) {
      return dispatch({
        type: ROOM_FETCHING_ERROR,
        payload: error.message,
      });
    }
  };
  const fetchRoom = async (roomId) => {
    dispatch({ type: ROOM_FETCHING });
    const decoded = decodeToken();
    try {
      const res = await axios.put(`/api/rooms/${roomId}?user_id=${decoded.id}`);
      if (res.data.error) {
        return dispatch({
          type: ROOM_FETCHING_ERROR,
          payload: res.data.error,
        });
      }
      const room = res.data;
      return dispatch({
        type: ROOM_FETCHING_SUCCESS,
        payload: room,
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
        const res = await axios.get(`/api/users/${decoded.id}`);
        if (res.data.error) {
          if (res.status === 401) {
            // cookies expired
            return dispatch({
              type: LOGOUT,
            });
          }
          return dispatch({
            type: USER_FETCHING_ERROR,
            payload: res.data.error,
          });
        }
        const user = res.data;
        return dispatch({
          type: USER_FETCHING_SUCCESS,
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
      const res = await axios.get(`/api/rooms`);
      if (res.data.error) {
        return dispatch({
          type: ROOMS_FETCHING_ERROR,
          payload: res.data.error,
        });
      }
      const rooms = res.data;
      return dispatch({
        type: ROOMS_FETCH_SUCCESS,
        payload: rooms,
      });
    } catch (error) {
      return dispatch({
        type: ROOMS_FETCHING_ERROR,
        payload: error.message,
      });
    }
  };
  const updateUsers = (payload) => {
    return dispatch({
      type: UPDATE_USERS_LIST,
      payload,
    });
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
    return Object.keys(state.user.data).length > 0;
  };

  const isAuthorised = (role) => {
    if (isAuthenticated()) {
      return state.user.data.roles.includes(role);
    }
    return false;
  };

  const logout = () => {
    return dispatch({
      type: LOGOUT,
    });
  };

  // {
  //   xs: '480px',
  //   sm: '576px',
  //   md: '768px',
  //   lg: '992px',
  //   xl: '1200px',
  //   xxl: '1600px',
  // }

  const changeLayout = ({ width, height }) => {
    const isMobile = window.orientation !== undefined;
    const smallScreen = width <= 800 || height <= 850;
    if (isMobile || smallScreen) {
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
    if (state.style.device === "mobile") {
      payload = payload.showInfobar
        ? { ...payload, showSidebar: false }
        : { ...payload, showInfobar: false };
    }
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
    fetchRoom,
    fetchRoomById,
    updateUsers,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
export const AppContext = createContext(INIT_STATE);
