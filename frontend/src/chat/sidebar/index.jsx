import React, { useState, useEffect, useContext } from "react";
import { navigate } from "@reach/router";
import { AppContext } from "src/context";
import "./sidebar.scss";
import { Layout, Menu, Dropdown, Progress, Avatar, Badge } from "antd";
const { Sider } = Layout;
const { SubMenu } = Menu;
import {
  DownOutlined,
  SlackSquareOutlined,
  MessageOutlined,
  UserOutlined,
  CaretDownFilled,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const Sidebar = () => {
  const {
    state: { user, rooms, style, room, friend },
    logout,
    toggleSidebar,
  } = useContext(AppContext);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleMenuItemClick = ({ id, sub }) => {
    navigate(`/chat/${sub}/${id}`);
    //   style.device === "mobile" &&
    //     toggleSidebar({ showSidebar: !style.showSidebar });
  };

  const profile = (
    <Menu className="menu-item">
      <Menu.Item key="0">
        <Progress
          type="circle"
          strokeColor={{
            "0%": "#108ee9",
            "100%": "#87d068",
          }}
          percent={90}
        />
        Profile Completion
        <Menu.Divider />
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="1">
        <a target="_blank">Profile</a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="2">
        <a target="_blank" onClick={handleLogout}>
          Logout
        </a>
      </Menu.Item>
    </Menu>
  );
  const getSelectedKeys = () => {
    return room.data
      ? [room.data.id]
      : friend.data
      ? [friend.data.username]
      : [];
  };

  const isReady = () => {
    return user.data && (room.data || friend.data);
  };

  const getNotificationCount = (notifications, id) => {
    const ns = notifications.find((notification) => notification.sender === id);
    console.log("id", notifications, ns);
    return ns ? ns.count : 0;
  };

  return isReady() ? (
    <Sider
      trigger={null}
      collapsible
      collapsed={!style.showSidebar}
      collapsedWidth={style.device === "mobile" ? 0 : 80}
      className="left-sidebar"
    >
      <div className={style.showSidebar ? "logo" : "logo-small"}>
        {style.showSidebar && user.data.username}
        {style.showSidebar && (
          <Avatar size={40} icon={<UserOutlined />} alt="" />
        )}
        <Dropdown overlay={profile} trigger={["hover", "click"]}>
          {style.showSidebar ? (
            <a
              className="ant-dropdown-link"
              onClick={(e) => e.preventDefault()}
            >
              <CaretDownFilled />
            </a>
          ) : (
            <Avatar size={40} icon={<UserOutlined />} alt="" />
          )}
        </Dropdown>
      </div>
      <Menu
        mode="inline"
        // onSelect={handleMenuItemClick}
        defaultOpenKeys={["rooms", "directMessages"]}
        forceSubMenuRender={true}
        selectedKeys={getSelectedKeys()}
      >
        <SubMenu key="rooms" icon={<SlackSquareOutlined />} title="Room">
          {rooms.data.length
            ? rooms.data.map((rm) => {
                return (
                  <Menu.Item
                    onClick={() => handleMenuItemClick({ id: rm.id, sub: "r" })}
                    key={rm.id}
                  >
                    # {rm.name}
                    {user.data.notification.length &&
                    getNotificationCount(user.data.notification, rm.id) > 0 ? (
                      <Badge
                        count={getNotificationCount(
                          user.data.notification,
                          rm.id
                        )}
                        style={{
                          backgroundColor: "#52c41a",
                          marginLeft: 10,
                        }}
                      />
                    ) : null}
                  </Menu.Item>
                );
              })
            : null}
        </SubMenu>
        <SubMenu
          key="directMessages"
          icon={<MessageOutlined />}
          title="Direct Messages"
        >
          {user.data.friends.length
            ? user.data.friends.map(({ status, friend }) => {
                return (
                  <Menu.Item
                    onClick={() =>
                      handleMenuItemClick({ id: friend.username, sub: "u" })
                    }
                    key={friend.username}
                    icon={
                      status === "pending" ? (
                        <Badge status="processing" />
                      ) : null
                    }
                  >
                    <span className={status}>{friend.username}</span>uiop
                    {user.data.notification.length &&
                    getNotificationCount(user.data.notification, friend.id) >
                      0 ? (
                      <Badge
                        count={getNotificationCount(
                          user.data.notification,
                          friend.id
                        )}
                        style={{
                          backgroundColor: "#52c41a",
                          marginLeft: 10,
                        }}
                      />
                    ) : null}
                  </Menu.Item>
                );
              })
            : null}
        </SubMenu>
      </Menu>
    </Sider>
  ) : null;
};

export default Sidebar;
