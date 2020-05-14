import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import { AppContext } from "src/context";

import Sidebar from "./sidebar";
import "./chat.scss";

const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
};

const Chat = ({ children, ...args }) => {
  const [groupId, setGroupId] = useState(null);
  const [width, height] = useWindowSize();
  const {
    changeLayout,
    state: { style },
  } = useContext(AppContext);
  useEffect(() => {
    changeLayout({ width, height });
  }, [width, height]);

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
