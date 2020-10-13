
import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';

class Dashboard extends Component {
state = {
    username:'',
    password: ''
  };

  render() {
    return (
      <div className="App">
        
        <div className="header" >
          StoryTellers Admin Panel
        </div>

        <div>Dashboard</div>
        
        
      </div>
    );
  }
}

export default Dashboard;