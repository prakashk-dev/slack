import Cookies from "js-cookie";
import io from "socket.io-client";

import React, {
  useContext,
  useLayoutEffect,
  useEffect,
  useState,
  useRef,
} from "react";
import { Router, navigate, Redirect } from "@reach/router";

import Chat from "src/chat";
import Home from "src/home";
import Login from "src/home/login";
import Signup from "src/home/signup";
import UserMessage from "src/chat/user";
import GroupMessage from "src/chat/group";
import RoomMessage from "src/chat/room";
import Loading from "src/common/loading";

import { isMobile } from "src/utils";
import { AppContext, AppProvider } from "src/context";

import "antd/dist/antd.css";
import "./style.scss";

const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
      // for mobile browser set --vh property as vh
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
};

const publicStates = ["/signup", "/login"];

const Root = () => {
  const [width, height] = useWindowSize();
  const {
    state,
    changeLayout,
    initialiseSocket,
    fetchAuthUser,
    fetchConfig,
    setDevice,
    toggleGlobals,
  } = useContext(AppContext);

  useEffect(() => {
    const device = isMobile() ? "mobile" : "desktop";
    setDevice(device);

    // if token found, validate token

    // if valid token
    // 1. register for sockets
    // 2. Join user to rooms and groups

    // if not valid
    // Redirect them to login page

    if (Cookies.get("token")) {
      fetchAuthUser();
    } else {
      publicStates.includes(location.pathname)
        ? navigate(location.pathname)
        : navigate("/signup");
    }
  }, []);

  useEffect(() => {
    if (state.style.device && state.style.device !== "mobile") {
      changeLayout({ width, height });
    }
  }, [state.style.device, width, height]);

  useEffect(() => {
    const { SOCKET_URL } = state.config.data;
    if (SOCKET_URL) {
      toggleGlobals({ loading: false });
      const socket = io.connect(SOCKET_URL);
      initialiseSocket(socket);
      logger(socket);

      return () => socket.disconnect();
    } else {
      fetchConfig();
    }
  }, [state.config.data]);

  const logger = (socket) => {
    socket.on("connect", () => console.log("Connected"));
    socket.on("disconnect", (reason) => console.log("Disconnected: ", reason));
    socket.on("error", (error) => console.log("Errors:", error));
    socket.on("reconnect_attempt", () => {
      console.log("Reconnecting");
    });
  };

  if (Cookies.get("token") && (state.user.loading || !state.socket)) {
    return <Loading />;
  } 

  return (
    <>
      <div className="app">
        <Router>
          <Home path="/">
            <Login path="login" />
            <Signup path="signup" />
          </Home>
          <Chat path="/chat">
            <UserMessage path="u/:username" />
            <GroupMessage path="g/:groupId" />
            <RoomMessage path="r/:roomId" />
          </Chat>
          <Home path="*" />
        </Router>
      </div>
      {state.config.data.env === "staging" && (
        <div className="env-bar">Environment: Staging</div>
      )}
    </>
  );
};

const App = () => {
  return (
    // <React.StrictMode>
    <AppProvider>
      <Root />
    </AppProvider>
    // </React.StrictMode>
  );
};

export default App;
