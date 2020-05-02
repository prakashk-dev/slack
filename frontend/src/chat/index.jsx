import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import "./chat.scss";

const Chat = ({ children, ...args }) => {
  const [newUser, setNewUser] = useState(false);
  const [groupId, setGroupId] = useState(null);

  useEffect(() => {
    const groupId = args["*"].split("/")[1];
    setGroupId(groupId);
  }, [args["*"]]);

  return (
    <div className="chat">
      <Sidebar groupId={groupId}></Sidebar>
      {newUser ? (
        <div className="new-user">
          Select a room or users from the sidebar to start exporing.
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default Chat;
