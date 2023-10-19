import React, { useState , useEffect } from 'react';
import AuthComponent from './AuthComponent';
import ChatComponent from './ChatComponent';
import {  Route, Routes, Navigate } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
function App() {
  const [isAuthenticated, setAuthenticated] = useState(localStorage.getItem("isAuthenticated") === "true");
  const [currentUser, setCurrentUser] = useState(localStorage.getItem("currentUser") || "");

  useEffect(() => {
    // Обновите localStorage каждый раз, когда состояние аутентификации меняется
    localStorage.setItem("isAuthenticated", isAuthenticated);
    localStorage.setItem("currentUser", currentUser);
  }, [isAuthenticated, currentUser]);

    const handleLogin = (username, password) => {
    setAuthenticated(true);
    setCurrentUser(username);
    };
  
    const handleRegister = (username, password) => {
    setAuthenticated(true);
    setCurrentUser(username);
    };
  
    return (
        <Router>
          <Routes>
            <Route 
              path="/login" 
              element={
                !isAuthenticated ? 
                  <AuthComponent onLogin={handleLogin} onRegister={handleRegister} /> :
                  
                  <Navigate to="/chat" />
              }
            />
            <Route 
              path="/chat" 
              element={
                isAuthenticated ? 
                <ChatComponent currentUser={currentUser} onLogout={() => {
                  setAuthenticated(false); 
                  setCurrentUser("");
                  localStorage.removeItem("currentUser");
                }} /> :
                  
                  <Navigate to="/login" />
              }
            />
            <Route path="*" element={<Navigate to={isAuthenticated ? "/chat" : "/login"} />} />
          </Routes>
        </Router>
      );
      
  }
  
  export default App;