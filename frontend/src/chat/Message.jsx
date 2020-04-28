import React, { useState, useContext, useEffect } from "react";
import { navigate } from "@reach/router";
import { AppContext } from "src/context";
import axios from "axios";
import io from "socket.io-client";
import "./message.scss";
let socket;

const Message = ({ location }) => {
  const [activeTab, setActiveTab] = useState("users");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [state] = useContext(AppContext);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    socket = io.connect("http://localhost:3001");
    socket.emit("join", state.user);

    socket.on("message", (data) => {
      console.log("Something coming from server", data);
      setMessages([...messages, data]);
    });
  }, []);

  const sendMessage = () => {
    socket.emit("sendMessage", message);
  };

  return (
    <div className="message">
      <div className="message-navigation">
        <div className="back-button">
          <button onClick={(e) => navigate("/chat")}> Back</button>
        </div>
        <div className="chat-title">Kathmandu - Chat Room</div>
      </div>
      <div className="message-body">
        <div className="message-area">
          <div className="message">
            <p>Some Cool Heading</p>
            {!joined && (
              <div id="chat">
                <div>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only five centuries, but
                  also the leap into electronic typesetting, remaining
                  essentially unchanged. It was popularised in the 1960s with
                  the release of Letraset sheets containing Lorem Ipsum
                  passages, and more recently with desktop publishing software
                  like Aldus PageMaker including versions of Lorem Ipsum.
                </div>
                <div className="confirm">
                  Click Join button to join the room.
                </div>
                <div className="join-button" onClick={() => setJoined(true)}>
                  Join
                </div>
              </div>
            )}
            {joined && <div id="chat"></div>}
          </div>
          <div
            className="write-message"
            style={{ visibility: joined ? "visible" : "hidden" }}
          >
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
