import React, {
  useContext,
  useLayoutEffect,
  useEffect,
  useState,
  Component,
} from "react";
import { Router, navigate, Redirect } from "@reach/router";
import io from "socket.io-client";

import { AppProvider } from "src/context";
import Chat from "src/chat";
// import GroupMessage from "src/chat/message";
import { AppContext } from "src/context";
import Home from "src/home";
import UserMessage from "src/chat/user";
import GroupMessage from "src/chat/group";
import RoomMessage from "src/chat/room";
import Loading from "src/common/loading";

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

const Root = () => {
  const [width, height] = useWindowSize();
  const {
    state,
    changeLayout,
    initialiseSocket,
    fetchAuthUser,
    fetchConfig,
  } = useContext(AppContext);
  useEffect(() => {
    if (width !== 0 || height !== 0) {
      changeLayout({ width, height });
    }
  }, [width, height]);

  useEffect(() => {
    !state.config.data.SOCKET_URL && fetchConfig();
    !state.user.data && fetchAuthUser();
  }, [state.config.data.SOCKET_URL, state.user.data]);

  useEffect(() => {
    const socket = io.connect(state.config.data.SOCKET_URL);
    initialiseSocket(socket);
    logger(socket);

    return () => socket.disconnect();
  }, [state.config.data.SOCKET_URL]);

  const logger = (socket) => {
    socket.on("connect", () => console.log("Connected"));
    socket.on("disconnect", (reason) => console.log("Disconnected: ", reason));
    socket.on("error", (error) => console.log("Errors:", error));
    socket.on("reconnect_attempt", () => {
      console.log("Reconnecting");
    });
  };

  if (state.loading) {
    return <Loading />;
  }
  return (
    <div className="app">
      <Router>
        <Home path="/" />
        <Chat path="chat">
          <UserMessage path="u/:username" />
          <GroupMessage path="g/:groupId" />
          <RoomMessage path="r/:roomId" />
        </Chat>
        <Home path="*" />
      </Router>
    </div>
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
