import React, { useState, useEffect, useContext } from "react";
import { Layout } from "antd";
import { Redirect } from "@reach/router";

import Sidebar from "src/chat/sidebar";
import Loading from "src/common/loading";
import { AppContext } from "src/context";
import "./chat.scss";

const { Content } = Layout;

const Chat = ({ children }) => {
  const { state, isAuthenticated, fetchAuthUser, fetchRooms } = useContext(
    AppContext
  );

  useEffect(() => {
    fetchAuthUser();
    fetchRooms();
  }, []);

  const isReady = () => {
    return state.rooms.data.length && state.socket;
  };
  return isAuthenticated() ? (
    isReady() ? (
      <Layout theme="dark">
        <Sidebar />
        <Content>{children}</Content>
      </Layout>
    ) : (
      <Loading />
    )
  ) : (
    <Redirect to="/" noThrow />
  );
};

export default Chat;
