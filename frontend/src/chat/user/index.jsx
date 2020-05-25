import React, { useContext, useEffect, useState } from "react";
import Message from "src/chat/message";
import { AppContext } from "src/context";

const User = ({ username }) => {
  const { state, fetchUserChatInfo } = useContext(AppContext);
  const [user, setUser] = useState(null);

  const [roomName, setRoomName] = useState(null);
  useEffect(() => {
    fetchUserChatInfo(state.user.data.id, username, (data) => {
      setUser(data);
    });
    setRoomName([state.user.data.username, username].sort().join("-"));
  }, [username]);

  const isReady = () => {
    return state.user.data && user;
  };
  return isReady() ? (
    <Message
      receiver={user}
      onReceiver="user"
      entity="user"
      roomId={roomName}
      field="username"
      to={user}
      privateChannel={{ socketId: state.user.data.id }}
    />
  ) : null;
};

export default User;
