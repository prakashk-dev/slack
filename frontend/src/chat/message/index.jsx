import React, { useState, useContext, useEffect, useRef } from "react";
import { AppContext } from "src/context";
import { useFetch } from "src/utils/axios";
import io from "socket.io-client";
import axios from "axios";
import "./message.scss";
let socket;

const Message = ({ location, username, id }) => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { state } = useContext(AppContext);
  const [group, gLoading, gError] = useFetch(`groups/${id}`, id);
  const divRef = useRef(null);
  const [typing, setTyping] = useState(null);

  useEffect(() => {
    if (state.config.SOCKET_URL) {
      socket = io.connect(state.config.SOCKET_URL);
      socket.on("connect", () => console.log("Connected"));
      socket.on("disconnect", () => console.log("Disconnected"));

      return () => socket.disconnect();
    }
  }, [state.config.SOCKET_URL]);

  useEffect(() => {
    if (group) {
      const room = group.name;
      socket.emit("join", { room, username: state.user.username }, (msg) =>
        console.log(msg)
      );
    }
  }, [id, group]);

  useEffect(() => {
    socket.on("messages", (msg) => {
      setMessages([...messages, msg]);
    });
  }, [messages]);

  const formatMessage = (msg = message) => {
    return {
      username: state.user.username,
      message: msg,
      room: group.name,
    };
  };

  const sendMessage = () => {
    socket.emit("message", formatMessage());
    divRef.current.scrollIntoView({ behavior: "smooth" });
    setMessage("");
  };

  useEffect(() => {
    socket.on("typing", (data) => {
      setTyping(data);
    });
  }, [typing]);

  const handleKeyDown = () => {
    socket.emit("typing", {
      username: state.user.username,
      room: group.name,
      active: true,
    });
  };

  const handleBlur = () => {
    socket.emit("typing", {
      username: state.user.username,
      room: group.name,
      active: false,
    });
  };

  return (
    <div className={showSidebar ? "message sidebar-open" : "message"}>
      <div className="message-nav">
        <p>Chat Room - {group ? group.name : "Bhet-Ghat"}</p>
        <div className="settings">
          <div className="gear" onClick={() => setShowSidebar(!showSidebar)}>
            &#9881;
          </div>
        </div>
      </div>
      {id === "welcome" ? (
        <div style={{ color: "white", justifySelf: "center" }}>
          <h1>
            Connect Users to the some random/general room and show some
            instruction on how to use application{" "}
          </h1>{" "}
        </div>
      ) : (
        <div className="messages">
          <div className="message-container">
            {messages.length &&
              messages.map((message, index) => {
                return message.room === group.name ? (
                  <div
                    key={index}
                    className={
                      message.type === "admin"
                        ? "chat-item admin"
                        : message.username === state.user.username
                        ? "chat-item chat-self"
                        : "chat-item chat-other"
                    }
                  >
                    <div className="username">
                      {message.username != state.user.username &&
                        message.type != "admin" &&
                        message.username}
                    </div>
                    <div
                      className={
                        message.type === "admin"
                          ? "chat-message center"
                          : message.username === state.user.username
                          ? "chat-message right"
                          : "chat-message left"
                      }
                    >
                      {message.type === "admin"
                        ? message.message
                        : message.message}
                    </div>
                    <div className="time">{message.time}</div>
                  </div>
                ) : null;
              })}
            <div ref={divRef} id="recentMessage"></div>
          </div>
          <div className="message-footer">
            <div className="icons">
              {typing && typing.room === group.name && typing.message}
            </div>
            <input
              type="text"
              value={message}
              name="message"
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              onKeyPress={(e) => (e.key === "Enter" ? sendMessage() : null)}
            />
            <button disabled={!message.length} onClick={sendMessage}>
              send
            </button>
          </div>
        </div>
      )}
      {showSidebar && (
        <div className="right-sidebar">
          <div className="profile">
            <img src="/assets/kathmandu.png" alt="" />
            {group ? group.name : "Bhet-Ghat"}
          </div>
          <div className="users">
            <div className="heading">Users</div>
            <div className="users-list">
              {gLoading ? (
                <div> Loading ... </div>
              ) : gError ? (
                <div className="error"> {gError} </div>
              ) : group.users.length ? (
                group.users.map((user) => {
                  return (
                    <div className="user" key={user._id}>
                      <div className="img">
                        <img src="/assets/kathmandu.png" alt="" />
                      </div>
                      <li>{user.username}</li>
                    </div>
                  );
                })
              ) : (
                <div className="no-user">
                  There is no one in this room yet. Let invite your friends :).
                </div>
              )}
            </div>
          </div>
          <div className="activity"></div>
        </div>
      )}
    </div>
  );
};
export default Message;
