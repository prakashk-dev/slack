import React, { useState, useContext } from "react";
import { navigate } from "@reach/router";
import { AppContext } from "src/context";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { isEmail } from "validator";

import "./signup.scss";
const HomeForm = () => {
  const { signup } = useContext(AppContext);

  const [form] = Form.useForm();
  const [httpError, setHttpError] = useState(null);
  const [submitLayout, setSubmitLayout] = useState({
    block: true,
    type: "primary",
    htmlType: "submit",
  });

  const handleSubmit = async (values) => {
    setSubmitLayout({ ...submitLayout, loading: true });
    signup(values, (err, user) => {
      if (err) {
        setHttpError(err);
        setSubmitLayout({ ...submitLayout, loading: false });
        return;
      }
      navigate(`/chat/r/welcome`);
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

  const passwordValidationRule = [
    ...requiredValidation("Password"),
    {
      validator(_, value) {
        return value && value.length < 6
          ? Promise.reject("Password must be at least 6 characters long.")
          : Promise.resolve();
      },
    },
  ];

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
    <div className="form-container">
      <div className="form">
        <Form {...formConfig}>
          <InfoBar />
          <div className="name">
            <Form.Item
              label="First Name"
              name="first_name"
              rules={requiredValidation("First Name")}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                type="text"
                name="first_name"
                id="firstName"
              />
            </Form.Item>
            <Form.Item
              label="Last Name"
              name="last_name"
              rules={requiredValidation("Last Name")}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                type="text"
                name="last_name"
                id="lastName"
              />
            </Form.Item>
          </div>
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
            rules={passwordValidationRule}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              name="password"
              id="Password"
            />
          </Form.Item>
          <Form.Item className="action-button">
            <Button {...submitLayout}>Sign Up</Button>
          </Form.Item>
          <div className="sign-in">
            <p>Already have an account ?</p>
            <a onClick={() => navigate("/login")}>Sing In</a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default HomeForm;
