import React, { useState, useContext, useEffect } from "react";
import { navigate, Redirect } from "@reach/router";
import { AppContext } from "src/context";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import moment from "moment";

import "./form.scss";
const PIN = /[0-9]/;
const HomeForm = () => {
  const { saveOrAuthenticateUser, isAuthenticated } = useContext(AppContext);

  const [form] = Form.useForm();
  const [httpError, setHttpError] = useState(null);
  const [message, setMessage] = useState(null);
  const [submitLayout, setSubmitLayout] = useState({
    block: true,
    type: "primary",
    htmlType: "submit",
  });

  // refactor this
  const getLastActiveEntityId = (user) => {
    const { rooms, groups, friends } = user;
    const compareArrays = [rooms[0], groups[0], friends[0]];
    let lastActive = compareArrays.reduce(
      (lastActive, current) =>
        moment(lastActive).isAfter(current) ? lastActive : current,
      compareArrays[0].last_active
    );
    const { friend, room, group } = lastActive;
    const sub = friend ? "u" : room ? "r" : "g";
    const id =
      (friend && friend.id) || (room && room.id) || (group && group.id);
    return { sub, id };
  };

  const handleSubmit = async (values) => {
    saveOrAuthenticateUser(values, (err, user) => {
      if (err) {
        setHttpError(err);
        return;
      }
      const isReturningUser =
        user.rooms.length || user.friends.length || user.groups.length;
      if (isReturningUser) {
        const { sub, id } = getLastActiveEntityId(user);
        navigate(`/chat/${sub}/${id}`);
      } else {
        navigate(`/chat/r/welcome`);
      }
    });
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
    <Redirect to="/chat/r/welcome" noThrow />
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
