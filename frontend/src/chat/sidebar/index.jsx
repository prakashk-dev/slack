import React from "react";
import { navigate } from "@reach/router";
import "./sidebar.scss";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="app-logo"> BHET-GHAT CHAT</div>
      <div className="rooms">
        <div className="rooms-heading">
          <p>Rooms</p>
        </div>
        <div className="rooms-list">
          <li onClick={() => navigate("chat/g/123")}># Rooms</li>
          <li># Rooms</li>
          <li># Rooms</li>
          <li># Rooms</li>
          <li># Rooms</li>
          <li># Rooms</li>
          <li># Rooms</li>
          <li># Rooms</li>
          <li># Rooms</li>
          <li># Rooms</li>
          <li># Rooms</li>
          <li># Rooms</li>
          <li># Rooms</li>
          <li># Rooms</li>
          <li># Rooms</li>
        </div>
      </div>
      <div className="users">
        <div className="users-heading">
          <p>Direct Messages</p>
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
