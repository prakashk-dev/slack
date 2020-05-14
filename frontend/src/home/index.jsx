import React, { useContext } from "react";
import Navigation from "./nav";
import UserForm from "./form/";

import "./home.scss";
import { AppContext } from "src/context";

const Home = () => {
  const {
    state: { style },
  } = useContext(AppContext);
  return (
    <div className={style.layout === "mobile" ? "mobile-home" : "home"}>
      <Navigation></Navigation>
      <div className="body">
        <div className="heading">
          <p className="title">Welcome to BhetGhat</p>
          मिलनको हाम्रो चौतारी
          <p>Tell us about yourself</p>
          <hr />
        </div>
        <UserForm></UserForm>
      </div>
    </div>
  );
};

export default Home;
