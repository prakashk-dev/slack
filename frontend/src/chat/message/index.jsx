import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { AppContext } from "src/context";
import { useFetch } from "src/utils/axios";
import io from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faArrowAltCircleRight,
  faFileImage,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { useDropzone } from "react-dropzone";
import Dropzone from "react-dropzone";
import "./message.scss";
import Axios from "axios";

let socket;
const Message = ({ location, username, id }) => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { state } = useContext(AppContext);
  const [group, gLoading, gError] = useFetch(`groups/${id}`, id);
  const divRef = useRef(null);
  const [typing, setTyping] = useState(null);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const onDrop = useCallback(
    (files) => {
      const formData = new FormData();
      formData.append("room", group.name);
      formData.append("file", files[0]);
      Axios.post("/api/upload", formData)
        .then((res) => {
          sendMessage({
            file: {
              image: res.data.image,
            },
            username: state.user.username,
            room: group.name,
          });
        })
        .catch((err) => console.error(err));
    },
    [group]
  );

  useEffect(() => {
    if (state.config.SOCKET_URL) {
      socket = io.connect(state.config.SOCKET_URL);
      socket.on("connect", () => console.log("Connected"));
      socket.on("disconnect", (reason) =>
        console.log("Disconnected: ", reason)
      );
      socket.on("error", (error) => console.log("Errors:", error));
      socket.on("reconnect_attempt", () => {
        console.log("Reconnecting");
      });

      socket.on("messages", (msg) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
        messages.length &&
          divRef.current.scrollIntoView({ behavior: "smooth" });
      });
      socket.on("typing", (data) => {
        setTyping(data);
      });
      return () => socket.disconnect();
    }
  }, []);

  useEffect(() => {
    if (group) {
      const room = group.name;
      socket.emit(
        "join",
        { room, username: state.user.username, type: "admin" },
        (msg) => {}
      );
      divRef.current && divRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [group]);

  const formatMessage = (msg = message) => {
    return {
      username: state.user.username,
      message: msg,
      room: group.name,
    };
  };

  useEffect(() => {
    divRef.current && divRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (msg = undefined) => {
    const message = msg || formatMessage();
    socket.emit("message", message);
    setMessages((prevMessages) => [...prevMessages, message]);
    setMessage("");
  };

  // Refactor this
  useEffect(() => {
    if (message.length) {
      if (!typing) {
        socket.emit("typing", {
          username: state.user.username,
          room: group.name,
          active: true,
        });
        setTyping(true);
      }
    } else {
      if (typing) {
        socket.emit("typing", {
          username: state.user.username,
          room: group.name,
          active: false,
        });
        setTyping(false);
      }
    }
  }, [message]);

  const handleSendLike = () => {
    const msg = {
      ...formatMessage(),
      message: "faThumbsUp",
      type: "faIcon",
    };
    sendMessage(msg);
  };

  const convertToLocalTime = (time) => {
    return moment(moment.utc(time).toDate()).local().format("h:m a");
  };
  return (
    <div className={showSidebar ? "message sidebar-open" : "message"}>
      <div className="message-nav">
        <p>Chat Room - {group ? group.name : "Bhet-Ghat"}</p>
        <div className="settings">
          <div className="gear" onClick={() => setShowSidebar(!showSidebar)}>
            <div className={showSidebar ? "info" : "info-hidden"}>i</div>
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
            {messages.length
              ? messages.map((msg, index) => {
                  return msg.room === group.name ? (
                    <div
                      key={index}
                      className={
                        msg.type === "admin"
                          ? "chat-item admin"
                          : msg.username === state.user.username
                          ? "chat-item chat-self"
                          : "chat-item chat-other"
                      }
                    >
                      <div className="username">
                        {msg.username != state.user.username &&
                          msg.type != "admin" &&
                          msg.username}
                      </div>
                      <div
                        className={
                          msg.type === "admin"
                            ? "chat-message center"
                            : msg.username === state.user.username
                            ? msg.type === "faIcon"
                              ? "chat-message chat-right chat-emoji"
                              : "chat-message right"
                            : "chat-message left"
                        }
                      >
                        {msg.type == "faIcon" ? (
                          <FontAwesomeIcon icon={faThumbsUp} />
                        ) : msg.file && msg.file.image ? (
                          <img
                            className="chat-image"
                            src={msg.file.image}
                            alt="Image not found"
                          ></img>
                        ) : (
                          msg.message
                        )}
                      </div>
                      <div className="time">{convertToLocalTime(msg.time)}</div>
                    </div>
                  ) : null;
                })
              : null}
            <div ref={divRef} id="recentMessage"></div>
          </div>
          <div className="message-footer">
            <div className="icons">
              <Dropzone onDrop={onDrop}>
                {({ getRootProps, getInputProps }) => (
                  <section>
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <FontAwesomeIcon icon={faFileImage} />
                    </div>
                  </section>
                )}
              </Dropzone>
            </div>
            <input
              type="text"
              value={message}
              name="message"
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => (e.key === "Enter" ? sendMessage() : null)}
            />
            <button
              onClick={() =>
                message.length ? sendMessage() : handleSendLike()
              }
            >
              <FontAwesomeIcon
                icon={message.length ? faArrowAltCircleRight : faThumbsUp}
              />
            </button>
            <div className="typing">
              {" "}
              {typing && typing.room === group.name && typing.message}
            </div>
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
