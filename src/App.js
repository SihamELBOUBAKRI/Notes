import React, { useState ,useEffect} from 'react';
import './App.css';
import Login from './components/Login/Login';
import Notes from './components/Notes/Notes';
import Navbar from './components/Navbar/Navbar';

function App() {
  const [IsConnected, setIsConnected] = useState(false); 
  const [searchQuery, setSearchQuery] = useState('');
  const [token, setToken] = useState(""); 
  const [UserInfo,setUserInfo]=useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedCin = localStorage.getItem('cin');
    const savedPassword = localStorage.getItem('password');
    if (savedToken && savedCin && savedPassword) {
      setToken(savedToken);
      setIsConnected(true);
      setUserInfo({
        userfirstname: "User", 
        userlastname: "Name",
      });
    }
  }, []);
  

  return (
    <>
      {loading && (
        <div className="loading-overlay">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}


      {IsConnected ? (
        <>
          <Navbar UserInfo={UserInfo} setSearchQuery={setSearchQuery} setIsConnected={setIsConnected} />
          <Notes  token={token}  setLoading={setLoading} searchQuery={searchQuery} />
        </>
      ) : (
        <Login setToken={setToken} setLoading={setLoading}  setIsConnected={setIsConnected} setUserInfo={setUserInfo}/>
      )}
    </>
  );
}

export default App;
