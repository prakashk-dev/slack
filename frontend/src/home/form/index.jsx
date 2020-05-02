import React, { useState, useContext, useEffect } from "react";
import { navigate } from "@reach/router";
import axios from "axios";
import { AppContext } from "src/context";

import "./form.scss";

const HomeForm = () => {
  const [state, setState] = useContext(AppContext);
  const { user } = state;

  const [gender, setGender] = useState(user.gender);
  const [ageGroup, setAgeGroup] = useState(user.ageGroup);
  const [username, setUsername] = useState(user.username);
  const [editable, setEditable] = useState(false);

  useEffect(() => {
    async function fetchUsername() {
      const res = await axios("/api/users/unique");
      setUsername(res.data);
    }
    !user.username && fetchUsername();
  }, [user.username]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setState({
      user: {
        gender,
        ageGroup,
        username,
      },
    });
    navigate(`/chat`);
  };
  const isInvalid = (field) => !field || !field.length;
  const isDisable =
    isInvalid(gender) || isInvalid(ageGroup) || isInvalid(username);
  return (
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
  );
};

export default HomeForm;
