import { navigate } from "@reach/router";
import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "src/context";
import axios from "axios";
import "./home.scss";

const Home = () => {
  const [globalState, setGlobalState] = useContext(AppContext);
  const [gender, setGender] = useState(globalState.user.gender);
  const [ageGroup, setAgeGroup] = useState(globalState.user.ageGroup);
  const [username, setUsername] = useState(globalState.user.username);
  const [editable, setEditable] = useState(false);

  useEffect(() => {
    console.log("hello");
    axios.get("/api/users/unique").then(
      (res) => {
        console.log("what is response", res);
        setUsername(res.data);
      },
      (error) => console.log("Error: ", error)
    );
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setGlobalState({
      user: {
        gender,
        ageGroup,
        username,
      },
    });
    navigate(`/chat`);
  };

  const isDisable = !gender.length || !ageGroup.length || !username.length > 2;
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
            <label htmlFor="username">Username</label>
            <div className="form-group username">
              {editable ? (
                <input
                  type="text"
                  placeholder="Pick a username for this session"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              ) : (
                <div className="username">{username || ""}</div>
              )}
              {!editable && (
                <button type="button" onClick={() => setEditable(!editable)}>
                  Change
                </button>
              )}
            </div>
          </div>
          <div className="form-control">
            <label htmlFor="gender">Gender</label>
            <div className="form-group gender">
              <div className="input-group">
                <input
                  type="radio"
                  name="gender"
                  id="gender"
                  value="female"
                  onChange={() => setGender("female")}
                  checked={gender === "female"}
                />
                Female
              </div>
              <div className="input-group">
                <input
                  type="radio"
                  name="gender"
                  id="gender"
                  value="male"
                  onChange={() => setGender("male")}
                  checked={gender === "male"}
                />
                Male
              </div>
            </div>
          </div>
          <div className="form-control">
            <label htmlFor="ageGroup">Age Group</label>
            <div className="form-group age-group">
              <div className="input-group">
                <input
                  type="radio"
                  name="ageGroup"
                  value="1"
                  onChange={() => setAgeGroup("1")}
                  checked={ageGroup === "1"}
                />{" "}
                Below 20 Years
              </div>
              <div className="input-group">
                <input
                  type="radio"
                  name="ageGroup"
                  value="2"
                  onChange={() => setAgeGroup("2")}
                  checked={ageGroup === "2"}
                />{" "}
                20 - 30 Years
              </div>
              <div className="input-group">
                <input
                  type="radio"
                  name="ageGroup"
                  value="3"
                  onChange={() => setAgeGroup("3")}
                  checked={ageGroup === "3"}
                />{" "}
                30 - 40 Years
              </div>
              <div className="input-group">
                <input
                  type="radio"
                  name="ageGroup"
                  value="4"
                  onChange={() => setAgeGroup("4")}
                  checked={ageGroup === "4"}
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
        </form>
      </div>
    </div>
  );
};

export default Home;
