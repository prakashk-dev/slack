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
    setSubmitLayout({ ...submitLayout, loading: true });
    login(values, (err, user) => {
      if (err) {
        setSubmitLayout({ ...submitLayout, loading: false });
        setHttpError(err);
        return;
      }
      const { rooms, friends, groups } = user;
      // if user did browse any room before of had chat with any user,
      // we want to land them on their last active url
      if (rooms.length || groups.length) {
        // join user to all the rooms and groups
        const roomsAndGroups = [
          ...rooms.map(({ room }) => room.id),
          ...groups.map(({ group }) => group.id),
        ];
        const payload = {
          roomsAndGroups,
          id: user.id,
        };
        state.socket.emit("joinUserToAllRoomsAndGroups", payload, () => {
          navigate(getLastActiveUrl(user));
        });
      } else {
        // if user just logged in and logout before without browsing any room or friend or group
        state.socket.emit("registerUsersSocket", user.id, () => {
          navigate(`/chat/r/welcome`);
        });
      }
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
