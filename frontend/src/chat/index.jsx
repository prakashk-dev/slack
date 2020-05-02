import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import "./chat.scss";

const Chat = ({ children, ...args }) => {
  const [groupId, setGroupId] = useState(null);

  useEffect(() => {
    const groupId = args["*"].split("/")[1];
    setGroupId(groupId);
  }, [args["*"]]);

  return (
    <div className="chat">
      <Sidebar groupId={groupId}></Sidebar>
      {children}
    </div>
  );
};

export default Chat;
