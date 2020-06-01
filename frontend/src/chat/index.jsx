import React, { useState, useEffect, useContext } from "react";
import { Layout } from "antd";

import Sidebar from "src/chat/sidebar";
import { AppContext } from "src/context";
import "./chat.scss";
import { Redirect } from "@reach/router";

const { Content } = Layout;

const Chat = ({ children }) => {
  const { isAuthenticated, fetchRooms } = useContext(AppContext);

  useEffect(() => {
    fetchRooms();
  }, []);
  return isAuthenticated() ? (
    <Layout theme="light">
      <Sidebar />
      <Content>{children}</Content>
    </Layout>
  ) : (
    <Redirect to="/" noThrow />
  );
};

export default Chat;
