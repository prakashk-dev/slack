import React, { Fragment, useState } from "react";
import { navigate } from "@reach/router";
import { Comment as AntComment, Tooltip, Avatar, Popover, Modal } from "antd";
import moment from "moment";

import "./comment.scss";
import { LikeTwoTone } from "@ant-design/icons";

// Do not re render message content, only re render time, see below
const Content = React.memo(({ message }) => {
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
      ) : (
        <p>{message.body.text}</p>
      )}
    </Fragment>
  );
});

const Comment = ({ by, message, ...props }) => {
  const getLocal = moment(message.created_at).local();
  const fromNow = getLocal.fromNow();
  const localTimeTooltip = getLocal.format("YYYY-MM-DD HH:mm:ss");
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
      content={<Content message={message} />}
      datetime={
        <Tooltip title={localTimeTooltip}>
          <span>{fromNow}</span>
        </Tooltip>
      }
    />
  );
};
export default Comment;
