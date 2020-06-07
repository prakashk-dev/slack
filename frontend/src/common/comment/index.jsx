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
} from "@ant-design/icons";
import moment from "moment";

import "./comment.scss";
import { LikeTwoTone } from "@ant-design/icons";

const Reaction = ({ children, by, handleClick }) => {
  const more = () => {
    return (
      <div className="reaction-icons">
        <li>Pin to the Channel</li>
        <Divider />
        <li className="danger">Delete</li>
      </div>
    );
  };
  const icons = () => {
    return (
      <div className="message-reaction-container">
        <Tooltip title="Add Reaction">
          <Button>
            <SmileOutlined />
          </Button>
        </Tooltip>
        <Tooltip title="Start Thread">
          <Button onClick={() => handleClick("thread")}>
            <MessageOutlined />
          </Button>
        </Tooltip>
        <Tooltip title="Save">
          <Button>
            <SaveOutlined />
          </Button>
        </Tooltip>
        <Popover trigger={["click", "hover"]} content={more} placement="right">
          <Button>
            <MoreOutlined />
          </Button>
        </Popover>
      </div>
    );
  };
  return (
    <Popover
      trigger="hover"
      content={icons}
      placement={by === "other" ? "topRight" : "topLeft"}
    >
      {children}
    </Popover>
  );
};
// Do not re render message content, only re render time, see below
const Content = React.memo(({ message, by, handleClick, ...props }) => {
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
            <img src={message.body.url} alt="No image found" />
          </Modal>
        </Fragment>
      )}
      {message.body.type === "icon" ? (
        <LikeTwoTone />
      ) : props.reply ? (
        <p>{message.body.text}</p>
      ) : (
        <Reaction by={by} handleClick={handleClick}>
          <p>{message.body.text}</p>
        </Reaction>
      )}
    </Fragment>
  );
});

const Comment = ({ by, message, handleClick, ...props }) => {
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
  const Config =
    by === "other"
      ? {
          author: <a>{message.sender.username}</a>,
          avatar: (
            <Popover trigger="click" content={more} placement="bottomLeft">
              <Avatar
                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                alt="Han Solo"
              />
            </Popover>
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
    <AntComment
      {...Config}
      {...props}
      content={
        <Content
          message={message}
          by={by}
          handleClick={handleCommentClick}
          {...props}
        />
      }
      datetime={
        <Tooltip title={localTimeTooltip}>
          <span>{fromNow}</span>
        </Tooltip>
      }
    />
  );
};
export default Comment;
