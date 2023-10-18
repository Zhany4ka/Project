import React, { useState } from 'react';
import './App.css';
function AuthComponent({ onLogin, onRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginClick = () => {
    const storedPassword = localStorage.getItem(`user_${username}`);
    if (storedPassword && storedPassword === password) {
      onLogin(username); // Передаем имя пользователя в функцию-коллбэк
    } else {
      alert('Неправильный логин или пароль');
    }
  };

  const handleRegisterClick = () => {
    if (localStorage.getItem(`user_${username}`)) {
      alert('Это имя пользователя уже занято');
    } else {
      localStorage.setItem(`user_${username}`, password);
      onRegister(username); // Передаем имя пользователя в функцию-коллбэк
    }
  };

  return (
    <div id="authContainer">
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Имя пользователя"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Пароль"
      />
      <button onClick={handleLoginClick}>Войти</button>
      <button onClick={handleRegisterClick}>Зарегистрироваться</button>
    </div>
  );
}

export default AuthComponent;
