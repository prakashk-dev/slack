import React, { Component, useContext, useState } from "react";
import { AppContext } from "src/context";
import "./chat.scss";

const Chat = () => {
  const [state] = useContext(AppContext);
  const [style, setStyle] = useState({ clockwise: {}, anticlockwise: {} });
  const [round, setRound] = useState(450 * 5);
  const [match, setMatch] = useState("Matched Group");
  const handleSpinner = () => {
    setStyle({
      clockwise: {
        transform: `rotate(${round}deg)`,
      },
      anticlockwise: {
        transform: `rotate(-${round}deg)`,
      },
    });
    setRound(round + 360 * 5);
    const changeGroup = setInterval(() => {
      setMatch(Math.random().toString(36).substring(2));
    }, 100);
    setTimeout(() => {
      clearInterval(changeGroup);
    }, 5000);
  };

  return (
    <div className="chat">
      <div className="body">
        <div className="heading">
          <p>Select a chat room to start chating </p>
        </div>
        <div className="popular-chat-room">
          <p>Most popular chat rooms</p>
          <div className="chat-room">
            <div className="room">
              <div className="icon">
                <img src="/assets/kathmandu.jpeg" alt="" />
              </div>
              <div className="room-name">
                Kathmandu <span>(20)</span>
              </div>
            </div>

            <div className="room">
              <div className="icon">
                <img src="/assets/kathmandu.jpeg" alt="" />
              </div>
              <div className="room-name">
                Kathmandu <span>(20)</span>
              </div>
            </div>

            <div className="room">
              <div className="icon">
                <img src="/assets/teenager.png" alt="" />
              </div>
              <div className="room-name">
                Below 20 Years <span>(20)</span>
              </div>
            </div>

            <div className="room">
              <div className="icon">
                <img src="/assets/teenager.png" alt="" />
              </div>
              <div className="room-name">
                Below 20 Years <span>(20)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="popular-chat-room">
          <p>Most active chat rooms</p>
          <div className="chat-room">
            <div className="room">
              <div className="icon">
                <img src="/assets/teenager.png" alt="" />
              </div>
              <div className="room-name">
                Below 20 Years <span>(20)</span>
              </div>
            </div>

            <div className="room">
              <div className="icon">
                <img src="/assets/teenager.png" alt="" />
              </div>
              <div className="room-name">
                Below 20 Years <span>(20)</span>
              </div>
            </div>

            <div className="room">
              <div className="icon">
                <img src="/assets/kathmandu.jpeg" alt="" />
              </div>
              <div className="room-name">
                Kathmandu <span>(20)</span>
              </div>
            </div>

            <div className="room">
              <div className="icon">
                <img src="/assets/kathmandu.jpeg" alt="" />
              </div>
              <div className="room-name">
                Kathmandu <span>(20)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="random-outlet">
          <p>Random Outlet</p>
          <span className="help-text">
            Click start button to randomly matched based on your profile
          </span>
          <div className="random-outlet-box">
            <p>Your username</p>
            <div className="outlet-container">
              <div
                className="start"
                onClick={handleSpinner}
                style={style.clockwise}
              >
                <div className="triangle-up"></div>
                <div className="start-text" style={style.anticlockwise}>
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
