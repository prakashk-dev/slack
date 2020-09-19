import React, { useState, useEffect, useContext, useRef } from "react";
import ReactDOM from "react-dom";
import { AppContext } from "src/context";
import { navigate } from "@reach/router";

import "./infobar.scss";
import { Layout, Menu, Popover, Avatar, Button } from "antd";
const { Sider } = Layout;
const { SubMenu } = Menu;
import { UserOutlined, MoreOutlined } from "@ant-design/icons";

const isMe = (user, username) => {
  const loggedInUser = user && user.username;
  return loggedInUser === username;
};

const getModifiedUsers = (loggedInUser, users) => {
  const index = users.findIndex(user => user.username === loggedInUser.username);
  users.splice(index, 1);
  users.push(loggedInUser);
  return users;
}

const Infobar = ({ entity }) => {
  const { state, toggleSidebar } = useContext(AppContext);
  const { style } = state;
  const infobarRef = useRef(null);
  const [moreVisible, setMoreVisible] = useState({});
  const [openKeys, setOpenKeys] = useState(["users"]);
  const users = entity.users; // for room and groups
  const user = entity; // for individual, entity itself a single user
  const title = entity.name || entity.username; // for room and group use name, for user, username

  useEffect(() => {
    if (!style.showInfobar) {
      setOpenKeys(["users"]);
    }
  }, [style.showInfobar]);


  const handleMenuItemClick = (username) => {
    if (isMe(state.user.data, username)) return;
    style.layout === "mobile" &&
      toggleSidebar({ showInfobar: !style.showInfobar });
    navigate(`/chat/u/${username}`);
  };

  const more = (username) => (
    <div className="more_options">
      <p onClick={() => handleMenuItemClick(username)}>Direct Message</p>
      <p>View Profile</p>
    </div>
  );

  const toggleSelectKeys = () => {
    setOpenKeys(openKeys.length ? [] : ["users"]);
  };

  const handleOutsideClick = (e) => {
    const infobarDOM = ReactDOM.findDOMNode(infobarRef.current);
    if (!infobarDOM.contains(e.target)) {
      toggleSidebar({ showInfobar: false });
    }
  };

  useEffect(() => {
    if (style.layout === "mobile" && style.showInfobar) {
      document.addEventListener("click", handleOutsideClick, false);
    }
    return () =>
      document.removeEventListener("click", handleOutsideClick, false);
  }, [style]);

  return (
    <Sider
      collapsible
      trigger={null}
      collapsed={!style.showInfobar}
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
    >
      <div className="profile">
        <Avatar src="/assets/kathmandu.png" alt="Group Icon" size={60} />
        {title}
      </div>
      <Menu
        mode="inline"
        openKeys={openKeys}
        defaultActiveFirst
        onOpenChange={toggleSelectKeys}
      >
        <SubMenu key="users" icon={<UserOutlined />} title="Users">
          {users ? (
            users.length ? (
              getModifiedUsers(state.user.data, users).map((usr, index) => {
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
                      {isMe(state.user.data, usr.username) ? "Me" : usr.username}
                      {}
                    </Menu.Item>
                    {moreVisible[usr.id] && !isMe(state.user.data, usr.username) && (
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
