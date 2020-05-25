import React, { useContext, useLayoutEffect, useEffect, useState } from "react";
import { Router } from "@reach/router";
import { AppProvider } from "src/context";
import Chat from "src/chat";
// import GroupMessage from "src/chat/message";
import { AppContext } from "src/context";
import Home from "src/home";
import UserMessage from "src/chat/user";
import GroupMessage from "src/chat/group";
import RoomMessage from "src/chat/room";

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
  const { state, changeLayout, fetchAuthUser } = useContext(AppContext);
  useEffect(() => {
    if (width !== 0 || height !== 0) {
      changeLayout({ width, height });
    }
  }, [width, height]);

  useEffect(() => {
    fetchAuthUser();
  }, []);

  const isReady = () => {
    return !state.loading;
  };
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
