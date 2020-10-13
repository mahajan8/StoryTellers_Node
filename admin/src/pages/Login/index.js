
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';
import strings from '../../util/strings';

const Login = () => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

    return (
      <div className="App">
        
        <div className="header" >
          StoryTellers Admin Panel
        </div>

        <div className=" loginTitle" >

          SIGN IN

        </div>

        <div className="loginBox" >
          <input className="inputBox" type='text' value={username} onChange={(e)=>setUsername(e.target.value)} placeholder={strings.username} />
          <br/>
          <input className="inputBox" type='text' value={password} onChange={(e)=>setPassword(e.target.value)} placeholder={strings.password}/>
          <br/>
          <button className="submitButton" onClick={()=>console.log(username)}>SUBMIT</button>

        </div>
        
        
      </div>
    );
  }


export default Login;