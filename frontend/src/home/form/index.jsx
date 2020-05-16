import React, { useState, useContext, useEffect } from "react";
import { navigate, Redirect, useParams } from "@reach/router";
import { AppContext } from "src/context";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

import "./form.scss";
const PIN = /[0-9]/;
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

  const [form] = Form.useForm();
  const [httpError, setHttpError] = useState(error);
  const [message, setMessage] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitLayout, setSubmitLayout] = useState({
    block: true,
    type: "primary",
    htmlType: "submit",
  });

  useEffect(() => {
    if (error) {
      setHttpError(error);
    } else if (data.username && formSubmitted && !loading) {
      setFormSubmitted(false);
      navigate(`/chat/g/welcome`);
    }
  }, [data, error, loading]);

  const handleSubmit = async (values) => {
    console.log("Form Values", values);
    setFormSubmitted(true);
    saveOrAuthenticateUser(values);
  };

  const pinValidationRules = [
    {
      required: true,
      message: "PIN is required",
    },
    {
      validator(_, value) {
        return !value || !isNaN(value)
          ? Promise.resolve()
          : Promise.reject("Only digits are allowed for PIN");
      },
    },
  ];

  const usernameValidationRules = [
    {
      required: true,
      message: "Username is requird",
    },
  ];

  const checkUsername = () => {
    const username = form.getFieldValue("username");
    username.length && setMessage(`Welcome Back, ${username}`);
  };
  const InfoBar = () => {
    return (
      <div className={httpError ? "error" : message ? "info" : ""}>
        {httpError || message}
      </div>
    );
  };
  const handleSubmitError = (error) => {
    console.log("Error:", error);
  };

  const formConfig = {
    form,
    scrollToFirstError: true,
    name: "userForm",
    size: "large",
    layout: "vertical",
    onFinish: handleSubmit,
    onFinishFailed: handleSubmitError,
  };

  return isAuthenticated() ? (
    <Redirect to="/chat/g/welcome" noThrow />
  ) : (
    <div className="form">
      <Form {...formConfig}>
        <InfoBar />
        <Form.Item
          label="Username"
          name="username"
          rules={usernameValidationRules}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            type="text"
            name="username"
            id="Username"
            onBlur={checkUsername}
            onChange={() => setMessage(null)}
            placeholder="Choose a username or enter your last one"
          />
        </Form.Item>
        <Form.Item label="PIN" name="pin" rules={pinValidationRules}>
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            name="pin"
            maxLength="4"
            inputMode="numeric"
            id="PIN"
            placeholder="Choose your 4 digits pin"
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
