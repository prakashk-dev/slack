import React, { useContext, useLayoutEffect, useEffect, useState } from "react";
import { Router, Redirect } from "@reach/router";
import { AppProvider } from "src/context";
import Chat from "src/chat";
import GroupMessage from "src/chat/message";
import { AppContext } from "src/context";
import Home from "src/home";
import "./style.scss";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AppContext);
  return isAuthenticated() ? <Router> {children}</Router> : <Redirect to="/" />;
};
const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
};

const Root = () => {
  const [width, height] = useWindowSize();
  const { changeLayout } = useContext(AppContext);
  useEffect(() => {
    changeLayout({ width, height });
  }, [width, height]);

  return (
    <div className="app">
      <Router>
        <Home path="/" />
        <Chat path="chat">
          {/* <GroupMessage path="u/:username" /> */}
          <GroupMessage path="g/:id" />
        </Chat>
        <Home path="*" />
      </Router>
    </div>
  );
};

const App = () => {
  return (
    <React.StrictMode>
      <AppProvider>
        <Root />
      </AppProvider>
    </React.StrictMode>
  );
};

export default App;
