import React, { useState } from 'react';
import './App.css';
import Login from './components/Login/Login';
import Notes from './components/Notes/Notes';
import Navbar from './components/Navbar/Navbar';

function App() {
  const [IsConnected, setIsConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [token, setToken] = useState(""); 
  const [UserInfo,setUserInfo]=useState("");
  

  return (
    <>
      {IsConnected ? (
        <>
          <Navbar UserInfo={UserInfo} setSearchQuery={setSearchQuery} setIsConnected={setIsConnected} />
          <Notes  token={token}  searchQuery={searchQuery} />
        </>
      ) : (
        <Login setToken={setToken}  setIsConnected={setIsConnected} setUserInfo={setUserInfo}/>
      )}
    </>
  );
}

export default App;
