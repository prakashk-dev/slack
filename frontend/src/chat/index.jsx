import React, { useState, useEffect, useContext } from "react";
import { Layout } from "antd";
import { Redirect } from "@reach/router";

import Sidebar from "src/chat/sidebar";
import { AppContext } from "src/context";
import "./chat.scss";

const { Content } = Layout;

const Chat = ({ children }) => {
  const { isAuthenticated } = useContext(AppContext);

  return isAuthenticated() ? (
    <Layout theme="dark">
      <Sidebar />
      <Content>{children}</Content>
    </Layout>
  ) : (
    <Redirect to="/" noThrow />
  );
};

export default Chat;
