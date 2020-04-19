import { navigate } from "@reach/router";
import React, { useState } from "react";
import "./home.scss";

const Home = () => {
  const [gender, setGender] = useState("");
  const [ageGroup, setAgeGroup] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/chat?gender=${gender}&ageGroup=${ageGroup}`);
  };

  const isDisable = !gender.length || !ageGroup.length;
  return (
    <div className="home">
      <div className="body">
        <div className="heading">
          <p>Welcome to BhetGhat</p>
          मिलनको हाम्रो चौतारी
        </div>
        <div className="info">
          <p>Tell us about yourself</p>
          <div className="line">
            <hr />
          </div>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="gender">Gender</label>
            <div className="form-group">
              <div className="input-group">
                <input
                  type="radio"
                  name="gender"
                  id="gender"
                  value="female"
                  onClick={() => setGender("female")}
                />
                Female
              </div>
              <div className="input-group">
                <input
                  type="radio"
                  name="gender"
                  id="gender"
                  value="male"
                  onClick={() => setGender("male")}
                />
                Male
              </div>
              <div className="input-group">
                <input
                  type="radio"
                  name="gender"
                  id="gender"
                  value="na"
                  onClick={() => setGender("na")}
                />
                Don't want to tell
              </div>
            </div>
          </div>
          <div className="form-control">
            <label htmlFor="ageGroup">Age Group</label>
            <div className="form-group">
              <div className="input-group">
                <input
                  type="radio"
                  name="ageGroup"
                  value="1"
                  onClick={() => setAgeGroup("1")}
                />{" "}
                Below 20 Years
              </div>
              <div className="input-group">
                <input
                  type="radio"
                  name="ageGroup"
                  value="2"
                  onClick={() => setAgeGroup("2")}
                />{" "}
                20 - 30 Years
              </div>
              <div className="input-group">
                <input
                  type="radio"
                  name="ageGroup"
                  value="3"
                  onClick={() => setAgeGroup("3")}
                />{" "}
                30 - 40 Years
              </div>
              <div className="input-group">
                <input
                  type="radio"
                  name="ageGroup"
                  value="4"
                  onClick={() => setAgeGroup("4")}
                />{" "}
                40+ Years
              </div>
            </div>
          </div>
          <div className="form-control form-footer">
            <button className="chat" disabled={isDisable}>
              Let's Chat
            </button>
          </div>
          <div className="form-footer or-divider">OR</div>
          <div className="form-control form-footer">
            <button className="create">Create Account</button>
            <div className="help-text">
              Your chats will be saved if you have an account.
            </div>
          </div>
        </form>
      </div>
      <div className="footer">
        If you have an account
        <div className="login">
          <button>Log In</button>
        </div>
      </div>
    </div>
  );
};
export default Home;
