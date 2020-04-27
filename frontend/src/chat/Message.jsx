import React, { useState, useContext, useEffect } from "react";
import { navigate } from "@reach/router";
import { AppContext } from "src/context";
import axios from "axios";

const socket = new WebSocket("ws://localhost:3001");
import "./message.scss";

const Message = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const state = useContext(AppContext);
  // const users = [
  //   {
  //     name: "user",
  //     image: "/assets/kathmandu.png",
  //   },
  // ];

  useEffect(() => {
    axios.get("/api/users").then((res) => {
      const { data } = res.data;
      console.log(data);
      setUsers(data);
    });
    axios.get("/api/groups").then((res) => {
      const { data } = res.data;
      console.log(data);
      setGroups(data);
    });
  }, state);

  socket.addEventListener("open", (event) => {
    socket.send(JSON.stringify(state[0].user));
  });

  socket.addEventListener("message", (event) => {
    console.log(event.data);
  });

  // const groups = [
  //   {
  //     name: "Kathmandu",
  //     image: "/assets/kathmandu.png",
  //   },
  // ];

  // const usersCount = Array.from({ length: 25 }, (v, k) => k + 1);

  const sendMessage = () => {
    socket.send(message);
  };

  return (
    <div className="message">
      <div className="message-navigation">
        <div className="back-button">
          <button onClick={() => navigate("/chat")}>&lt; Back</button>
        </div>
        <div className="chat-title">Kathmandu - Chat Room</div>
      </div>
      <div className="message-body">
        <div className="message-body-overlay">
          <div className="tabs">
            <div
              className="rooms"
              onClick={() => setActiveTab("users")}
              style={{
                backgroundColor: activeTab === "users" ? "blue" : "blueviolet",
              }}
            >
              Personal Chat
            </div>
            <div className="divider"></div>
            <div
              className="personal-chat"
              onClick={() => setActiveTab("groups")}
              style={{
                backgroundColor: activeTab === "groups" ? "blue" : "blueviolet",
              }}
            >
              Rooms
            </div>
          </div>
          <div className="overlay-body">
            {activeTab === "users" &&
              users.length &&
              users.map((user) => {
                return (
                  <li key={user["username"]}>
                    <img src="/assets/kathmandu.png" alt="" />
                    {user["username"]}
                  </li>
                );
              })}
            {activeTab === "groups" &&
              groups.length &&
              groups.map((group) => {
                return (
                  <li key={group["name"]}>
                    <img src="/assets/kathmandu.png" alt="" />
                    {group["name"]}
                  </li>
                );
              })}
          </div>
        </div>
        <div className="message-area">
          <div className="message">
            <p>Some Cool Heading</p>
            <div id="chat">{}</div>
          </div>
          <div className="write-message">
            <div className="icons">
              <img src="/assets/gif" alt="" />
              <svg
                className="bi bi-file-earmark-plus"
                width="2em"
                height="2em"
                viewBox="0 0 16 16"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9 1H4a2 2 0 00-2 2v10a2 2 0 002 2h5v-1H4a1 1 0 01-1-1V3a1 1 0 011-1h5v2.5A1.5 1.5 0 0010.5 6H13v2h1V6L9 1z" />
                <path
                  fillRule="evenodd"
                  d="M13.5 10a.5.5 0 01.5.5v2a.5.5 0 01-.5.5h-2a.5.5 0 010-1H13v-1.5a.5.5 0 01.5-.5z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M13 12.5a.5.5 0 01.5-.5h2a.5.5 0 010 1H14v1.5a.5.5 0 01-1 0v-2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              value={message}
              name="message"
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>
              <svg
                className="bi bi-cursor-fill"
                width="1.5em"
                height="1.5em"
                color="blueviolet"
                viewBox="0 0 16 16"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M14.082 2.182a.5.5 0 01.103.557L8.528 15.467a.5.5 0 01-.917-.007L5.57 10.694.803 8.652a.5.5 0 01-.006-.916l12.728-5.657a.5.5 0 01.556.103z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Message;
