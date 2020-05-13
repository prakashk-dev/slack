import React, {
  useState,
  useEffect,
  useContext,
  useReducer,
  useRef,
} from "react";
import { navigate } from "@reach/router";
import { useFetch } from "src/utils/axios";
import { AppContext } from "src/context";
import axios from "axios";
import "./sidebar.scss";

const Sidebar = ({ groupId }) => {
  const [rooms, rLoading, rError] = useFetch("groups");
  const { state, logout, fetchAuthUser, fetchRooms } = useContext(AppContext);
  const [user, uLoading, uError] = useFetch(`users/${state.user.username}`);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchAuthUser();
    fetchRooms();
  }, []);

  useEffect(() => {
    const removeListener = () =>
      document.removeEventListener("mousedown", handleClick);
    const handleClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
        removeListener();
      }
    };
    if (profileOpen) {
      document.addEventListener("mousedown", handleClick);
    } else {
      removeListener();
    }
    return removeListener;
  }, [profileOpen]);

  const Profile = () => {
    let text = uLoading ? "..." : uError ? uError.error : user.username;
    return (
      <div className="user-profile">
        <div className="profile-picture">
          <img src="/assets/kathmandu.png" alt="" />
        </div>
        {text}
        <div className="gear-icon">
          <i
            className={profileOpen ? "las la-cog active" : "las la-cog"}
            onClick={() => setProfileOpen(!profileOpen)}
          ></i>
        </div>
        {profileOpen && (
          <div className="profile-popup" ref={dropdownRef}>
            <i className="las la-caret-up"></i>
            <div className="profile-status">
              <div className="status">
                <div className="status-bar">40%</div>
              </div>
              <div className="profile-status-text">Profile status</div>
            </div>
            <li>Profile</li>
            <li onClick={handleLogout}>Logout</li>
          </div>
        )}
      </div>
    );
  };
  useEffect(() => {
    if (groupId) {
      axios
        .post(`/api/groups/${groupId}/users`, { userId: state.user.id })
        .then((res) => console.log(res.data))
        .catch(console.log);
    }
  }, [groupId]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <div className="sidebar">
      <Profile />
      <div className="rooms">
        <div className="rooms-heading">
          <i className="las la-angle-right"></i>
          Rooms
        </div>
        <div className="rooms-list">
          {rLoading ? (
            <div className="loading">... </div>
          ) : rError ? (
            <div className="error"> {rError} </div>
          ) : (
            rooms &&
            rooms.map((g) => (
              <li
                onClick={() => navigate(`/chat/g/${g._id}`)}
                key={g._id}
                className={g._id === groupId ? "active" : null}
              >
                # {g.name}
              </li>
            ))
          )}
        </div>
      </div>
      <div className="users">
        <div className="users-heading">
          <i className="las la-angle-right"></i>
          Direct Messages
        </div>
        <div className="users-list">
          {uLoading ? (
            <li className="loading"> ... </li>
          ) : uError ? (
            <div className="error">{uError}</div>
          ) : user && user.friends.length ? (
            user.friends.map((friend) => {
              return <li key={friend._id}>{friend.username}</li>;
            })
          ) : (
            <div className="no-friends">No Friends</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
