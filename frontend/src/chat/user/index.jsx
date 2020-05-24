import React, { useContext, useEffect } from "react";
import Message from "src/chat/message";
import { AppContext } from "src/context";

const User = ({ username }) => {
  const { state, fetchUserChatInfo } = useContext(AppContext);
  useEffect(() => {
    fetchUserChatInfo(state.user.data.id, username);
  }, [username]);

  return <Message entity="user" roomId={username} field="username" />;
};

export default User;
