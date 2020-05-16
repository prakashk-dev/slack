import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { AppContext } from "src/context";
import io from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faArrowAltCircleRight,
  faFileImage,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { useDropzone } from "react-dropzone";
import Dropzone from "react-dropzone";
import "./message.scss";
import Axios from "axios";

import { Layout, Menu } from "antd";
const { Header, Sider, Content } = Layout;
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from "@ant-design/icons";

let socket;
const Message = ({ location, username, id }) => {
  const [message, setMessage] = useState("");
  // { from: {}, to: {}, message: { type: [text|imgage|video|file], text: '', url: null}, timeStamp}
  const [messages, setMessages] = useState([]);
  const {
    state: { user, rooms, room, config, style },
    toggleSidebar,
    fetchGroup,
  } = useContext(AppContext);
  const divRef = useRef(null);
  const [typing, setTyping] = useState(null);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const [file, setFile] = useState(null);

  const onDrop = useCallback(
    (files) => {
      setFile(files[0]);
    },
    [room]
  );

  useEffect(() => {
    if (file) {
      document.getElementById("previewImage").src = window.URL.createObjectURL(
        file
      );
    }
  }, [file]);

  useEffect(() => {
    if (config.data.SOCKET_URL) {
      socket = io.connect(config.data.SOCKET_URL);
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
  }, [config.data.SOCKET_URL]);

  useEffect(() => {
    if (id && Object.keys(room.data).length && Object.keys(user.data).length) {
      setMessages(room.data.messages || []);
      socket.emit(
        "join",
        {
          room: room.data.name,
          username: user.data.username,
        },
        (msg) => {}
      );
      divRef.current && divRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [id, room.data, user.data]);

  useEffect(() => {
    divRef.current && divRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, file]);
  // Refactor this
  useEffect(() => {
    if (message.length) {
      if (!typing) {
        socket.emit("typing", {
          username: user.data.username,
          room: room.data.name,
          active: true,
        });
        setTyping(true);
      }
    } else {
      if (typing) {
        socket.emit("typing", {
          username: user.data.username,
          room: room.data.name,
          active: false,
        });
        setTyping(false);
      }
    }
  }, [message]);

  useEffect(() => {
    id && fetchGroup(id);
  }, [id]);
  const handleSendLike = () => {
    const msg = {
      text: "thumbs-up",
      type: "icon",
    };

    sendMessage(formatMessage(msg));
  };
  const formatMessage = ({ text = message, type = "text", url = "" }) => {
    return {
      from: { _id: user.data._id, username: user.data.username },
      to: { _id: room.data._id, name: room.data.name },
      message: {
        text,
        type,
        url,
      },
    };
  };

  const sendMessageWithFile = () => {
    const formData = new FormData();
    formData.append("room", room.data.name);
    formData.append("file", file);
    Axios.post("/api/upload", formData)
      .then((res) => {
        setFile(null);
        setMessage("");
        sendMessage(
          formatMessage({
            text: message,
            type: "image",
            url: res.data.url,
          })
        );
      })
      .catch((err) => console.error(err));
  };

  const sendMessage = (msg) => {
    socket.emit("message", msg);
    setMessages((prevMessages) => [...prevMessages, msg]);
    setMessage("");
  };

  const handleSend = () => {
    const msg = {
      text: message,
    };
    sendMessage(formatMessage(msg));
  };

  const removeImage = () => {
    setFile(null);
  };

  const convertToLocalTime = (time) => {
    return moment(moment.utc(time).toDate()).local().format("h:mm a");
  };

  return (
    <div
      className={
        style.device === "mobile"
          ? style.showInfobar
            ? "mobile-message-with-infobar-open"
            : "mobile-message"
          : style.showInfobar
          ? "message"
          : "desktop-message"
      }
    >
      <Header>
        <div className="message-nav">
          {style.device === "mobile" &&
            React.createElement(
              style.showSidebar ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: () =>
                  toggleSidebar({ showSidebar: !style.showSidebar }),
              }
            )}
          <p>
            Chat Room -
            {room.loading
              ? "..."
              : room.error
              ? "Error Fetching Room"
              : room.data.name || "Bhet-Ghat"}
          </p>
          <div
            className="gear"
            onClick={() =>
              toggleSidebar({
                showInfobar: !style.showInfobar,
              })
            }
          >
            <i
              className={`${
                style.device === "mobile"
                  ? "las la-ellipsis-v"
                  : style.showSidebar
                  ? "las la-info-circle"
                  : "las la-info-circle active"
              }`}
            ></i>
          </div>
        </div>
      </Header>
      <Content>
        {id === "welcome" ? (
          <div style={{ color: "white", justifySelf: "center" }}>
            <h1>
              Connect Users to the some random/general room and show some
              instruction on how to use application{" "}
            </h1>
          </div>
        ) : (
          <div className={file ? "messages-file-preview" : "messages"}>
            <div className="message-container">
              {messages.length
                ? messages.map((msg, index) => {
                    return msg.to.name === room.data.name ? (
                      <div
                        key={index}
                        className={
                          msg.from.name === room.data.name &&
                          msg.to.name === room.data.name
                            ? "chat-item admin"
                            : msg.from.username === user.data.username
                            ? "chat-item chat-self"
                            : "chat-item chat-other"
                        }
                      >
                        <div className="username">
                          {msg.from.username != user.data.username &&
                            msg.message.type != "admin" &&
                            msg.from.username}
                        </div>
                        <div
                          className={
                            msg.from.name === room.data.name &&
                            msg.to.name === room.data.name
                              ? "chat-message center"
                              : msg.from.username === user.data.username
                              ? msg.message.type === "faIcon"
                                ? "chat-message chat-right chat-emoji"
                                : "chat-message right"
                              : "chat-message left"
                          }
                        >
                          {msg.message.type === "image" && (
                            <img
                              className="chat-image"
                              src={msg.message.url}
                              alt="Image not found"
                            ></img>
                          )}
                          {msg.message.type == "icon" ? (
                            <FontAwesomeIcon icon={faThumbsUp} />
                          ) : (
                            msg.message.text
                          )}
                        </div>
                        <div className="time">
                          {convertToLocalTime(msg.timeStamp)}
                        </div>
                      </div>
                    ) : null;
                  })
                : null}
              <div ref={divRef} id="recentMessage"></div>
            </div>
            {file && (
              <div className="file_preview">
                <img
                  src="#"
                  alt="Invalid Image"
                  id="previewImage"
                  title="Remove Attachment"
                />
                <div className="removeImage" onClick={removeImage}>
                  X
                </div>
              </div>
            )}
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
                onKeyPress={(e) =>
                  e.key === "Enter"
                    ? file
                      ? sendMessageWithFile()
                      : handleSend()
                    : null
                }
              />
              <button
                onClick={() =>
                  file
                    ? sendMessageWithFile()
                    : message.length
                    ? handleSend()
                    : handleSendLike()
                }
              >
                <FontAwesomeIcon
                  icon={
                    message.length || file ? faArrowAltCircleRight : faThumbsUp
                  }
                />
              </button>
              <div className="typing">
                {typing && typing.room === room.data.name && typing.message}
              </div>
            </div>
          </div>
        )}
        {style.showInfobar && (
          <div className="right-sidebar">
            <div className="profile">
              <img src="/assets/kathmandu.png" alt="" />
              {room.loading
                ? "..."
                : room.error
                ? "Error Fetching Room"
                : room.data.name || "Bhet-Ghat"}
            </div>
            <div className="users">
              <div className="heading">
                <i className="las la-angle-right"></i>
                Users
              </div>
              <div className="users-list">
                {room.loading ? (
                  <div className="loading">... </div>
                ) : room.error ? (
                  <div className="error"> {room.error} </div>
                ) : room.data.users && room.data.users.length ? (
                  room.data.users.map((user) => {
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
                  <div className="no-user">No Users</div>
                )}
              </div>
            </div>
            <div className="activity"></div>
          </div>
        )}
      </Content>
    </div>
  );
};
export default Message;
