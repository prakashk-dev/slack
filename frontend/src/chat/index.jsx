import React, { useState, useEffect, useContext } from "react";
import { Layout } from "antd";
import { Redirect } from "@reach/router";
import io from "socket.io-client";

import Sidebar from "src/chat/sidebar";
import Loading from "src/common/loading";
import { AppContext } from "src/context";
import "./chat.scss";

const { Content } = Layout;

const Chat = ({ children }) => {
  const {
    state,
    isAuthenticated,
    initialiseSocket,
    fetchAuthUser,
    fetchRooms,
  } = useContext(AppContext);

  useEffect(() => {
    const socket = io.connect(state.config.data.SOCKET_URL);
    initialiseSocket(socket);

    fetchAuthUser();
    fetchRooms();

    return () => {
      initialiseSocket(null);
      socket.disconnect();
    };
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
