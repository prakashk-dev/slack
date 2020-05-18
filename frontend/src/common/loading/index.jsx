import React from "react";
import "./loading.scss";

const Loading = () => {
  return (
    <div className="app-loading">
      <div className="app-loading-dot"></div>
      <div className="app-loading-text">Loading ...</div>
    </div>
  );
};
export default Loading;
