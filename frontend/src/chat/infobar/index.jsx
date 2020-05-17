import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "src/context";

import "./infobar.scss";
import { Layout, Menu, Dropdown, Avatar } from "antd";
const { Sider } = Layout;
const { SubMenu } = Menu;
import { UserOutlined } from "@ant-design/icons";

const Infobar = () => {
  const {
    state: { style },
  } = useContext(AppContext);

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
        Prakash
      </div>
      <Menu
        mode="inline"
        defaultOpenKeys={["users"]}
        // onSelect={() => handleMenuItemClick("showInfobar")}
      >
        <SubMenu key="users" icon={<UserOutlined />} title="Users">
          <Menu.Item
            key="0"
            icon={
              <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
            }
          >
            Tom
          </Menu.Item>
        </SubMenu>
      </Menu>
    </Sider>
  );
};

export default Infobar;
