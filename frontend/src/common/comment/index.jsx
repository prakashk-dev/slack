import React, { Fragment } from "react";

import { Comment as AntComment, Tooltip, Avatar } from "antd";
import moment from "moment";

import "./comment.scss";
import { LikeTwoTone } from "@ant-design/icons";

export default function Comment({ by, message, ...props }) {
  const Config =
    by === "receiver"
      ? {
          author: <a>{message.from.username}</a>,
          avatar: (
            <Avatar
              src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              alt="Han Solo"
            />
          ),
          className:
            message.message.type === "icon" ? "icon-receiver" : "receiver",
        }
      : by === "sender"
      ? {
          className: message.message.type === "icon" ? "icon-sender" : "sender",
        }
      : { className: "admin" };

  const Content = () => {
    return (
      <Fragment>
        {message.message.type === "image" && (
          <img src={message.message.url} alt="No image found" />
        )}
        {message.message.type === "icon" ? (
          <LikeTwoTone />
        ) : (
          <p>{message.message.text}</p>
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
