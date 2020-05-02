import React, { useState } from "react";
import Sidebar from "./sidebar";
import "./chat.scss";

const Chat = ({ children }) => {
  const [newUser, setNewUser] = useState(false);
  return (
    <div className="chat">
      <Sidebar></Sidebar>
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
