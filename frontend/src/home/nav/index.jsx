import React from "react";
import { navigate } from "@reach/router";
import "./nav.scss";

const Navigation = () => {
  return (
    <div className="main-nav">
      <img src="/assets/globe.gif" alt="globe" className="globe" />
      <div className="logo" onClick={() => navigate("/")}>
        BHETGHAT LOGO HERE
      </div>
      <img src="/assets/nepali_flag.gif" alt="flag" />
    </div>
  );
};

export default Navigation;
