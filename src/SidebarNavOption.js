import React from "react";
import "./SidebarNavOption.css";

function SidebarNavOption({ option, Icon }) {
  return (
    <div className="sidebarNavOption">
      {Icon && <Icon className="sidebarNavOption__icon" />}
      {Icon ? <h4>{option}</h4> : <p>{option}</p>}
    </div>
  );
}

export default SidebarNavOption;
