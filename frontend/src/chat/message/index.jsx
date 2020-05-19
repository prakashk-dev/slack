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
  // { from: {}, to: {}, message: { type: [text|imgage|video|file], text: '', url: null}, timeStamp}
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { state, toggleSidebar, updateUsers } = useContext(AppContext);
  const divRef = useRef(null);
  const [typing, setTyping] = useState(null);
  const [file, setFile] = useState(null);
  const { user, config, style } = state;

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
      socket.on("updateUsers", (msg) => {
        updateUsers(msg);
      });
      socket.on("typing", (data) => {
        setTyping(data);
      });
      return () => socket.disconnect();
    }
  }, [config.data.SOCKET_URL]);

  useEffect(() => {
    if (roomId && Object.keys(state[entity].data).length) {
      setMessages(state[entity].data.messages || []);
      divRef.current && divRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [roomId, state[entity]]);

  useEffect(() => {
    divRef.current && divRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, file]);
  // Refactor this
  useEffect(() => {
    if (message.length) {
      if (!typing) {
        socket.emit("typing", {
          username: user.data.username,
          [entity]: state[entity].data[field],
          active: true,
        });
        setTyping(true);
      }
    } else {
      if (typing) {
        socket.emit("typing", {
          username: user.data.username,
          [entity]: state[entity].data[field],
          active: false,
        });
        setTyping(false);
      }
    }
  }, [message]);

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

    sendMessage(formatMessage(msg));
  };
  const formatMessage = ({ text = message, type = "text", url = "" }) => {
    return {
      from: { _id: user.data._id, username: user.data.username },
      to: {
        _id: state[entity].data._id,
        [entity]: state[entity].data[field],
      },
      message: {
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

  const messageBy = (msg) => {
    return msg.from[field] === state[entity].data[field] &&
      msg.to[field] === state[entity].data[field]
      ? "admin"
      : msg.from.username === user.data.username
      ? "sender"
      : "receiver";
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
                    return (
                      <Comment by={messageBy(msg)} message={msg} key={index} />
                    );
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
