import React, { useContext, useEffect, useState } from "react";
import Message from "src/chat/message";
import { AppContext } from "src/context";

const User = ({ username }) => {
  const { state, fetchUserChatInfo } = useContext(AppContext);

  useEffect(() => {
    fetchUserChatInfo(state.user.data.id, username);
  }, [username]);

  const isReady = () => {
    return state.user.data && state.friend.data;
  };
  return isReady() ? (
    <Message receiver={state.friend.data} onReceiver="user" />
  ) : null;
};

export default User;
