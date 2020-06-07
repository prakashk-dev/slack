import React, { useContext, useEffect, useState } from "react";
import Message from "src/chat/message";
import { AppContext } from "src/context";
import axios from "axios";

const Room = ({ roomId }) => {
  const { state, fetchRoomAndUpdatedUser } = useContext(AppContext);

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    // use this when user refresh the page
    // fetchRoomById(roomId, source);
    fetchRoomAndUpdatedUser(roomId, source);

    return () => source.cancel();
  }, [roomId, state.rooms]);
  return state.room.data ? (
    <Message receiver={state.room.data} onReceiver="room" />
  ) : null;
};

export default Room;
