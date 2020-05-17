import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "src/context";

import "./infobar.scss";
import { Layout, Menu, Dropdown, Avatar } from "antd";
const { Sider } = Layout;
const { SubMenu } = Menu;
import { UserOutlined } from "@ant-design/icons";

const Infobar = ({ entity, field }) => {
  const { state } = useContext(AppContext);
  const { style } = state;
  const name = state[entity].data[field];
  const users = state[entity].data.users;
  return (
    <Sider
      collapsible
      collapsed={!style.showInfobar}
      className="right-sidebar"
      collapsedWidth={0}
      breakpoint={"sm"}
      defaultCollapsed={false}
    >
      <div className="profile">
        <Avatar src="/assets/kathmandu.png" alt="Group Icon" size={60} />
        {name}
      </div>
      <Menu
        mode="inline"
        defaultOpenKeys={["users"]}
        // onSelect={() => handleMenuItemClick("showInfobar")}
      >
        <SubMenu key="users" icon={<UserOutlined />} title="Users">
          {users && users.length
            ? users.map((user) => {
                return (
                  <Menu.Item
                    key={user._id}
                    icon={
                      <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                    }
                  >
                    {user.username}
                  </Menu.Item>
                );
              })
            : "No users."}
        </SubMenu>
      </Menu>
    </Sider>
  );
};

export default Infobar;
