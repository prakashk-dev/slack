import React from "react";
import { navigate } from "@reach/router";
import "./nav.scss";

const Navigation = () => {
  return (
    <div className="main-nav">
      <div className="logo">
        <img src="/assets/logo.png" alt="Bhet-Ghat Logo" />
      </div>
      <div className="slogan">Start your new network here</div>
    </div>
  );
};

export default Navigation;
