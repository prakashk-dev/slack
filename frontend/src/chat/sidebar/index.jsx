import React, { useState, useEffect } from "react";
import { navigate } from "@reach/router";
import useFetch from "src/utils/axios";
import axios from "axios";
import "./sidebar.scss";

const Sidebar = ({ groupId }) => {
  const group = useFetch("groups/name");

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
          {group.loading ? (
            <div className="loading">Loading ... </div>
          ) : group.data.error ? (
            <div className="error"> {group.data.error} </div>
          ) : (
            group.data.map((g) => (
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
          <li>Users</li>
          <li>Users</li>
          <li>Users</li>
          <li>Users</li>
          <li>Users</li>
          <li>Users</li>
          <li>Users</li>
          <li>Users</li>
          <li>Users</li>
          <li>Users</li>
          <li>Users</li>
          <li>Users</li>
          <li>Users</li>
          <li>Users</li>
          <li>Users</li>
          <li>Users</li>
          <li>Users</li>
          <li>Users</li>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
