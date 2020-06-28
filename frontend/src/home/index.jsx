import React, { useEffect } from "react";
import Navigation from "./nav";

import "./home.scss";
import { navigate } from "@reach/router";

const Home = ({ children }) => {
  useEffect(() => {
    navigate("/signup");
  }, []);
  return (
    <div className="home">
      <Navigation></Navigation>
      <div className="body">{children}</div>
    </div>
  );
};

export default Home;
