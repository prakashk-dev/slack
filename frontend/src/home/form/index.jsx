import React, { useState, useContext, useEffect } from "react";
import { navigate, Redirect } from "@reach/router";
import axios from "axios";
import { AppContext } from "src/context";

import "./form.scss";
const PIN = /^\d{4}/;
const HomeForm = () => {
  const { saveOrAuthenticateUser, fetchConfig, isAuthenticated } = useContext(
    AppContext
  );
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState(null);
  const [valid, setValid] = useState(false);
  const [message, setMessage] = useState(null);
  const [pinError, setPinError] = useState(null);

  // validatoin for submit button
  useEffect(() => {
    setValid(username.length && PIN.test(pin));
    setError(null);
  }, [username, pin]);

  useEffect(() => {
    setMessage(null);
  }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = await saveOrAuthenticateUser({ username, pin });
    error ? setError(error) : navigate(`/chat/g/welcome`);
  };

  const handleChange = (e) => {
    const { value } = e.target;
    if (!isNaN(value)) {
      setPin(value);
      setPinError(null);
    } else {
      setPinError("Only digits are allowed for PIN");
    }
  };

  const checkUsername = () => {
    username.length && setMessage(`Welcome Back, ${username}`);
  };
  const InfoBar = () => {
    return (
      <div className={error ? "error" : message ? "info" : ""}>
        {error || message}
      </div>
    );
  };

  return isAuthenticated() ? (
    <Redirect to="/chat/g/welcome" noThrow />
  ) : (
    <form className="form" onSubmit={handleSubmit}>
      <InfoBar />
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          className="form-control"
          required
          onChange={(e) => setUsername(e.target.value)}
          onBlur={checkUsername}
        />
      </div>

      <div className="form-group">
        <label htmlFor="pin">PIN</label>
        <input
          type="password"
          name="pin"
          maxLength="4"
          inputMode="numeric"
          id="pin"
          className="form-control"
          value={pin}
          onChange={handleChange}
          placeholder="Choose your 4 digits pin"
          required
        />
        <div className="pin-error">{pinError}</div>
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
