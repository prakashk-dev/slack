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


const Root = () => {
  const [width, height] = useWindowSize();
  const Joined = useRef(false);
  const {
    state,
    changeLayout,
    initialiseSocket,
    fetchAuthUser,
    setDevice,
  } = useContext(AppContext);


  useEffect(() => {
    const device = isMobile() ? "mobile" : "desktop";
    const socket = handleSocketConnection();
    setDevice(device);

    if (Cookies.get("token")) {
      fetchAuthUser();
    } else {
      const publicStates = ["/login", "/signup"];
      navigate(publicStates.includes(location.pathname) ? location.pathname : "/signup");
    }
    console.log("Should have a user", state.user)
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (state.style.device && state.style.device !== "mobile") {
      changeLayout({ width, height });
    }
  }, [state.style.device, width, height]);

  useEffect(() => {
    const { socket, user } = state;
    // if socket changes, make sure to change joined.current = false
    if(!socket && Joined.current){
      Joined.current = false;
    }
    // do not join everytime user data changed, this should be only one time event
    if(socket && user.data && !Joined.current){
      Joined.current = true;
      socket.emit("registerUserForSocket", user.data, (config) => {
        const { sub, id } = config;
        navigate(`/chat/${sub}/${id}`);
      });
    }
  }, [state.socket, state.user.data])


  const handleSocketConnection = () => {
    const { SOCKET_URL } = state.config.data;
    const socket = io.connect(SOCKET_URL);
    logger(socket);
    return socket;
  }

  const logger = (socket) => {
    socket.on("connect", () => {
      initialiseSocket(socket);
      console.log("Connected")
    });
    socket.on("disconnect", (reason) => {
      initialiseSocket(null);
      console.log("Disconnected: ", reason);
    });

    socket.on("error", (error) => {
      initialiseSocket(null);
      console.log("Errors:", error);
    });

    socket.on("reconnect_attempt", () => {
      console.log("Reconnecting");
    });
  };

  // if token is found, wait for user to resolved and stocket
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
