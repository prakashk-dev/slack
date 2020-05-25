import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "src/context";
import { navigate } from "@reach/router";

import "./infobar.scss";
import { Layout, Menu, Dropdown, Avatar } from "antd";
const { Sider } = Layout;
const { SubMenu } = Menu;
import { UserOutlined } from "@ant-design/icons";

const Infobar = ({ entity }) => {
  const { state } = useContext(AppContext);
  const { style } = state;
  const users = entity.users; // for room and group
  const user = entity; // for individual, entity itself a single user
  const title = entity.name || entity.username; // for room and group use name, for user, username

  const handleMenuItemClick = (username) => {
    navigate(`/chat/u/${username}`);
  };

  const RoomUsers = () => {
    return users.length ? (
      users.map((usr) => {
        return (
          <Menu.Item
            key={usr.id}
            onClick={() => handleMenuItemClick(usr.username)}
            icon={
              <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
            }
          >
            {usr.username}
          </Menu.Item>
        );
      })
    ) : (
      <li className="no-users">No Users</li>
    );
  };

  const IndividualUser = () => {
    return (
      <Menu.Item
        key={user.id}
        // this should take to the profile page of the user once profile is implemented
        onClick={() => handleMenuItemClick(user.username)}
        icon={
          <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
        }
      >
        {user.username}
      </Menu.Item>
    );
  };

  return (
    <Sider
      collapsible
      collapsed={!style.showInfobar}
      className={
        style.device === "mobile"
          ? style.showInfobar
            ? "right-sidebar-mobile-shown"
            : "right-sidebar-mobile"
          : "right-sidebar"
      }
      collapsedWidth={0}
      defaultCollapsed={false}
    >
      <div className="profile">
        <Avatar src="/assets/kathmandu.png" alt="Group Icon" size={60} />
        {title}
      </div>
      <Menu mode="inline" defaultOpenKeys={["users"]}>
        <SubMenu key="users" icon={<UserOutlined />} title="Users">
          {users ? <RoomUsers /> : <IndividualUser />}
        </SubMenu>
      </Menu>
    </Sider>
  );
};

export default Infobar;
