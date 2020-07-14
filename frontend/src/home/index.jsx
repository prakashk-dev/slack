import React, { useEffect, useContext } from "react";
import { AppContext } from "src/context";
import moment from "moment";

import Navigation from "./nav";

import "./home.scss";
import { navigate } from "@reach/router";

const Home = ({ children, location }) => {
  const { isAuthenticated, state } = useContext(AppContext);

  // this is required while user try to access login page while logged in
  useEffect(() => {
    if (isAuthenticated()) {
      const { data: user } = state.user;
      const isReturningUser =
        (user.rooms && user.rooms.length) ||
        (user.friends && user.friends.length) ||
        (user.groups && user.groups.length);
      if (isReturningUser) {
        // join user to all the rooms and blah blah blah
        const rg = [
          ...user.rooms.map((room) => room.room.id),
          ...user.groups.map((group) => group.group.id),
        ];
        state.socket.emit("joinUserToAllRoomsAndGroups", rg);
        navigate(getLastActiveUrl(user));
      } else {
        navigate("/chat/r/welcome");
      }
    } else {
      location.pathname !== "/login" && navigate("/signup");
    }
  }, []);

  const getLastActiveUrl = (user) => {
    const { rooms, groups, friends } = user;
    let compareArrays = [rooms[0], groups[0], friends[0]];
    compareArrays = compareArrays.filter((arr) => {
      if (arr === undefined) {
        return false;
      } else {
        return arr.friend
          ? arr.status !== "pending" || arr.status !== "rejected"
          : true;
      }
    });

    let lastActive = compareArrays.reduce(
      (lastActive, current) =>
        moment(lastActive.last_active).isAfter(current.last_active)
          ? lastActive
          : current,
      compareArrays[0]
    );

    const { friend, room, group } = lastActive;
    const sub = friend ? "u" : room ? "r" : "g";
    const id =
      (friend && friend.username) || (room && room.id) || (group && group.id);
    return `/chat/${sub}/${id}`;
  };

  return (
    <div className="home">
      <Navigation></Navigation>
      <div className="body">{children}</div>
    </div>
  );
};

export default Home;
