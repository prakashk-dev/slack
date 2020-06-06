import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "src/context";
import { navigate } from "@reach/router";

import "./infobar.scss";
import { Layout, Menu, Popover, Avatar, Button } from "antd";
const { Sider } = Layout;
const { SubMenu } = Menu;
import { UserOutlined, MoreOutlined } from "@ant-design/icons";

const Infobar = ({ entity }) => {
  const { state, toggleSidebar } = useContext(AppContext);
  const { style } = state;
  const [moreVisible, setMoreVisible] = useState({});
  const users = entity.users; // for room and group
  const user = entity; // for individual, entity itself a single user
  const title = entity.name || entity.username; // for room and group use name, for user, username
  const handleMenuItemClick = (username) => {
    style.device === "mobile" &&
      toggleSidebar({ showInfobar: !style.showInfobar });
    navigate(`/chat/u/${username}`);
  };

  const more = (username) => (
    <div className="more_options">
      <p onClick={() => handleMenuItemClick(username)}>Direct Message</p>
      <p>View Profile</p>
    </div>
  );

  return (
    <Sider
      collapsible
      trigger={null}
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
      theme="light"
    >
      <div className="profile">
        <Avatar src="/assets/kathmandu.png" alt="Group Icon" size={60} />
        {title}
      </div>
      <Menu mode="inline" defaultOpenKeys={["users"]} defaultActiveFirst>
        <SubMenu key="users" icon={<UserOutlined />} title="Users">
          {users ? (
            users.length ? (
              users.map((usr) => {
                return (
                  <div
                    className="menu-item"
                    key={usr.id}
                    onMouseEnter={() =>
                      setMoreVisible({
                        [usr.id]: true,
                      })
                    }
                    onMouseLeave={() =>
                      setMoreVisible({
                        [usr.id]: false,
                      })
                    }
                  >
                    <Menu.Item
                      onClick={() => handleMenuItemClick(usr.username)}
                      onItemHover={() => console.log()}
                      icon={
                        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                      }
                    >
                      {usr.username}
                    </Menu.Item>
                    {moreVisible[usr.id] && (
                      <Popover
                        trigger="click"
                        content={() => more(usr.username)}
                        placement="bottomRight"
                      >
                        <Button icon={<MoreOutlined />} />
                      </Popover>
                    )}
                  </div>
                );
              })
            ) : (
              <li className="no-users">No Users</li>
            )
          ) : (
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
          )}
        </SubMenu>
      </Menu>
    </Sider>
  );
};

export default Infobar;
