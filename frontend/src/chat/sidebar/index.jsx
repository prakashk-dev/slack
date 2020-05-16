import React, {
  useState,
  useEffect,
  useContext,
  useReducer,
  useRef,
} from "react";
import { navigate } from "@reach/router";
import { AppContext } from "src/context";
import "./sidebar.scss";

const Sidebar = ({ groupId }) => {
  const {
    state: { user, rooms, room, style },
    logout,
    fetchAuthUser,
    fetchRooms,
    fetchGroup,
    toggleSidebar,
  } = useContext(AppContext);
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
    let text = user.loading
      ? "..."
      : user.error
      ? user.error
      : user.data.username;
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
    const fetchRoom = async () => {
      await fetchGroup(groupId);
    };
    groupId && fetchRoom();
  }, [groupId]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleClick = (id) => {
    navigate(`/chat/g/${id}`);
    if (style.device === "mobile") {
      setTimeout(() => {
        toggleSidebar({
          showSidebar: false,
        });
      }, 100);
    }
  };

  return (
    <div className={style.device === "mobile" ? "mobile-sidebar" : "sidebar"}>
      <Profile />
      <div className="rooms">
        <div className="rooms-heading">
          <i className="las la-angle-right"></i>
          Rooms
        </div>
        <div className="rooms-list">
          {rooms.loading ? (
            <div className="loading">... </div>
          ) : rooms.error ? (
            <div className="error"> {rooms.error} </div>
          ) : rooms.data.length ? (
            rooms.data.map((g) => (
              <li
                onClick={() => handleClick(g._id)}
                key={g._id}
                className={g._id === groupId ? "active" : null}
              >
                # {g.name}
              </li>
            ))
          ) : (
            <div> No Rooms </div>
          )}
        </div>
      </div>
      <div className="users">
        <div className="users-heading">
          <i className="las la-angle-right"></i>
          Direct Messages
        </div>
        <div className="users-list">
          {user.loading ? (
            <li className="loading"> ... </li>
          ) : user.error ? (
            <div className="error">{user.error}</div>
          ) : user.data.friends && user.data.friends.length ? (
            user.data.friends.map((friend) => {
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
