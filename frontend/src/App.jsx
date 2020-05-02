import React, { useState } from "react";
import { Router, navigate } from "@reach/router";
import { INIT_STATE, AppContext, saveApplicationState } from "src/context";
import Chat from "src/chat";
import GroupMessage from "src/chat/message";
import Home from "src/home";
import "./style.scss";

const App = () => {
  const state = useState(INIT_STATE);

  // If user refresh the page save it to the localStorage
  window.onbeforeunload = (_e) => {
    saveApplicationState(state[0]);
  };

  return (
    <React.StrictMode>
      <AppContext.Provider value={state}>
        <div className="app">
          <Router>
            <Home path="/" />
            <Chat path="chat">
              {/* <GroupMessage path="u/:username" /> */}
              <GroupMessage path="g/:id" />
            </Chat>
          </Router>
        </div>
      </AppContext.Provider>
    </React.StrictMode>
  );
};

export default App;
