import React, { Fragment, useMemo } from "react";

import { Comment as AntComment, Tooltip, Avatar } from "antd";
import moment from "moment";

import "./comment.scss";
import { LikeTwoTone } from "@ant-design/icons";

// Do not re render message content, only re render time, see below
const Content = React.memo(({ message }) => {
  return (
    <Fragment>
      {message.body.type === "image" && (
        <img src={message.body.url} alt="No image found" />
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
  const Config =
    by === "other"
      ? {
          author: <a>{message.sender.username}</a>,
          avatar: (
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
