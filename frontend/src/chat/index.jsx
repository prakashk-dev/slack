import React, { useState, useEffect, useContext } from "react";
import { Layout } from "antd";
import { useLocation, Redirect } from "@reach/router";

import Sidebar from "./sidebar";
import { AppContext } from "../context";

const { Content } = Layout;

const Chat = ({ children }) => {
  const [groupId, setGroupId] = useState(null);
  const { isAuthenticated } = useContext(AppContext);
  const location = useLocation();

  useEffect(() => {
    const groupId = location.pathname.replace("/chat/r/");
    setGroupId(groupId);
  }, [location.pathname]);

  return isAuthenticated() ? (
    <Layout theme="dark">
      <Sidebar groupId={groupId} />
      <Content>{children}</Content>
    </Layout>
  ) : (
    <Redirect to="/" noThrow />
  );
};

export default Chat;
