import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  Fragment,
} from "react";
import { AppContext } from "src/context";
import io from "socket.io-client";
import Infobar from "src/chat/infobar";

import "./message.scss";
import Axios from "axios";

import { Layout, Input } from "antd";
const { Header, Content } = Layout;
import {
  LikeTwoTone,
  SendOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Upload, Comment } from "src/common";

let socket;
const Message = ({ entity, roomId, field }) => {
  // see backend/src/models/message.model.js
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { state, toggleSidebar, updateUsers } = useContext(AppContext);
  const divRef = useRef(null);
  const [typing, setTyping] = useState(null);
  const [file, setFile] = useState(null);
  const { user, config, style } = state;

  useEffect(() => {
    if (config.data.socket) {
      socket = io.connect(config.data.socket);
      logger(socket);
      handleEvents(socket);
      return () => socket.disconnect();
    }
  }, [config.data.socket]);

  const handleEvents = (socket) => {
    socket.on("messages", updateMessages);
    socket.on("typing", handleTypingEvent);
    // socket.on("welcome", console.log);
    // socket.on("updateUsers", updateUsers);
    // socket.on("updateUser", console.log);
    // socket.on("newUserJoined", console.log);
  };

  const handleJoin = (roomId) => {
    socket.emit("join", {
      room: roomId,
      username: state.user.data.username,
    });
  };
  useEffect(() => {
    if (socket && roomId && Object.keys(state[entity].data).length) {
      setMessages([...state[entity].data.messages]);
      handleJoin(roomId);
    }
  }, [roomId, state[entity], socket]);

  useEffect(() => {
    scrollToButton();
  }, [messages, file]);

  // Refactor this
  useEffect(() => {
    if (socket) {
      if (message.length) {
        if (!typing) {
          socket.emit("typing", {
            sender: user.data.username,
            receiver: state[entity].data[field],
            active: true,
          });
          setTyping(true);
        }
      } else {
        if (typing) {
          socket.emit("typing", {
            sender: user.data.username,
            receiver: state[entity].data[field],
            active: false,
          });
          setTyping(false);
        }
      }
    }
  }, [message, socket]);

  // const filterArrayMessages = (prevMessages, msg) => {
  //   return [...prevMessages, msg].filter(
  //     (msg) => msg.length > 0 || msg.length === undefined
  //   );
  // };
  const updateMessages = (msg) => {
    setMessages((prevMessages) => [...prevMessages, msg]);
    scrollToButton();
  };

  const handleTypingEvent = (msg) => {
    setTyping(msg);
  };

  const scrollToButton = () => {
    divRef.current && divRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const logger = (socket) => {
    socket.on("connect", () => console.log("Connected"));
    socket.on("disconnect", (reason) => console.log("Disconnected: ", reason));
    socket.on("error", (error) => console.log("Errors:", error));
    socket.on("reconnect_attempt", () => {
      console.log("Reconnecting");
    });
  };
  const ToggleIcon = (props) => {
    return style.showSidebar ? (
      <MenuFoldOutlined {...props} />
    ) : (
      <MenuUnfoldOutlined {...props} />
    );
  };

  const handleFileUpload = (uploads) => {
    setFile(uploads[0].originFileObj);
  };
  const handleSendLike = () => {
    const msg = {
      text: "thumbs-up",
      type: "icon",
    };

    sendMessage(msg);
  };

  const formatMessage = ({ text = message, type = "text", url = "" }) => {
    return {
      sender: user.data.id,
      receiver: state[entity].data.id,
      onReceiver: entity,
      body: {
        text,
        type,
        url,
      },
    };
  };

  const formatMessageForMyself = ({
    text = message,
    type = "text",
    url = "",
  }) => {
    return {
      sender: state.user.data,
      receiver: state[entity].data,
      onReceiver: entity,
      body: {
        text,
        type,
        url,
      },
    };
  };

  const sendMessageWithFile = () => {
    const formData = new FormData();
    formData.append(entity, state[entity].data[field]);
    formData.append("file", file);
    Axios.post("/api/upload", formData)
      .then((res) => {
        setFile(null);
        setMessage("");
        sendMessage({
          text: message,
          type: "image",
          url: res.data.url,
        });
      })
      .catch((err) => console.error(err));
  };

  const sendMessage = (msg) => {
    //  send message with post action
    setMessages((prevMessages) => [
      ...prevMessages,
      formatMessageForMyself(msg),
    ]);
    setMessage("");
    socket.emit("message", formatMessage(msg));
  };

  const handleSend = () => {
    const msg = {
      text: message,
    };
    sendMessage(msg);
  };

  const messageBy = (msg) => {
    return msg.sender.id === state.user.data.id
      ? "me"
      : msg.sender.id === state[entity].data.id
      ? "admin"
      : "other";
  };

  return (
    <Layout className="chat-body">
      <Header className="chat-header">
        <ToggleIcon
          onClick={() => toggleSidebar({ showSidebar: !style.showSidebar })}
        />
        <div className="chat-title">{state[entity].data[field]}</div>
        {style.device === "mobile" && style.showSidebar ? null : (
          <InfoCircleOutlined
            onClick={() => toggleSidebar({ showInfobar: !style.showInfobar })}
          />
        )}
      </Header>
      <Content className="chat-content">
        {roomId === "welcome" ? (
          <div style={{ color: "white", justifySelf: "center" }}>
            <h1>
              <pre>{JSON.stringify(state.style, null, 4)}</pre>
            </h1>
          </div>
        ) : (
          <Fragment>
            <div className="message-container">
              {messages.length
                ? messages.map((msg, index) => {
                    // modify msg.to.room
                    return msg.receiver.id === roomId ? (
                      <Comment by={messageBy(msg)} message={msg} key={index} />
                    ) : null;
                  })
                : null}
              <div ref={divRef} id="recentMessage"></div>
            </div>
            <div className="message-footer">
              <Upload
                className="upload-icon"
                onChange={handleFileUpload}
                uploaded={!file}
              />

              <Input
                value={message}
                type="text"
                name="message"
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter"
                    ? file
                      ? sendMessageWithFile()
                      : handleSend()
                    : null
                }
                placeholder="Type a message ..."
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
                {message.length || file ? <SendOutlined /> : <LikeTwoTone />}
              </button>
              <div className="typing">
                {typing &&
                  typing[entity] === state[entity].data[field] &&
                  typing.message}
              </div>
            </div>
          </Fragment>
        )}
      </Content>
      <Infobar entity={entity} field={field} />
    </Layout>
  );
};
export default Message;
