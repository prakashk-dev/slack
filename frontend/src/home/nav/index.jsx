import React from "react";
import { navigate } from "@reach/router";
import "./nav.scss";

const Navigation = () => {
  return (
    <div className="main-nav">
      <div className="logo">
        <img src="/assets/logo.png" alt="Bhet-Ghat Logo" />
      </div>
      <div className="slogan">
        <li>
          <span className="bullet"></span>
          Explore
        </li>
        <li>
          <span className="bullet"></span>
          Join
        </li>
        <li>
          <span className="bullet"></span>
          Share
        </li>
      </div>
    </div>
  );
};

export default Navigation;
