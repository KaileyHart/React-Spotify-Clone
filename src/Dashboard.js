import React from "react";
import "./Dashboard.css";
import Sidebar from './Sidebar';
import Body from './Body';
import Footer from './Footer';

function Dashboard({ spotify }) {
  return (
    <div className="dashboard">
      <div className="dashboard__body">
        <Sidebar/>
        <Body spotify={spotify}/>
      </div>
      <Footer spotify={spotify}/>
    </div>
  );
}

export default Dashboard;
