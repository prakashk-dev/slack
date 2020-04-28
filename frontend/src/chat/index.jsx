import React, { useState, useEffect } from "react";
import axios from "axios";

import "./chat.scss";

const Chat = () => {
  const [currentTab, setCurrentTab] = useState("room");
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    axios.get("/api/groups").then((res) => {
      setGroups(res.data);
    });
    axios.get("/api/users").then((res) => {
      setUsers(res.data);
    });
  }, []);

  return (
    <div className="chat">
      <div className="chat-navigation">
        <p>Select a {currentTab} to start your first chat</p>
      </div>
      <div className="chat-list">
        {currentTab === "user"
          ? users.length
            ? users.map((user) => {
                return (
                  <div key={user.username} className="groups list">
                    <div className="image">
                      <img src={user.image} alt="" />
                    </div>
                    <div className="name">{user.username}</div>
                  </div>
                );
              })
            : null
          : groups.length
          ? groups.map((group) => {
              return (
                <div key={group.name} className="groups list">
                  <div className="image">
                    <img src={group.image} alt="" />
                  </div>
                  <div className="name">{group.name} (10)</div>
                </div>
              );
            })
          : null}
      </div>
      <div className="chat-footer">
        <div
          className={currentTab === "room" ? "active" : null}
          onClick={() => setCurrentTab("room")}
        >
          Rooms (50)
        </div>
        <div
          className={currentTab === "user" ? "active" : null}
          onClick={() => setCurrentTab("user")}
        >
          Users (50)
        </div>
      </div>
    </div>
  );
};

export default Chat;
