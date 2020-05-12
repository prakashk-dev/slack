import React, { useContext } from "react";
import { Router, Redirect } from "@reach/router";
import { AppProvider } from "src/context";
import Chat from "src/chat";
import GroupMessage from "src/chat/message";
import Home from "src/home";
import "./style.scss";
import { AppContext } from "./context";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AppContext);
  return isAuthenticated() ? <Router> {children}</Router> : <Redirect to="/" />;
};

const App = () => {
  return (
    <React.StrictMode>
      <AppProvider>
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
      </AppProvider>
    </React.StrictMode>
  );
};

export default App;
