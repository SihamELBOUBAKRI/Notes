import React, { useState } from "react";
import axios from "axios";
import "./Login.css";

const Login = ({ setToken,setIsConnected, setUserInfo }) => {
  const [cin, setCin] = useState(localStorage.getItem("cin") || "");
  const [password, setPassword] = useState(localStorage.getItem("password") || "");
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  const handleLoginClick = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://notes.devlop.tech/api/login", {
        cin,
        password,
      });

      if (res.status === 200) {
        setUserLoggedIn(true);
        setIsConnected(true);
        setToken(res.data.token);
        setUserInfo({
          userfirstname: res.data.user.first_name,
          userlastname: res.data.user.last_name,
        });

        // Save CIN and password to localStorage
        localStorage.setItem("cin", cin);
        localStorage.setItem("password", password);
        localStorage.setItem("token", res.data.token);
      }
    } catch (err) {
      console.log("Login failed");
      setUserLoggedIn(false);
    }
  };

  return (
    <div className="Login">
      <form onSubmit={handleLoginClick}>
        <input
          type="text"
          value={cin}
          onChange={(e) => setCin(e.target.value)}
          placeholder="CIN"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
