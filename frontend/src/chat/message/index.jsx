import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "src/context";
import { useFetch } from "src/utils/axios";
import io from "socket.io-client";
import axios from "axios";
import "./message.scss";
let socket;

const Message = ({ location, username, id }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { state } = useContext(AppContext);
  const [group, gLoading, gError] = useFetch(`groups/${id}`, id);

  // if (id) {
  //   group = useFetch(`groups/${id}`);
  // } else {
  //   user = useFetch(`groups/${username}`);
  // }

  // useEffect(() => {
  //   // socket = io.connect("http://localhost:3001");
  //   // socket.on("message", (message) => {
  //   //   setMessages((messages) => [...messages, message]);
  //   // });
  //   // socket.on("messages", (msgs) => {
  //   //   console.log("Fetch all the messages", msgs);
  //   //   setMessages((messages) => [...messages, ...msgs]);
  //   // });
  //   // socket.on("roomUsers", (data) => {
  //   //   console.log("All the users in this room", data);
  //   // });
  // }, []);

  // useEffect(() => {
  //   // check if user has already joined this room
  //   // if (!group.loading) {
  //   //   socket.emit("userStatus", { ...state.user, room: group.data.name });
  //   //   socket.on("joined", (data) => {
  //   //     data.length && setMessages((messages) => [...messages, ...data]);
  //   //     setJoined(data.length > 0);
  //   //   });
  //   // }
  // }, [group.loading]);

  const sendMessage = () => {};

  const handleJoin = () => {};

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
          {messages.length &&
            messages.map((message, index) => {
              return (
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
              );
            })}
          <div className="message-footer">
            <div className="icons"></div>
            <input
              type="text"
              value={message}
              name="message"
              onChange={(e) => setMessage(e.target.value)}
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
