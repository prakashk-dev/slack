import React, { useState, useContext, useEffect } from "react";
import { navigate, Redirect, useParams } from "@reach/router";
import axios from "axios";
import { AppContext } from "src/context";

import "./form.scss";
const PIN = /^\d{4}/;
const HomeForm = () => {
  const {
    state: {
      user: { data, error, loading },
    },
    saveOrAuthenticateUser,
    isAuthenticated,
    fetchRooms,
    fetchAuthUser,
  } = useContext(AppContext);

  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [valid, setValid] = useState(false);
  const [formError, setFormError] = useState(error);
  const [message, setMessage] = useState(null);
  const [pinError, setPinError] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // validatoin for submit button
  useEffect(() => {
    setValid(username.length && PIN.test(pin));
    setFormError(null);
  }, [username, pin]);

  useEffect(() => {
    setMessage(null);
  }, [username]);

  useEffect(() => {
    console.log(data.username);
    console.log(loading);
    if (error) {
      setFormError(error);
    } else if (data.username && formSubmitted && !loading) {
      setFormSubmitted(false);
      navigate(`/chat/g/welcome`);
    }
  }, [data, error, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    saveOrAuthenticateUser({ username, pin });
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
      <div className={formError ? "error" : message ? "info" : ""}>
        {formError || message}
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
