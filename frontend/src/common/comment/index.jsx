import React, { Fragment } from "react";

import { Comment as AntComment, Tooltip, Avatar } from "antd";
import moment from "moment";

import "./comment.scss";
import { LikeTwoTone } from "@ant-design/icons";

export default function Comment({ by, message, ...props }) {
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

  const Content = () => {
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
  };
  return (
    <AntComment
      {...Config}
      {...props}
      content={<Content />}
      datetime={
        <Tooltip
          title={moment(message.timeStamp).format("YYYY-MM-DD HH:mm:ss")}
        >
          <span>{moment(message.timeStamp).fromNow()}</span>
        </Tooltip>
      }
    />
  );
}
