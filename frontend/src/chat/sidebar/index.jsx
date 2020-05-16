import React, { useState, useEffect, useContext } from "react";
import { navigate } from "@reach/router";
import { AppContext } from "src/context";
import "./sidebar.scss";
import { Layout, Menu, Dropdown, Progress, Avatar } from "antd";
const { Sider } = Layout;
const { SubMenu } = Menu;
import {
  DownOutlined,
  SlackSquareOutlined,
  MessageOutlined,
} from "@ant-design/icons";

import { Wrapper } from "src/common";

const Sidebar = ({ groupId }) => {
  const {
    state: { user, rooms, style },
    logout,
    fetchAuthUser,
    fetchRooms,
    fetchGroup,
    toggleSidebar,
  } = useContext(AppContext);

  useEffect(() => {
    fetchAuthUser();
    fetchRooms();
  }, []);

  useEffect(() => {
    const fetchRoom = async () => {
      await fetchGroup(groupId);
    };
    groupId && fetchRoom();
  }, [groupId]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleMenuItemClick = ({ key }) => {
    navigate(`/chat/g/${key}`);
    fetchGroup(key);
    style.device === "mobile" &&
      toggleSidebar({ showSidebar: !style.showSidebar });
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

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={!style.showSidebar}
      collapsedWidth={style.device === "mobile" ? 0 : 80}
      breakpoint={"sm"}
      className="left-sidebar"
    >
      <div className={style.showSidebar ? "logo" : "logo-collapse"}>
        <Wrapper data={user}>
          {style.showSidebar && user.data.username}
          {style.showSidebar && (
            <Avatar size={40} src="/assets/kathmandu.png" alt="" />
          )}
          <Dropdown overlay={profile} trigger={["hover", "click"]}>
            {style.showSidebar ? (
              <a
                className="ant-dropdown-link"
                onClick={(e) => e.preventDefault()}
              >
                <DownOutlined />
              </a>
            ) : (
              <Avatar size={40} src="/assets/kathmandu.png" alt="" />
            )}
          </Dropdown>
        </Wrapper>
      </div>
      <Wrapper data={rooms}>
        <Menu
          mode="inline"
          defaultSelectedKeys={[groupId]}
          onSelect={handleMenuItemClick}
          defaultOpenKeys={["rooms", "directMessages"]}
        >
          <SubMenu key="rooms" icon={<SlackSquareOutlined />} title="Room">
            {rooms.data.length
              ? rooms.data.map((rm) => {
                  return <Menu.Item key={rm._id}># {rm.name}</Menu.Item>;
                })
              : "No Romms"}
          </SubMenu>
          <SubMenu
            key="directMessages"
            icon={<MessageOutlined />}
            title="Direct Messages"
          >
            <Menu.Item key="6">Team 1</Menu.Item>
          </SubMenu>
        </Menu>
      </Wrapper>
    </Sider>
  );
};

export default Sidebar;
