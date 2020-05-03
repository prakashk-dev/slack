import React from "react";
import { Router, navigate } from "@reach/router";
import { AppProvider } from "src/context";
import Chat from "src/chat";
import GroupMessage from "src/chat/message";
import Home from "src/home";
import "./style.scss";

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
          </Router>
        </div>
      </AppProvider>
    </React.StrictMode>
  );
};

export default App;
