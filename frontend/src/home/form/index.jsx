import React, { useState, useContext, useEffect } from "react";
import { navigate } from "@reach/router";
import axios from "axios";
import { AppContext } from "src/context";

import "./form.scss";

const HomeForm = () => {
  const { state, saveUser, fetchConfig } = useContext(AppContext);
  const [valid, setValid] = useState(false);
  const [editable, setEditable] = useState(false);
  const [user, setUser] = useState(state.user);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((user) => ({ ...user, [name]: value }));
  };

  // If username is persited, do not ask backend for unique username
  useEffect(() => {
    fetchConfig();
    async function fetchUsername() {
      const res = await axios("/api/users/unique");
      setUser((user) => ({ ...user, username: res.data }));
    }
    if (!user.username || !user.username.length) {
      fetchUsername();
    }
  }, []);

  // validatoin for submit button
  useEffect(() => {
    const { gender, ageGroup, username } = user;
    const isValid = (field) => field && field.length;
    setValid(isValid(gender) && isValid(ageGroup) && isValid(username));
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = await saveUser(user);
    if (error) {
      setError(error);
    } else {
      navigate(`/chat/g/welcome`);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <p className="error">{error && error}</p>
      <div className="form-control">
        <label htmlFor="username">Username</label>
        <div className="form-group username">
          {editable ? (
            <input
              type="text"
              placeholder="Pick a username for this session"
              value={user.username}
              name="username"
              onChange={handleChange}
            />
          ) : (
            <div className="username-unique">
              <div className="username">{user.username}</div>
              <button type="button" onClick={() => setEditable(!editable)}>
                Change
              </button>
            </div>
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
              onChange={handleChange}
              checked={user.gender === "female"}
            />
            Female
          </div>
          <div className="input-group">
            <input
              type="radio"
              name="gender"
              id="gender"
              value="male"
              onChange={handleChange}
              checked={user.gender === "male"}
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
              onChange={handleChange}
              checked={user.ageGroup === "1"}
            />
            Below 20 Years
          </div>
          <div className="input-group">
            <input
              type="radio"
              name="ageGroup"
              value="2"
              onChange={handleChange}
              checked={user.ageGroup === "2"}
            />
            20 - 30 Years
          </div>
          <div className="input-group">
            <input
              type="radio"
              name="ageGroup"
              value="3"
              onChange={handleChange}
              checked={user.ageGroup === "3"}
            />
            30 - 40 Years
          </div>
          <div className="input-group">
            <input
              type="radio"
              name="ageGroup"
              value="4"
              onChange={handleChange}
              checked={user.ageGroup === "4"}
            />
            40+ Years
          </div>
        </div>
      </div>
      <div className="form-control form-footer">
        <button className="chat" disabled={!valid}>
          Let's Chat
        </button>
      </div>
    </form>
  );
};

export default HomeForm;
