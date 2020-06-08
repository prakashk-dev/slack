import React, { Fragment, useState } from "react";
import { navigate } from "@reach/router";
import {
  Comment as AntComment,
  Tooltip,
  Avatar,
  Popover,
  Modal,
  Button,
  Divider,
} from "antd";
import {
  MessageOutlined,
  MoreOutlined,
  SmileOutlined,
  SaveOutlined,
  DeleteOutlined,
  RightOutlined,
} from "@ant-design/icons";
import moment from "moment";

import "./comment.scss";
import { LikeTwoTone } from "@ant-design/icons";

const Reaction = ({ children, by, handleClick, message }) => {
  const isAdmin = false;
  // const activeIcons = [];
  const more = () => {
    return (
      <div className="reaction-icons">
        {isAdmin && (
          <Fragment>
            <li>Pin to the Channel</li>
            <Divider />
          </Fragment>
        )}
        <li className="danger">Delete</li>
      </div>
    );
  };
  const canDelete =
    (!message.reply || message.reply.length === 0) && by === "me";
  const icons = () => {
    return (
      <div className="message-reaction-container">
        {message.onReceiver !== "user" && (
          <Tooltip title="Start Thread">
            <Button onClick={() => handleClick("thread")}>
              <MessageOutlined />
            </Button>
          </Tooltip>
        )}

        {isAdmin ? (
          message.onReceiver !== "user" ? (
            <Fragment>
              <Tooltip title="Save">
                <Button>
                  <SaveOutlined />
                </Button>
              </Tooltip>
            </Fragment>
          ) : (
            <Fragment>
              <Tooltip title="Add Reaction">
                <Button>
                  <SmileOutlined />
                </Button>
              </Tooltip>
              <Button>
                <MoreOutlined />
              </Button>
            </Fragment>
          )
        ) : (
          canDelete && (
            <Tooltip title="Delete this message" trigger="hover">
              <Button onClick={() => handleClick("delete")}>
                <DeleteOutlined />
              </Button>
            </Tooltip>
          )
        )}
      </div>
    );
  };
  if (message.onReceiver === "user" && by !== "me") {
    return <Fragment>{children}</Fragment>;
  }
  return (
    <Popover
      trigger="hover"
      destroyTooltipOnHide
      content={icons}
      placement={by === "other" ? "right" : "left"}
    >
      {children}
    </Popover>
  );
};
// Do not re render message content, only re render time, see below
const Content = React.memo(({ message, by, handleClick, reply }) => {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <Fragment>
      {message.body.type === "image" && (
        <Fragment>
          <img
            src={message.body.url}
            alt="No image found"
            onClick={() => setIsVisible(true)}
          />
          <Modal
            title="Preview Image"
            visible={isVisible}
            footer={null}
            onCancel={() => setIsVisible(false)}
          >
            <Reaction by={by} handleClick={handleClick} message={message}>
              <img src={message.body.url} alt="No image found" />
            </Reaction>
          </Modal>
        </Fragment>
      )}
      {message.body.type === "icon" ? (
        <LikeTwoTone />
      ) : reply ? (
        <p>{message.body.text}</p>
      ) : (
        <Reaction by={by} handleClick={handleClick} message={message}>
          <p>{message.body.text}</p>
        </Reaction>
      )}
    </Fragment>
  );
});

const Comment = ({ by, message, handleClick, reply, user, ...props }) => {
  const getLocal = moment(message.created_at).local();
  const fromNow = getLocal.fromNow();
  const localTimeTooltip = getLocal.format("YYYY-MM-DD HH:mm:ss");
  const handleCommentClick = (type) => {
    handleClick({ type, message });
  };

  const more = () => (
    <div className="more_options">
      <p onClick={() => navigate(`/chat/u/${message.sender.username}`)}>
        Direct Message
      </p>
      <p>View Profile</p>
    </div>
  );
  console.log("user", user);
  console.log("message.sender", message.sender);
  const Config =
    by === "other"
      ? {
          author: <a>{message.sender.username}</a>,
          avatar: !(user && user.username === message.sender.username) ? (
            <Popover trigger="click" content={more} placement="bottomLeft">
              <Avatar
                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                alt="Han Solo"
              />
            </Popover>
          ) : (
            <Avatar
              src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              alt="Han Solo"
            />
          ),
          className:
            message.body.type === "icon" ? "icon-receiver" : "receiver",
        }
      : by === "me"
      ? {
          className: message.body.type === "icon" ? "icon-sender" : "sender",
        }
      : { className: "admin" };

  return (
    <Fragment>
      <AntComment
        {...Config}
        {...props}
        content={
          <Content
            message={message}
            by={by}
            handleClick={handleCommentClick}
            reply={reply}
          />
        }
        datetime={
          <Tooltip title={localTimeTooltip}>
            <span>{fromNow}</span>
          </Tooltip>
        }
      />
      {message.reply && message.reply.length > 0 && !reply && (
        <div className={`${Config.className} thread`}>
          <Tooltip title="view reply">
            <Button onClick={() => handleCommentClick("thread")}>
              {message.reply.length} repiles
            </Button>
          </Tooltip>
        </div>
      )}
    </Fragment>
  );
};
export default Comment;
