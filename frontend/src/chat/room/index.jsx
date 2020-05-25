import React, { useContext, useEffect, useState } from "react";
import Message from "src/chat/message";
import { AppContext } from "src/context";

const Room = ({ roomId }) => {
  const { state, fetchRoomById } = useContext(AppContext);

  useEffect(() => {
    fetchRoomById(roomId);
  }, [roomId]);

  return state.room.data ? (
    <Message
      entity="room"
      roomId={roomId}
      field="name"
      receiver={state.room.data}
      onReceiver="room"
    />
  ) : null;
};

export default Room;
