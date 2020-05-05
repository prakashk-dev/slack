import React, { useState, useEffect, useContext } from "react";
import { navigate } from "@reach/router";
import { useFetch } from "src/utils/axios";
import { AppContext } from "src/context";
import axios from "axios";
import "./sidebar.scss";

const Sidebar = ({ groupId }) => {
  const [rooms, rLoading, rError] = useFetch("groups");
  const { state } = useContext(AppContext);
  const [user, uLoading, uError] = useFetch(`users/${state.user.username}`);

  return (
    <div className="sidebar">
      <div className="app-logo" onClick={() => navigate("/")}>
        BHET-GHAT CHAT
      </div>
      <div className="rooms">
        <div className="rooms-heading">
          <div className="caret"> - </div>
          Rooms
        </div>
        <div className="rooms-list">
          {rLoading ? (
            <div className="loading">Loading ... </div>
          ) : rError ? (
            <div className="error"> {rError} </div>
          ) : (
            rooms &&
            rooms.map((g) => (
              <li
                onClick={() => navigate(`/chat/g/${g._id}`)}
                key={g._id}
                className={g._id === groupId ? "active" : null}
              >
                # {g.name}
              </li>
            ))
          )}
        </div>
      </div>
      <div className="users">
        <div className="users-heading">
          <div className="caret">-</div>
          Direct Messages
        </div>
        <div className="users-list">
          {uLoading && <li>Loading ... </li>}
          {uError && <div className="error">{uError}</div>}
          {user && user.friends.length ? (
            user.friends.map((friend) => {
              return <li key={friend._id}>{friend.username}</li>;
            })
          ) : (
            <div> No friends.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
