import React, { useState, useEffect, useContext } from "react";
import { Layout } from "antd";

import Sidebar from "./sidebar";

const { Content } = Layout;

const Chat = ({ children, ...args }) => {
  const [groupId, setGroupId] = useState(null);

  useEffect(() => {
    const groupId = args["*"].split("/")[1];
    setGroupId(groupId);
  }, [args["*"]]);

  return (
    <Layout theme="dark">
      <Sidebar groupId={groupId} />
      <Content>{children}</Content>
    </Layout>
  );
};

export default Chat;
