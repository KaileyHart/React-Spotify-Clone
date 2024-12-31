import React from "react";
import "./SidebarNavOption.css";

function SidebarNavOption({ option, Icon, image }) {
  return (
    <div className="sidebarNavOption">
      {Icon && <Icon className="sidebarNavOption__icon" />}
      {image ? <img src={image} className="sidebarNavOption__albumCover"/> : null}
      {Icon ? <h4>{option}</h4> : <p>{option}</p>}
    </div>
  );
}

export default SidebarNavOption;
