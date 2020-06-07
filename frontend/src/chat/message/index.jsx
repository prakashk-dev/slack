import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  Fragment,
} from "react";
import moment from "moment";
import { AppContext } from "src/context";
import Infobar from "src/chat/infobar";

import "./message.scss";
import Axios from "axios";

import { Layout, Input, Tooltip, Button, Divider } from "antd";
const { Header, Content } = Layout;
import {
  LikeTwoTone,
  SendOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  InfoCircleOutlined,
  UserOutlined,
  PushpinOutlined,
  StarOutlined,
  StarFilled,
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
    updateOnlineStatus,
    favouriteClick,
  } = useContext(AppContext);
  const divRef = useRef(null);
  const inputRef = useRef(null);
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
    socket.on("userOnline", updateOnlineStatus);
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
    inputRef.current && inputRef.current.focus();
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
    setTimeout(() => {
      divRef.current && divRef.current.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  const ToggleIcon = (props) => {
    return style.showSidebar ? (
      <MenuFoldOutlined {...props} />
    ) : (
      <MenuUnfoldOutlined {...props} />
    );
  };

  const handleFileUpload = (uploads) => {
    uploads.length ? setFile(uploads[0].originFileObj) : setFile(null);
    inputRef.current && inputRef.current.focus();
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
      created_at: moment.utc().format(),
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

  const handleFavouriteClick = () => {
    if (userCurrentRoom()) {
      favouriteClick({
        id: receiver.id,
        favourite: !userCurrentRoom().favourite,
      });
    }
  };

  const userCurrentRoom = () => {
    return (
      state.user.data.rooms &&
      state.user.data.rooms.find(({ room }) => room.id == receiver.id)
    );
  };
  const chatHeading = () => {
    return onReceiver === "user" ? (
      name
    ) : (
      <Fragment>
        {name}
        <Tooltip title="Add to your favourite room" placement="bottom">
          <Button
            icon={
              userCurrentRoom() && userCurrentRoom().favourite ? (
                <StarFilled />
              ) : (
                <StarOutlined />
              )
            }
            size="small"
            onClick={handleFavouriteClick}
          ></Button>
        </Tooltip>
        {receiver.users.length ? (
          <small className="chat-title-extra-info">
            <Tooltip title="view users list" placement="bottom">
              <Button onClick={() => toggleSidebar({ showInfobar: true })}>
                <UserOutlined /> {receiver.users.length}
              </Button>
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip title="view pinned items" placement="bottom">
              <Button>
                <PushpinOutlined /> 4
              </Button>
            </Tooltip>
          </small>
        ) : null}
      </Fragment>
    );
  };
  return (
    <Layout className={onReceiver !== "user" ? "chat-body" : "chat-body-rooms"}>
      <Header
        className={
          style.layout === "mobile" ? "chat-header-small" : "chat-header"
        }
        theme="light"
      >
        <ToggleIcon
          onClick={() => toggleSidebar({ showSidebar: !style.showSidebar })}
        />
        <div className="chat-title">{chatHeading()}</div>
        {style.layout === "mobile" && style.showSidebar ? null : (
          <div
            className="info-circle"
            onClick={() => toggleSidebar({ showInfobar: !style.showInfobar })}
          >
            <InfoCircleOutlined />
            {style.layout !== "mobile" ? <span>Details</span> : null}
          </div>
        )}
      </Header>
      <div
        className="container"
        style={{ display: "flex", height: "100%", width: "100%" }}
      >
        <Content className="chat-content">
          {receiver.name === "Bhetghat" ? null : (
            <Fragment>
              <div className="message-container">
                {messages.length
                  ? messages.map((msg, index) => {
                      return isCurrent(msg) ? (
                        <Comment
                          by={messageBy(msg)}
                          message={msg}
                          key={index}
                        />
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
                  ref={inputRef}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter"
                      ? file
                        ? sendMessageWithFile()
                        : message.length
                        ? handleSend()
                        : handleSendLike()
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
        {onReceiver !== "user" && <Infobar entity={receiver} />}
      </div>
    </Layout>
  );
};
export default Message;
