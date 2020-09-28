import React, { useContext } from "react";
import { AppContext } from "src/context";
import Navigation from "./nav";
import "./home.scss";


const Home = ({ children }) => {
  const { isAuthenticated } = useContext(AppContext);


  return isAuthenticated() ? null : (
    <div className="home">
      <Navigation></Navigation>
      <div className="body">
        <div className="left-body">
          <img
            src="assets/logo.png"
            alt="Logo"
          />
        </div>
        <div className="right-body">{children}</div>
      </div>
    </div>
  );
};

export default Home;
