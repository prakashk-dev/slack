import React, { useState } from "react";
import { Router } from "@reach/router";
import { INIT_STATE, AppContext, saveApplicationState } from "src/context";
import Chat from "src/chat";
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
          <nav>Developed On: 18, Apri, 2020</nav>
          <main>
            <div className="main-nav">
              <div className="spinning-globe">
                <img src="/assets/globe.gif" alt="globe" />
              </div>
              <div className="logo">BHETGHAT LOGO HERE</div>
              <div className="nepal-flag">
                <img src="/assets/nepali_flag.gif" alt="flag" />
              </div>
            </div>
            <div className="main-body">
              <Router>
                <Home path="/" />
                <Chat path="chat" />
              </Router>
            </div>
          </main>
          <footer></footer>
        </div>
      </AppContext.Provider>
    </React.StrictMode>
  );
};

export default App;
