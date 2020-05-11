import React, { useState, useContext, useEffect } from "react";
import { navigate } from "@reach/router";
import axios from "axios";
import { AppContext } from "src/context";

import "./form.scss";
const PIN = /^\d{4}$/;

const HomeForm = () => {
  const { saveUser, fetchConfig } = useContext(AppContext);
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [retypePin, setRetypePin] = useState("");
  const [error, setError] = useState(null);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  // validatoin for submit button
  useEffect(() => {
    const isValid = username.length && pin === retypePin;
    setValid(isValid);
  }, [username, pin, retypePin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = await saveUser({ username, pin });
    if (error) {
      setError(error);
    } else {
      navigate(`/chat/g/welcome`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (!isNaN(value)) {
      name === "pin" ? setPin(value) : setRetypePin(value);
    }
  };

  const PinError = () => {
    if (retypePin.length && retypePin !== pin) {
      return (
        <div className="pin-error">Your PIN and Retype PIN does not match.</div>
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
        <label htmlFor="pin">PIN</label>
        <input
          type="password"
          name="pin"
          maxLength="4"
          id="pin"
          className="form-control"
          value={pin}
          onChange={handleChange}
          placeholder="Choose your 4 digits pin"
        />
      </div>

      <div className="form-group">
        <label htmlFor="retypePin">Retype PIN</label>
        <input
          type="password"
          name="retype_pin"
          id="retypePin"
          inputmode="numeric" // for ios and andriod
          maxLength="4"
          value={retypePin}
          className="form-control"
          onChange={handleChange}
          placeholder="Retype your pin"
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
