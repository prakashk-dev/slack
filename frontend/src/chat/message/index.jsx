import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  Fragment,
} from "react";
import { AppContext } from "src/context";
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

const Message = ({ receiver, onReceiver }) => {
  // see backend/src/models/message.model.js
  const [message, setMessage] = useState("");
  // const [messages, setMessages] = useState([]);
  const {
    state,
    toggleSidebar,
    updateRoomUsers,
    receivedMessage,
    updateNotification,
    updateFriendList,
  } = useContext(AppContext);
  const divRef = useRef(null);
  const [typing, setTyping] = useState(null);
  const [file, setFile] = useState(null);
  const { user, socket, style, messages } = state;
  const [notification, setNotification] = useState(null);
  const sender = user.data,
    name = receiver.name || receiver.username;

  useEffect(() => {
    handleEvents();
  }, []);

  const handleEvents = () => {
    socket.on("messages", updateMessages);
    socket.on("typing", handleTypingEvent);
    socket.on("welcome", console.log);
    socket.on("updateRoomUsers", updateRoomUsers);
    socket.on("updateFriendList", updateFriendList);
    socket.on("newUserJoined", console.log);
  };

  const handleJoin = () => {
    const joinData = {
      room: receiver.id,
      id: sender.id,
      username: sender.username,
      onReceiver,
    };
    socket.emit("join", joinData);
  };

  useEffect(() => {
    if (notification) {
      const receiverId =
        notification.onReceiver === "user"
          ? notification.sender.id
          : notification.receiver.id;
      if (receiverId !== receiver.id) {
        // send to the backend to update the notification on the user
        updateNotification({
          receiver: receiverId,
          id: user.data.id,
        });
      }
      setNotification(null);
    }
  }, [receiver, notification]);
  useEffect(() => {
    if (receiver.messages && receiver.messages.length) {
      // here update that notifaction to be zero
      receivedMessage(receiver.messages);
      updateNotification({
        count: 0,
        receiver: receiver.id,
        id: user.data.id,
        onReceiver,
      });
    }
    receiver.name !== "Bhetghat" && handleJoin();
  }, [receiver]);

  useEffect(() => {
    scrollToButton();
  }, [messages, file]);

  // Refactor this
  useEffect(() => {
    if (message.length) {
      socket.emit("typing", {
        sender: sender.username,
        receiver: receiver.id,
        active: true,
      });
    } else {
      socket.emit("typing", {
        sender: sender.username,
        receiver: receiver.id,
        active: false,
      });
      setTyping(null);
    }
  }, [message]);

  const updateMessages = (msg) => {
    // console.log("Message coming from server", msg);
    receivedMessage(msg);
    // the other room is receiving message, at this point user has already joined that room to receive the message
    setNotification(msg);
    scrollToButton();
  };

  const handleTypingEvent = (msg) => {
    setTyping(msg);
  };

  const scrollToButton = () => {
    divRef.current && divRef.current.scrollIntoView({ behavior: "smooth" });
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
      sender: sender.id,
      receiver: receiver.id,
      onReceiver,
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
      sender: sender,
      receiver: receiver,
      onReceiver,
      body: {
        text,
        type,
        url,
      },
    };
  };

  const sendMessageWithFile = () => {
    const formData = new FormData();
    formData.append("folder", name);
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
    setMessage("");
    receivedMessage(formatMessageForMyself(msg));
    socket.emit("message", formatMessage(msg));
  };

  const handleSend = () => {
    const msg = {
      text: message,
    };
    sendMessage(msg);
  };

  const messageBy = (msg) => {
    return msg.sender.id === msg.receiver.id // if msg sender and receiver are same
      ? "admin"
      : // this happens when room sends an notification, at that case room send message to itself
      msg.sender.id === sender.id // if msg sender is current user
      ? "me"
      : "other";
  };

  const isCurrentRoom = (msg) => {
    return msg.receiver.id === receiver.id;
  };
  const isCurrentFriend = (msg) => {
    return msg.sender.id === receiver.id && msg.receiver.id === sender.id;
  };

  const isCurrent = (msg) => {
    return msg && (isCurrentRoom(msg) || isCurrentFriend(msg));
  };
  return (
    <Layout className="chat-body">
      <Header className="chat-header">
        <ToggleIcon
          onClick={() => toggleSidebar({ showSidebar: !style.showSidebar })}
        />
        <div className="chat-title">{name}</div>
        {style.device === "mobile" && style.showSidebar ? null : (
          <InfoCircleOutlined
            onClick={() => toggleSidebar({ showInfobar: !style.showInfobar })}
          />
        )}
      </Header>
      <Content className="chat-content">
        {receiver.id === "welcome" ? (
          <div style={{ color: "white", justifySelf: "center" }}>
            <h1>
              <pre>{JSON.stringify(state.style, null, 4)}</pre>
            </h1>
          </div>
        ) : (
          <Fragment>
            <div className="message-container">
              {messages.length ? (
                messages.map((msg, index) => {
                  return isCurrent(msg) ? (
                    <Comment by={messageBy(msg)} message={msg} key={index} />
                  ) : null;
                })
              ) : (
                <pre> {JSON.stringify(messages, null, 4)}</pre>
              )}
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
              <div
                className="typing"
                dangerouslySetInnerHTML={{
                  __html:
                    typing && typing.receiver === receiver.id
                      ? typing.message
                      : null,
                }}
              ></div>
            </div>
          </Fragment>
        )}
      </Content>
      <Infobar entity={receiver} />
    </Layout>
  );
};
export default Message;
