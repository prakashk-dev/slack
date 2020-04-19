import React, { Component } from "react";
import { Router } from "@reach/router";
import Chat from "src/chat";
import Home from "src/home";
import "./style.scss";

class App extends Component {
  render() {
    return (
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
    );
  }
}

export default App;
