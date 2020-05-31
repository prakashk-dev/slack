import React, { useContext, useEffect, useState } from "react";
import Message from "src/chat/message";
import { AppContext } from "src/context";
import axios from "axios";

const Room = ({ roomId }) => {
  const { state, fetchRoomById } = useContext(AppContext);

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    fetchRoomById(roomId, source);
    return () => source.cancel();
  }, [roomId]);
  return state.room.data ? (
    <Message receiver={state.room.data} onReceiver="room" />
  ) : null;
};

export default Room;
