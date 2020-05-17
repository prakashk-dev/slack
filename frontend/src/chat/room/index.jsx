import React, { useContext, useEffect, useState } from "react";
import Message from "src/chat/message";
import { AppContext } from "src/context";

const Room = ({ roomId }) => {
  const { fetchRoom } = useContext(AppContext);

  useEffect(() => {
    fetchRoom(roomId);
  }, [roomId]);

  return <Message entity="room" roomId={roomId} field="name" />;
};

export default Room;
