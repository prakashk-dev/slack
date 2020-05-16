import React, { useState, useContext, useEffect } from "react";
import { navigate, Redirect, useParams } from "@reach/router";
import { AppContext } from "src/context";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

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
  const [submitLayout, setSubmitLayout] = useState({
    block: true,
    type: "primary",
    htmlType: "submit",
    disabled: valid,
  });

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
  const formLayout = {
    scrollToFirstError: true,
    size: "large",
    layout: "vertical",
    onFinish: handleSubmit,
    help: "Some help text",
  };

  return isAuthenticated() ? (
    <Redirect to="/chat/g/welcome" noThrow />
  ) : (
    <div className="form">
      <Form {...formLayout}>
        <InfoBar />

        <Form.Item label="Username">
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            type="text"
            name="username"
            id="username"
            onChange={(e) => setUsername(e.target.value)}
            onBlur={checkUsername}
            placeholder="Choose a username or enter one if you already visited before."
            rules={[{ required: true, message: "$name is requird" }]}
          />
        </Form.Item>
        <Form.Item label="PIN">
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            name="pin"
            maxLength="4"
            inputMode="numeric"
            id="pin"
            value={pin}
            onChange={handleChange}
            placeholder="Choose your 4 digits pin"
            rules={[{ required: true, message: "$name is requird" }]}
          />
        </Form.Item>
        <Form.Item>
          <Button {...submitLayout}>Lets Chat</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default HomeForm;
