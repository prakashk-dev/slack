import React, { useState } from "react";
import "./chat.scss";
import { navigate } from "@reach/router";

const Chat = () => {
  const [style, setStyle] = useState({ clockwise: {}, anticlockwise: {} });
  const [round, setRound] = useState(450 * 5);
  const [match, setMatch] = useState("Matched Group");
  const [toggleClick, setToggleClick] = useState({ pointerEvents: "auto" });
  const [border, setBorder] = useState("5px solid red");
  const [innerBoarderColor, setInnerBoarderColor] = useState(
    "0px 0px 0px 3px indianred"
  );
  const [innerBackgroundColor, setInnerBackgroundColor] = useState("red");
  const [traingleColor, setTraingleColor] = useState("20px solid red");

  const handleSpinner = () => {
    setToggleClick({ pointerEvents: "none" });
    setRound(round + 360 * 5);

    setStyle({
      clockwise: {
        transform: `rotate(${round}deg)`,
      },
      anticlockwise: {
        transform: `rotate(-${round}deg)`,
      },
    });
    const changeGroup = setInterval(() => {
      setMatch(Math.random().toString(36).substring(2));
    }, 100);

    setTimeout(() => {
      clearInterval(changeGroup);
      setToggleClick({ pointerEvents: "auto" });
      setBorder("5px solid darkgreen");
      setInnerBackgroundColor("green");
      setInnerBoarderColor("0px 0px 0px 3px darkgreen");
      setTraingleColor("20px solid darkgreen");
    }, 5000);
  };
  // these will be fetched from backend
  const popularGroups = [
    {
      name: "Kathmandu",
      userCount: 25,
      icon: "/assets/kathmandu.png",
    },
    {
      name: "Melbourne",
      userCount: 50,
      icon: "/assets/kathmandu.png",
    },
    {
      name: "Baltimore",
      userCount: 200,
      icon: "/assets/kathmandu.png",
    },
    {
      name: "New Work",
      userCount: 10,
      icon: "/assets/kathmandu.png",
    },
  ];
  const activeGroups = [
    {
      name: "Below 20 Years",
      userCount: 25,
      icon: "/assets/teenager.png",
    },
    {
      name: "Melbourne",
      userCount: 50,
      icon: "/assets/kathmandu.png",
    },
    {
      name: "20 - 20 Years",
      userCount: 200,
      icon: "/assets/teenager.png",
    },
    {
      name: "Programmers",
      userCount: 10,
      icon: "/assets/kathmandu.png",
    },
  ];

  return (
    <div className="chat">
      <div className="body">
        <div className="heading">
          <p>Select a chat room to start chating </p>
        </div>
        <div className="popular-chat-room">
          <p>Most popular chat rooms</p>
          <div className="chat-room">
            {popularGroups.map((group) => {
              return (
                <div
                  className="room"
                  onClick={() => navigate("/chat/123")}
                  key={group.name}
                >
                  <div className="icon">
                    <img src={group.icon} alt="" />
                  </div>
                  <div className="room-name">
                    {group.name} <span>({group.userCount})</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="popular-chat-room">
          <p>Most active chat rooms</p>
          <div className="chat-room">
            {activeGroups.map((group) => {
              return (
                <div
                  className="room"
                  onClick={() => navigate("/chat/123")}
                  key={group.name}
                >
                  <div className="icon">
                    <img src={group.icon} alt="" />
                  </div>
                  <div className="room-name">
                    {group.name} <span>(group.userCount)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="random-outlet">
          <p>Random Outlet</p>
          <span className="help-text">
            Click start button to randomly matched based on your profile
          </span>
          <div className="random-outlet-box">
            <p>Your username</p>
            <div className="outlet-container" style={{ border }}>
              <div
                className="start"
                onClick={handleSpinner}
                style={{
                  ...style.clockwise,
                  ...toggleClick,
                  backgroundColor: innerBackgroundColor,
                  boxShadow: innerBoarderColor,
                }}
              >
                <div
                  className="triangle-up"
                  style={{ borderBottom: traingleColor }}
                ></div>
                <div
                  className="start-text"
                  style={{
                    ...style.anticlockwise,
                  }}
                >
                  Start
                </div>
              </div>
            </div>
            <p>{match}</p>
          </div>
        </div>
      </div>

      <div className="footer">
        <div className="help-text">
          Your chats will be saved if you have an account.
        </div>
        <div className="create-account">
          <button>Create Account</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
