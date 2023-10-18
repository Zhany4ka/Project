import React, { useState } from 'react';
import AuthComponent from './AuthComponent';
import ChatComponent from './ChatComponent';
import {  Route, Routes, Navigate } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
function App() {
    const [isAuthenticated, setAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState("");
  
    const handleLogin = (username, password) => {
    setAuthenticated(true);
    setCurrentUser(username);
      // Тут ваша логика авторизации...
    };
  
    const handleRegister = (username, password) => {
    setAuthenticated(true);
    setCurrentUser(username);
    alert('Вы успешно зарегистрированы!');
      // Тут ваша логика регистрации...
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
                 <ChatComponent currentUser={currentUser} onLogout={() => setAuthenticated(false)} /> :
                  
                  <Navigate to="/login" />
              }
            />
            <Route path="*" element={<Navigate to={isAuthenticated ? "/chat" : "/login"} />} />
          </Routes>
        </Router>
      );
      
  }
  
  export default App;