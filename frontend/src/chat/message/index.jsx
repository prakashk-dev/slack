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
const Message = ({ groupId }) => {
  // { from: {}, to: {}, message: { type: [text|imgage|video|file], text: '', url: null}, timeStamp}
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const {
    state: { user, rooms, room, config, style },
    toggleSidebar,
    fetchGroup,
  } = useContext(AppContext);
  const divRef = useRef(null);
  const [typing, setTyping] = useState(null);
  const [file, setFile] = useState(null);

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
    if (
      groupId &&
      Object.keys(room.data).length &&
      Object.keys(user.data).length
    ) {
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
  }, [groupId, room.data, user.data]);

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
    groupId && fetchGroup(groupId);
  }, [groupId]);

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

  const messageBy = (msg) => {
    return msg.from.name === room.data.name && msg.to.name === room.data.name
      ? "admin"
      : msg.from.username === user.data.username
      ? "sender"
      : "receiver";
  };
  return (
    <Layout className="chat-body">
      <Header className="chat-header" style={{ padding: 0 }}>
        <ToggleIcon
          onClick={() => toggleSidebar({ showSidebar: !style.showSidebar })}
        />
        <div className="chat-title">Kathmandu</div>
        <InfoCircleOutlined
          onClick={() => toggleSidebar({ showInfobar: !style.showInfobar })}
        />
      </Header>
      <Content className="chat-content">
        {groupId === "welcome" ? (
          <div style={{ color: "white", justifySelf: "center" }}>
            <h1>
              Connect Users to the some random/general room and show some
              instruction on how to use application{" "}
            </h1>
          </div>
        ) : (
          <div className="message-container">
            {messages.length
              ? messages.map((msg, index) => {
                  return msg.to.name === room.data.name ? (
                    <Comment by={messageBy(msg)} message={msg} key={index} />
                  ) : null;
                })
              : null}
            <div ref={divRef} id="recentMessage"></div>
          </div>
        )}
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
            {typing && typing.room === room.data.name && typing.message}
          </div>
        </div>
      </Content>
      <Infobar />
    </Layout>
  );
};
export default Message;
