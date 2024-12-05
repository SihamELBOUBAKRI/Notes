import React, { useState } from "react";
import axiosApi from "../Axios";
import "./Login.css";

const Login = ({ setToken,setIsConnected, setUserInfo ,setLoading}) => {
  const [cin, setCin] = useState(localStorage.getItem("cin") || "");
  const [password, setPassword] = useState(localStorage.getItem("password") || "");
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  const handleLoginClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosApi.post("/login", { cin, password });

      setUserLoggedIn(true);
      setIsConnected(true);
      setToken(res.token);
      setUserInfo({
        userfirstname: res.user.first_name,
        userlastname: res.user.last_name,
      });

      // Save CIN, password, and token to localStorage
      localStorage.setItem("cin", cin);
      localStorage.setItem("password", password);
      localStorage.setItem("token", res.token);
      setLoading(false);
    } catch (err) {
      console.log("Login failed");
      setUserLoggedIn(false);
    }
  };

  return (
    <div className="Login">
      
      <form onSubmit={handleLoginClick}>
        <div className="greeting">
          <h1 className="salutation">Hello  <img className="hi" src="./images/smile.png"/></h1>
        </div>
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
