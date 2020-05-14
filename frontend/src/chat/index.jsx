import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "src/context";

import Sidebar from "./sidebar";
import "./chat.scss";

const Chat = ({ children, ...args }) => {
  const [groupId, setGroupId] = useState(null);
  const {
    state: { style },
  } = useContext(AppContext);

  useEffect(() => {
    const groupId = args["*"].split("/")[1];
    setGroupId(groupId);
  }, [args["*"]]);

  return (
    <div
      className={
        style.device === "mobile"
          ? style.showSidebar
            ? "mobile-chat-with-sidebar-open"
            : "mobile-chat"
          : "chat"
      }
    >
      {style.showSidebar && <Sidebar groupId={groupId}></Sidebar>}
      {children}
    </div>
  );
};

export default Chat;
