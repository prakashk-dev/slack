import React, { useContext, useEffect, useState } from "react";
import Message from "src/chat/message";
import { AppContext } from "src/context";

const Room = ({ roomId }) => {
  const { fetchRoomById } = useContext(AppContext);

  useEffect(() => {
    fetchRoomById(roomId);
  }, [roomId]);

  return <Message entity="room" roomId={roomId} field="name" />;
};

export default Room;
