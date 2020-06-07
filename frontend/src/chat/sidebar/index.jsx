import React, { useState, useEffect, useContext, Fragment } from "react";
import { navigate } from "@reach/router";
import { AppContext } from "src/context";
import "./sidebar.scss";
import { Layout, Menu, Dropdown, Progress, Avatar, Badge } from "antd";
const { Sider } = Layout;
const { SubMenu } = Menu;
import {
  SlackSquareOutlined,
  MessageOutlined,
  UserOutlined,
  CaretDownFilled,
  CloseCircleOutlined,
} from "@ant-design/icons";

const Sidebar = () => {
  const {
    state: { user, rooms, style, room, friend },
    logout,
    toggleSidebar,
  } = useContext(AppContext);
  const [selectedKey, setSelectedKey] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    setSelectedKey(
      room.data ? room.data.id : friend.data ? friend.data.username : ""
    );
  }, [room.data, friend.data]);

  const handleMenuItemClick = ({ id, sub }) => {
    navigate(`/chat/${sub}/${id}`);
    style.layout === "mobile" &&
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

  const isReady = () => {
    return user.data && (room.data || friend.data);
  };

  const getNotificationCount = (notifications, id) => {
    const ns = notifications.find(
      (notification) => notification.receiver === id
    );
    return ns ? ns.count : 0;
  };

  const userFavRooms = user.data.rooms.map(
    (room) => room.favourite && room.room.id
  );
  console.log("Id of user fav rooms if any", userFavRooms);
  return isReady() ? (
    <Sider
      trigger={null}
      collapsible
      collapsed={!style.showSidebar}
      width="240"
      collapsedWidth={style.layout === "mobile" ? 0 : 80}
      className={
        style.layout === "mobile" && style.showSidebar
          ? "small-left-sidebar"
          : "left-sidebar"
      }
    >
      <div className={style.showSidebar ? "logo" : "logo-small"}>
        {style.layout === "desktop" ? (
          style.showSidebar ? (
            <Fragment>
              {user.data.username}
              <Avatar size={40} icon={<UserOutlined />} alt="" />
              <Dropdown overlay={profile} trigger={["click"]}>
                <a
                  className="ant-dropdown-link"
                  onClick={(e) => e.preventDefault()}
                >
                  <CaretDownFilled />
                </a>
              </Dropdown>
            </Fragment>
          ) : (
            <Fragment>
              <Dropdown overlay={profile} trigger={["click"]}>
                <Avatar size={40} icon={<UserOutlined />} alt="" />
              </Dropdown>
            </Fragment>
          )
        ) : (
          <Fragment>
            <CloseCircleOutlined
              style={{ fontSize: "1.5em" }}
              onClick={() => toggleSidebar({ showSidebar: !style.showSidebar })}
            />
            {user.data.username}
            <Avatar size={40} icon={<UserOutlined />} alt="" />
            <Dropdown overlay={profile} trigger={["hover", "click"]}>
              <a
                className="ant-dropdown-link"
                onClick={(e) => e.preventDefault()}
              >
                <CaretDownFilled />
              </a>
            </Dropdown>
          </Fragment>
        )}
      </div>
      <Menu
        mode="inline"
        defaultOpenKeys={[
          "rooms",
          "byTopics",
          "byRegions",
          "byFavourite",
          "directMessages",
        ]}
        selectedKeys={[selectedKey]}
        className="sidebar-topic"
      >
        <SubMenu key="rooms" icon={<SlackSquareOutlined />} title="Rooms">
          <SubMenu
            key="byFavourite"
            title="Your Favourite"
            className="sub-topic"
          >
            {user.data.rooms.length
              ? user.data.rooms.map((rm) => {
                  return rm.favourite ? (
                    <Menu.Item
                      onClick={() =>
                        handleMenuItemClick({ id: rm.room.id, sub: "r" })
                      }
                      key={rm.room.id}
                    >
                      # {rm.room.name}
                      {user.data.notification.length &&
                      getNotificationCount(user.data.notification, rm.room.id) >
                        0 ? (
                        <Badge
                          count={getNotificationCount(
                            user.data.notification,
                            rm.room.id
                          )}
                          style={{
                            backgroundColor: "#52c41a",
                            marginLeft: 10,
                          }}
                        />
                      ) : null}
                    </Menu.Item>
                  ) : null;
                })
              : null}
          </SubMenu>

          <SubMenu key="byRegions" title="By Region" className="sub-topic">
            {rooms.data.length
              ? rooms.data.map((rm) => {
                  return rm.category === "Region" && !rm.favourite ? (
                    <Menu.Item
                      onClick={() =>
                        handleMenuItemClick({ id: rm.id, sub: "r" })
                      }
                      key={rm.id}
                    >
                      # {rm.name}
                      {user.data.notification.length &&
                      getNotificationCount(user.data.notification, rm.id) >
                        0 ? (
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
                  ) : null;
                })
              : null}
          </SubMenu>
          <SubMenu key="byTopics" title="By Topic" className="sub-topic">
            {rooms.data.length
              ? rooms.data.map((rm) => {
                  return rm.category === "Topic" && !rm.favourite ? (
                    <Menu.Item
                      onClick={() =>
                        handleMenuItemClick({ id: rm.id, sub: "r" })
                      }
                      key={rm.id}
                    >
                      # {rm.name}
                      {user.data.notification.length &&
                      getNotificationCount(user.data.notification, rm.id) >
                        0 ? (
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
                  ) : null;
                })
              : null}
          </SubMenu>
        </SubMenu>
        <SubMenu
          key="directMessages"
          icon={<MessageOutlined />}
          title="Direct Messages"
        >
          {user.data.friends.length ? (
            user.data.friends.map(({ status, friend }) => {
              return (
                <Menu.Item
                  onClick={() =>
                    handleMenuItemClick({ id: friend.username, sub: "u" })
                  }
                  key={friend.username}
                  icon={
                    status === "pending" ? (
                      <Badge status="processing" />
                    ) : friend.status === "online" ? (
                      <Badge status="success" />
                    ) : null
                  }
                >
                  {friend.username}
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
          ) : (
            <li> Your Inbox </li>
          )}
        </SubMenu>
      </Menu>
    </Sider>
  ) : null;
};

export default Sidebar;
