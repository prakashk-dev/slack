import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "src/context";

import Sidebar from "./sidebar";
import "./chat.scss";
import { Layout, Menu, Dropdown, Avatar } from "antd";
const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  TeamOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  DownOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

const Chat = ({ children, ...args }) => {
  const [groupId, setGroupId] = useState(null);
  const {
    state: { style },
    toggleSidebar,
  } = useContext(AppContext);

  useEffect(() => {
    const groupId = args["*"].split("/")[1];
    setGroupId(groupId);
  }, [args["*"]]);

  const ToggleIcon = (props) => {
    return style.showSidebar ? (
      <MenuFoldOutlined {...props} />
    ) : (
      <MenuUnfoldOutlined {...props} />
    );
  };
  const handleMenuItemClick = (sidebar) => {
    style.device === "mobile" && toggleSidebar({ [sidebar]: !style[sidebar] });
  };

  return (
    <Layout theme="dark" className="main-container">
      <Sidebar groupId={groupId} />
      <Content
        className="chat-container"
        style={{
          margin: "24px 16px",
          padding: 24,
          minHeight: 280,
        }}
      >
        <Header className="chat-header" style={{ padding: 0 }}>
          <ToggleIcon
            onClick={() => toggleSidebar({ showSidebar: !style.showSidebar })}
          />
          <div className="chat-title">Kathmandu</div>
          <InfoCircleOutlined
            onClick={() => toggleSidebar({ showInfobar: !style.showInfobar })}
          />
        </Header>
        <Layout className="chat-body">
          <Content>
            <div className="chat-content">
              Connect Users to the some random/general room and show some
              instruction on how to use application
            </div>
          </Content>
          <Sider
            collapsible
            collapsed={!style.showInfobar}
            className="right-sidebar"
            collapsedWidth={0}
            breakpoint={"sm"}
            defaultCollapsed={true}
          >
            <div className="profile">
              <Avatar src="/assets/kathmandu.png" alt="Group Icon" size={60} />
              Prakash
            </div>
            <Menu
              mode="inline"
              defaultOpenKeys={["users"]}
              onSelect={() => handleMenuItemClick("showInfobar")}
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
        </Layout>
      </Content>
    </Layout>
  );
};

export default Chat;
