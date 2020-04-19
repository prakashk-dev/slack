import React, { Component, useContext } from "react";
import { AppContext } from "src/context";
const Chat = () => {
  const [state] = useContext(AppContext);
  console.log(state);
  return (
    <div style={{ width: "80%", margin: "auto" }}>
      <pre> {JSON.stringify(state, null, 2)}</pre>
    </div>
  );
};

export default Chat;
