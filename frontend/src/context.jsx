import React, { createContext, useReducer } from "react";
import { retrieveState, preserveState } from "src/utils";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";

import axios from "axios";

// Define constacts action verbs
const USER_AUTHENTICATING = "USER_AUTHENTICATING";
const USER_AUTHENTICATING_ERROR = "USER_AUTHENTICATING_ERROR";
const USER_AUTHENTICATING_SUCCESS = "USER_AUTHENTICATING_SUCCESS";
const UPDATE_ONLINE_STATUS = "UPDATE_ONLINE_STATUS";

const USER_ROOM_FETCHING = "USER_ROOM_FETCHING";
const USER_ROOM_FETCHING_ERROR = "USER_ROOM_FETCHING_ERROR";
const USER_ROOM_FETCHING_SUCCESS = "USER_ROOM_FETCHING_SUCCESS";
const ROOM_FETCHING = "ROOM_FETCHING";
const ROOM_FETCHING_ERROR = "ROOM_FETCHING_ERROR";
const ROOM_FETCHING_SUCCESS = "ROOM_FETCHING_SUCCESS";
const UPDATE_ROOM_USERS = "UPDATE_ROOM_USERS";
const UPDATE_FRIEND_LIST = "UPDATE_FRIEND_LIST";
const GROUP_FETCHING = "GROUP_FETCHING";
const GROUP_FETCHING_ERROR = "GROUP_FETCHING_ERROR";
const GROUP_FETCHING_SUCCESS = "GROUP_FETCHING_SUCCESS";
const USER_FETCHING = "USER_FETCHING";
const USER_FETCHING_ERROR = "USER_FETCHING_ERROR";
const USER_FETCHING_SUCCESS = "USER_FETCHING_SUCCESS";
const RESET_NOTIFICATION = "RESET_NOTIFICATION";
const ADD_NOTIFICATION = "ADD_NOTIFICATION";
const TOGGLE_ROOM_FAVOURITE = "TOGGLE_ROOM_FAVOURITE";
const FRIEND_FETCHING = "FRIEND_FETCHING";
const FRIEND_FETCHING_ERROR = "FRIEND_FETCHING_ERROR";
const FRIEND_FETCHING_SUCCESS = "FRIEND_FETCHING_SUCCESS";

const ROOMS_FETCHING = "ROOMS_FETCHING";
const ROOMS_FETCHING_ERROR = "ROOMS_FETCHING_ERROR";
const ROOMS_FETCH_SUCCESS = "ROOMS_FETCHING_SUCCESS";

const MESSAGES_RECEIVED = "MESSAGES_RECEIVED";
const RECEIVE_NEW_MESSAGE = "RECEIVE_NEW_MESSAGE";
const UPDATE_MESSAGE = "UPDATE_MESSAGE";
const MESSAGE_SENT = "MESSAGE_SENT";

const SMALL_SCREEN_LAYOUT = "SMALL_SCREEN_LAYOUT";
const SET_MOBILE_LAYOUT = "SET_MOBILE_LAYOUT";
const DEFAULT_LAYOUT = "DEFAULT_LAYOUT";
const TOGGLE_SIDEBAR = "TOGGLE_SIDEBAR";

const LOGOUT = "LOGOUT";
const SET_SOCKET = "SET_SOCKET";
const FETCH_CONFIG_SUCCESS = " FETCH_CONFIG_SUCCESS";

const DEFAULT_STATE = {
  user: { data: null, error: null, loading: false },
  messages: [],
  config: { data: { SOCKET_URL: null }, error: null, loading: false },
  room: { data: null, error: null, loading: false },
  friend: { data: null, error: null, loading: false },
  rooms: { data: [], error: null, loading: false },
  style: {
    showSidebar: true,
    showInfobar: false,
    device: "desktop",
    layout: "desktop",
  },
  globals: { loading: true, error: null },
  socket: null,
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
        config: {
          ...DEFAULT_STATE.config,
          data: { SOCKET_URL: decoded.socket },
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
    case SET_SOCKET:
      return {
        ...state,
        socket: payload,
      };
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
          data: { SOCKET_URL: payload.socket },
          loading: false,
          error: null,
        },
      };
    case UPDATE_ONLINE_STATUS:
      const { id, status } = payload;
      let friends = [...state.user.data.friends];
      friends.forEach(
        ({ friend }) => friend.id === id && (friend.status = status)
      );
      return {
        ...state,
        user: {
          ...state.user,
          data: {
            ...state.user.data,
            friends,
          },
        },
      };
    case FETCH_CONFIG_SUCCESS:
      return {
        ...state,
        config: {
          ...state.config,
          data: payload,
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
        // friend: { ...state.room, data: null },
      };
    case USER_ROOM_FETCHING:
      return { ...state, room: { ...state.room, error: null, loading: true } };
    case USER_ROOM_FETCHING_ERROR:
      return {
        ...state,
        room: { ...state.room, loading: false, error: payload },
      };
    case USER_ROOM_FETCHING_SUCCESS:
      return {
        ...state,
        room: { data: payload.room, loading: false, error: null },
        user: {
          ...state.user,
          data:
            payload.room.name === "Bhetghat" ? state.user.data : payload.user,
        },
      };
    case USER_FETCHING:
      return {
        ...state,
        user: { ...state.user, error: null, loading: true },
        loading: true,
        error: null,
      };
    case USER_FETCHING_ERROR:
      Cookies.remove("token");
      return {
        ...state,
        user: { ...state.user, loading: false, error: payload },
        loading: false,
        error: payload,
      };
    case USER_FETCHING_SUCCESS:
      return {
        ...state,
        user: { data: payload, loading: false, error: null },
        loading: false,
        error: null,
      };
    case RESET_NOTIFICATION:
    case ADD_NOTIFICATION:
      return {
        ...state,
        user: {
          data: { ...state.user.data, notification: payload },
          loading: false,
          error: null,
        },
        loading: false,
        error: null,
      };
    case FRIEND_FETCHING:
      return {
        ...state,
        friend: { ...state.friend, error: null, loading: true },
      };
    case FRIEND_FETCHING_ERROR:
      return {
        ...state,
        friend: { ...state.friend, loading: false, error: payload },
      };
    case FRIEND_FETCHING_SUCCESS:
      return {
        ...state,
        friend: { data: payload.friend, loading: false, error: null },
        user: { ...state.user, data: payload.user },
        room: { ...state.room, data: null },
      };
    case UPDATE_ROOM_USERS:
      return {
        ...state,
        room: {
          ...state.room,
          data: {
            ...state.room.data,
            users: [payload, ...state.room.data.users],
          },
        },
      };
    case UPDATE_FRIEND_LIST:
      return {
        ...state,
        user: {
          ...state.user,
          data: {
            ...state.user.data,
            friends: payload.friends,
          },
        },
      };
    case TOGGLE_ROOM_FAVOURITE:
      let rooms = state.user.data.rooms.map((room) =>
        room._id === payload._id ? payload : room
      );

      return {
        ...state,
        user: {
          ...state.user,
          data: {
            ...state.user.data,
            rooms,
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
    case MESSAGES_RECEIVED:
      return {
        ...state,
        messages: payload,
      };
    case RECEIVE_NEW_MESSAGE:
      // temp fix, somehow message is receiving multiple times
      let messages =
        payload.id &&
        state.messages.find((message) => message.id === payload.id)
          ? [...state.messages]
          : [...state.messages, payload];
      return {
        ...state,
        messages,
      };
    case UPDATE_MESSAGE:
      let msgs = state.messages.map((message) =>
        message.id == payload.id ? payload : message
      );
      return {
        ...state,
        messages: msgs,
      };
    case LOGOUT:
      Cookies.remove("token");
      return {
        ...DEFAULT_STATE,
        style: {
          ...state.style,
        },
        config: {
          ...state.config,
        },
        socket: state.socket,
      };
    case SMALL_SCREEN_LAYOUT:
      return {
        ...state,
        style: {
          ...state.style,
          layout: "mobile",
          showSidebar: false,
          showInfobar: false,
        },
      };
    // this is called only once in a app
    case SET_MOBILE_LAYOUT:
      return {
        ...state,
        style: {
          ...state.style,
          device: "mobile",
          showSidebar: false,
          showInfobar: false,
          layout: "mobile",
        },
      };
    case DEFAULT_LAYOUT:
      return {
        ...state,
        style: {
          ...state.style,
          layout: "desktop",
          showSidebar: true,
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
  const initialiseSocket = async (socket) => {
    return dispatch({
      type: SET_SOCKET,
      payload: socket,
    });
  };
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

  const updateOnlineStatus = (payload) => {
    return dispatch({
      type: UPDATE_ONLINE_STATUS,
      payload,
    });
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

  const fetchRoomById = async (roomId, source) => {
    dispatch({ type: ROOM_FETCHING });
    try {
      const res = await axios.get(`/api/rooms/${roomId}`, {
        cancelToken: source.token,
      });
      if (!axios.isCancel()) {
        if (res.data.error) {
          return dispatch({
            type: ROOM_FETCHING_ERROR,
            payload: res.data.error,
          });
        }
        const payload = res.data;
        return dispatch({
          type: ROOM_FETCHING_SUCCESS,
          payload,
        });
      }
    } catch (error) {
      if (!axios.isCancel())
        return dispatch({
          type: ROOM_FETCHING_ERROR,
          payload: error.message,
        });
    }
  };

  const fetchRoomAndUpdatedUser = async (roomId, source) => {
    dispatch({ type: USER_ROOM_FETCHING });
    try {
      const res = await axios.get(
        `/api/users/${state.user.data.id}/rooms/${roomId}`,
        { cancelToken: source.token }
      );
      if (!axios.isCancel()) {
        if (res.data.error) {
          return dispatch({
            type: USER_ROOM_FETCHING_ERROR,
            payload: res.data.error,
          });
        }
        const payload = res.data;
        return dispatch({
          type: USER_ROOM_FETCHING_SUCCESS,
          payload,
        });
      }
    } catch (error) {
      if (!axios.isCancel())
        return dispatch({
          type: USER_ROOM_FETCHING_ERROR,
          payload: error.message,
        });
    }
  };

  const fetchConfig = async () => {
    const res = await axios.get("/api/config");
    return dispatch({
      type: FETCH_CONFIG_SUCCESS,
      payload: res.data,
    });
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
      payload: "No cookies found",
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
  const updateRoomUsers = (payload) => {
    return dispatch({
      type: UPDATE_ROOM_USERS,
      payload,
    });
  };

  const updateFriendList = (payload) => {
    return dispatch({
      type: UPDATE_FRIEND_LIST,
      payload,
    });
  };
  const fetchUserChatInfo = async (currentUserId, friendUserName, source) => {
    dispatch({ type: FRIEND_FETCHING });
    try {
      const res = await axios.get(
        `/api/users/${currentUserId}/chat?friendUserName=${friendUserName}`,
        { cancelToken: source.token }
      );
      if (!axios.isCancel()) {
        if (res.data.error) {
          return dispatch({
            type: FRIEND_FETCHING_ERROR,
            payload: res.data.error,
          });
        }
        return dispatch({
          type: FRIEND_FETCHING_SUCCESS,
          payload: res.data,
        });
      }
    } catch (err) {
      if (!axios.isCancel()) {
        return dispatch({
          type: FRIEND_FETCHING_ERROR,
          payload: err.message,
        });
      }
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

  const receivedMessage = (msg) => {
    let type = msg.length ? MESSAGES_RECEIVED : RECEIVE_NEW_MESSAGE;
    return dispatch({
      type,
      payload: msg,
    });
  };

  const updateMessage = (payload) => {
    return dispatch({
      type: UPDATE_MESSAGE,
      payload,
    });
  };

  const updateNotification = async (data) => {
    const type = data.count ? RESET_NOTIFICATION : ADD_NOTIFICATION;
    try {
      const res = await axios.patch(`/api/users/${data.id}/notification`, data);
      return dispatch({
        type,
        payload: res.data.notification,
      });
    } catch (err) {
      console.error(err);
    }
  };
  const sendMessage = (msg) => {
    // do api request to the messsage
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
    return state.user.data;
  };

  const isAuthorised = (role) => {
    if (isAuthenticated()) {
      return state.user.data.roles.includes(role);
    }
    return false;
  };

  const logout = async () => {
    try {
      await axios.patch(`/api/users/${state.user.data.id}`, {
        status: "offline",
      });
      return dispatch({
        type: LOGOUT,
      });
    } catch (err) {
      console.log("Error logging out user");
    }
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
    const smallScreen = width <= 800 || height <= 600;
    const { device, layout } = state.style;

    if (device === "desktop") {
      if (layout === "desktop") {
        if (smallScreen) {
          return dispatch({
            type: SMALL_SCREEN_LAYOUT,
          });
        }
      } else {
        if (!smallScreen) {
          return dispatch({
            type: DEFAULT_LAYOUT,
          });
        }
      }
    }
  };

  // this is called only once in a app
  const setDevice = (device) => {
    if (device === "mobile") {
      return dispatch({
        type: SET_MOBILE_LAYOUT,
      });
    }
  };

  const toggleSidebar = (payload) => {
    if (state.style.layout === "mobile") {
      payload = payload.showInfobar
        ? { ...payload, showSidebar: false }
        : { ...payload, showInfobar: false };
    }
    return dispatch({
      type: TOGGLE_SIDEBAR,
      payload,
    });
  };

  const favouriteClick = async (payload) => {
    try {
      const res = await axios.patch(
        `/api/users/${state.user.data.id}/rooms/${payload.id}`,
        { favourite: payload.favourite }
      );
      return dispatch({
        type: TOGGLE_ROOM_FAVOURITE,
        payload: res.data,
      });
    } catch (err) {
      console.log("Error", err);
    }
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
    fetchRoomAndUpdatedUser,
    fetchRoomById,
    updateRoomUsers,
    fetchUserChatInfo,
    initialiseSocket,
    receivedMessage,
    fetchConfig,
    updateNotification,
    updateFriendList,
    setDevice,
    updateOnlineStatus,
    favouriteClick,
    updateMessage,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
export const AppContext = createContext(INIT_STATE);
