import React, { useState, useContext, useEffect } from "react";
import { navigate } from "@reach/router";
import axios from "axios";
import { AppContext } from "src/context";

import "./form.scss";

const HomeForm = () => {
  const { saveOrAuthenticateUser, fetchConfig } = useContext(AppContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [error, setError] = useState(null);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  // validatoin for submit button
  useEffect(() => {
    const isValid = username.length && password === rePassword;
    setValid(isValid);
  }, [username, password, rePassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = await saveOrAuthenticateUser({ username, password });
    if (error) {
      setError(error);
    } else {
      navigate(`/chat/g/welcome`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (!isNaN(value)) {
      name === "password" ? setPassword(value) : setRePassword(value);
    }
  };

  const PinError = () => {
    if (rePassword.length && rePassword !== password) {
      return (
        <div className="password-error">
          Your PIN and Retype PIN does not match.
        </div>
      );
    }
    return null;
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className={error ? "error" : ""}>{error && error}</div>
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          className="form-control"
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">PIN</label>
        <input
          type="password"
          name="password"
          maxLength="4"
          inputMode="numeric"
          id="password"
          className="form-control"
          value={password}
          onChange={handleChange}
          placeholder="Choose your 4 digits password"
        />
      </div>

      <div className="form-group">
        <label htmlFor="rePassword">Retype PIN</label>
        <input
          type="password"
          name="retype_password"
          id="rePassword"
          inputMode="numeric" // for ios and andriod
          maxLength="4"
          value={rePassword}
          className="form-control"
          onChange={handleChange}
          placeholder="Retype your password"
        />
        <PinError />
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
