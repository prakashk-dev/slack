import React, { useContext, useEffect, useState } from "react";
import Message from "src/chat/message";
import { AppContext } from "src/context";
import axios from "axios";

const User = ({ username }) => {
  const { state, fetchUserChatInfo } = useContext(AppContext);

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    fetchUserChatInfo(state.user.data.id, username, source);
    return () => source.cancel();
  }, [username]);

  const isReady = () => {
    return state.user.data && state.friend.data;
  };
  return isReady() ? (
    <Message receiver={state.friend.data} onReceiver="user" />
  ) : null;
};

export default User;
