import React, { useState, useContext, useEffect } from "react";
import { navigate } from "@reach/router";
import { AppContext } from "src/context";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import moment from "moment";
import { isEmail } from "validator";

import "./login.scss";

const LoginForm = () => {
  const { login, state } = useContext(AppContext);

  const [form] = Form.useForm();
  const [httpError, setHttpError] = useState(null);
  const [submitLayout, setSubmitLayout] = useState({
    block: true,
    type: "primary",
    htmlType: "submit",
  });

  const handleSubmit = async (values) => {
    setSubmitLayout({ ...submitLayout, loading: true });
    login(values, (err, user) => {
      if (err) {
        setSubmitLayout({ ...submitLayout, loading: false });
        setHttpError(err);
        return;
      }
      state.socket.emit("registerUserForSocket", user, (config) => {
        const { sub, id } = config;
        navigate(`/chat/${sub}/${id}`);
      })
    });
  };

  const requiredValidation = (entity) => {
    return [
      {
        required: true,
        message: `${entity} is required`,
      },
    ];
  };

  const emailValidationRules = [
    ...requiredValidation("Email"),
    {
      validator(_, value) {
        return value && !isEmail(value)
          ? Promise.reject("Please type a valid email address.")
          : Promise.resolve();
      },
    },
  ];

  const InfoBar = () => (
    <div className={httpError ? "error" : ""}>{httpError}</div>
  );

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

  return (
    <div className="login-form">
      <Form {...formConfig}>
        <InfoBar />
        <Form.Item label="Email" name="email" rules={emailValidationRules}>
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            type="text"
            name="email"
            id="email"
          />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={requiredValidation("Password")}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            name="password"
            id="password"
          />
        </Form.Item>
        <p>
          <a> Forgot Password </a>
        </p>
        <Form.Item className="action-button">
          <Button {...submitLayout}>Sign In</Button>
        </Form.Item>
        <div className="sign-in">
          <p>Don't have an account ?</p>
          <a onClick={() => navigate("/signup")}>Sing Up</a>
        </div>
      </Form>
    </div>
  );
};

export default LoginForm;
