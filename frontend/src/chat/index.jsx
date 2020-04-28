import React, { useState, useEffect } from "react";
import { navigate } from "@reach/router";
import axios from "axios";

import "./chat.scss";

const Chat = () => {
  const [tab, setTab] = useState("room");
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [subTab, setSubTab] = useState("old");

  useEffect(() => {
    axios.get("/api/groups").then((res) => {
      setGroups(res.data);
    });
    axios.get("/api/users").then((res) => {
      setUsers(res.data);
    });
  }, []);

  const handleClick = (id) => {
    navigate(`/chat/${id}`);
  };

  return (
    <div className="chat">
      <div className="chat-navigation">
        <p>Select a {tab} to start your first chat</p>
        {/* <div
          className={subTab === "old" ? " subtabs active" : null}
          onClick={() => setSubTab("old")}
        >
          Chat Again
        </div>
        <div
          className={subTab === "new" ? "subtabs active" : null}
          onClick={() => setSubTab("new")}
        >
          New {tab === "room" ? "Rooms" : "Users"}
        </div> */}
      </div>
      <div className="chat-list">
        {tab === "user"
          ? users.length
            ? users.map((user) => {
                return (
                  <div
                    key={user.username}
                    className="groups list"
                    onClick={() => handleClick(user._id)}
                  >
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
                <div
                  key={group.name}
                  className="groups list"
                  onClick={() => handleClick(group._id)}
                >
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
          className={tab === "room" ? "active" : null}
          onClick={() => setTab("room")}
        >
          Rooms (50)
        </div>
        <div
          className={tab === "user" ? "active" : null}
          onClick={() => setTab("user")}
        >
          Users (50)
        </div>
      </div>
    </div>
  );
};

export default Chat;
