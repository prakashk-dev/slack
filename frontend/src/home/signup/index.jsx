import React, { useState, useContext, useEffect } from "react";
import { navigate, Redirect } from "@reach/router";
import { AppContext } from "src/context";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import moment from "moment";

import "./signup.scss";
const PIN = /[0-9]/;
const HomeForm = () => {
  const { saveOrAuthenticateUser, state } = useContext(AppContext);

  const [form] = Form.useForm();
  const [httpError, setHttpError] = useState(null);
  const [message, setMessage] = useState(null);
  const [submitLayout, setSubmitLayout] = useState({
    block: true,
    type: "primary",
    htmlType: "submit",
  });

  useEffect(() => {
    if (state.user.data) {
      const { data: user } = state.user;
      const isReturningUser =
        (user.rooms && user.rooms.length) ||
        (user.friends && user.friends.length) ||
        (user.groups && user.groups.length);
      if (isReturningUser) {
        // join user to all the rooms and blah blah blah
        const rg = [
          ...user.rooms.map((room) => room.room.id),
          ...user.groups.map((group) => group.group.id),
        ];
        state.socket.emit("joinUserToAllRoomsAndGroups", rg);
        navigate(getLastActiveUrl(user));
      }
    }
  }, [state.user.data]);

  const getLastActiveUrl = (user) => {
    const { rooms, groups, friends } = user;
    let compareArrays = [rooms[0], groups[0], friends[0]];
    compareArrays = compareArrays.filter((arr) => {
      if (arr === undefined) {
        return false;
      } else {
        return arr.friend
          ? arr.status !== "pending" || arr.status !== "rejected"
          : true;
      }
    });

    let lastActive = compareArrays.reduce(
      (lastActive, current) =>
        moment(lastActive.last_active).isAfter(current.last_active)
          ? lastActive
          : current,
      compareArrays[0]
    );

    const { friend, room, group } = lastActive;
    const sub = friend ? "u" : room ? "r" : "g";
    const id =
      (friend && friend.username) || (room && room.id) || (group && group.id);
    return `/chat/${sub}/${id}`;
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
        // join user to all the rooms and blah blah blah
        const rg = [
          ...user.rooms.map((room) => room.room.id),
          ...user.groups.map((group) => group.group.id),
        ];
        state.socket.emit("joinUserToAllRoomsAndGroups", rg);
        navigate(getLastActiveUrl(user));
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

  const emailValidationRules = [
    {
      required: true,
      message: "Email is requird",
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

  return (
    <div className="signup-container">
      <div className="form-container">
        <div className="form">
          <Form {...formConfig}>
            <InfoBar />
            <Form.Item label="Full Name" name="full_name">
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                type="text"
                name="full_name"
                id="fullName"
                onChange={() => setMessage(null)}
                placeholder="Enter a name"
              />
            </Form.Item>
            <Form.Item label="Email" name="email" rules={emailValidationRules}>
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                type="text"
                name="email"
                id="email"
                onChange={() => setMessage(null)}
                placeholder="Enter your email address"
              />
            </Form.Item>
            <Form.Item label="Password" name="pin" rules={pinValidationRules}>
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                name="pin"
                maxLength="4"
                inputMode="numeric"
                id="PIN"
                placeholder="Create your password"
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
      <div className="info">
        <div className="app-slogan">
          <h1>Welcome to Bhet-Ghat</h1>
          <p>1. New Way to Collaborate</p>
          <p>2. New Way to Collaborate</p>
          <p>3. New Way to Collaborate</p>
        </div>
        <div className="get-started">
          <h2>Easy to start</h2>
          <p>1. Sign Up</p>
          <p>2. Select a room to explore</p>
          <p>3. Select a room to explore</p>
        </div>
      </div>
    </div>
  );
};

export default HomeForm;
