import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  Fragment,
} from "react";
import ReactDOM from "react-dom";
import { AppContext } from "src/context";
import moment from "moment";

import "./thread.scss";
import { Layout, Input, Divider, Button } from "antd";
const { Sider } = Layout;

import { LikeTwoTone, SendOutlined, CloseOutlined } from "@ant-design/icons";
import { Upload, Comment } from "src/common";

const Thread = ({ receiver, onReceiver, thread }) => {
  const { state, toggleSidebar, receivedMessage } = useContext(AppContext);
  const { user, socket, style, messages } = state;
  const infobarRef = useRef(null);
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [typing, setTyping] = useState(null);
  const [message, setMessage] = useState("");
  const [replies, setReplies] = useState(thread.reply || []);
  const sender = user.data,
    name = receiver.name || receiver.username;

  useEffect(() => {
    // as thread updates only in messages property
    const updatedThread = messages.find((message) => message.id === thread.id);
    setReplies(updatedThread.reply);
  }, [messages]);

  const handleOutsideClick = (e) => {
    const infobarDOM = ReactDOM.findDOMNode(infobarRef.current);
    if (!infobarDOM.contains(e.target)) {
      toggleSidebar({ showThread: false });
    }
  };
  useEffect(() => {
    if (style.layout === "mobile" && style.showThread) {
      document.addEventListener("click", handleOutsideClick, false);
    }
    return () =>
      document.removeEventListener("click", handleOutsideClick, false);
  }, [style]);

  const handleFileUpload = (uploads) => {
    uploads.length ? setFile(uploads[0].originFileObj) : setFile(null);
    inputRef.current && inputRef.current.focus();
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
    // receivedMessage(formatMessageForMyself(msg));
    socket.emit("thread", {
      thread: thread.id,
      reply: formatMessage(msg),
    });
  };

  const handleSend = () => {
    const msg = {
      text: message,
    };
    sendMessage(msg);
  };

  const handleSendLike = () => {
    const msg = {
      text: "thumbs-up",
      type: "icon",
    };

    sendMessage(msg);
  };

  return (
    <Sider
      collapsible
      trigger={null}
      // collapsed={!style.showInfobar}
      className={
        style.layout === "mobile"
          ? style.showInfobar
            ? "right-sidebar-mobile-shown"
            : "right-sidebar-mobile"
          : "right-sidebar"
      }
      collapsedWidth={0}
      defaultCollapsed={false}
      theme="light"
      ref={infobarRef}
      width={300}
    >
      <div className="thread-container">
        <div className="thread-title">
          <div className="title">Thread</div>
          <Button
            onClick={() => toggleSidebar({ showThread: false })}
            style={{ border: "none" }}
          >
            <CloseOutlined />
          </Button>
        </div>
        <Divider />
        <Comment message={thread} by="other" reply />
        {replies.length > 0 && (
          <Fragment>
            <Divider orientation="left">{replies.length} reply</Divider>
            <div className="reply-cotainer">
              {replies.map((reply) => (
                <Comment message={reply} key={reply.id} by="other" reply />
              ))}
            </div>
          </Fragment>
        )}
      </div>

      <div className="message-footer">
        <Upload
          className="upload-icon"
          onChange={handleFileUpload}
          uploaded={!file}
        />

        <Input
          value={message}
          allowClear={true}
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
          placeholder="Type a reply ..."
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
              typing && typing.receiver === receiver.id ? typing.message : null,
          }}
        ></div>
      </div>
    </Sider>
  );
};

export default Thread;
