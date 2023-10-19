// ChatComponent.js
import { Message } from './Message';
import React, { useState, useEffect, useRef } from 'react';
import './App.css';
function ChatComponent({ currentUser , onLogout}) {
  const [sender, setSender] = useState("");
  const [text, setText] = useState("");
  const handleLogout = () => {
    onLogout();
    setAuthenticated(false);
    setSender("");
};
  // eslint-disable-next-line no-unused-vars
  const [authenticated, setAuthenticated] = useState(false);

  //const [username, setUsername] = useState("");
  const [messages, setMessages] = useState(JSON.parse(localStorage.getItem('all_messages')) || []);
  const [showDevTools, setShowDevTools] = useState(false);
  //const [currentUser] = useState(localStorage.getItem("username") || "");
  const [isSendingAllowed, setSendingAllowed] = useState(
    localStorage.getItem("isSendingAllowed") !== "false" // По умолчанию true, если значение не установлено
);
  const [isFileSendingAllowed, setFileSendingAllowed] = useState(
    localStorage.getItem("isFileSendingAllowed") !== "false"
);
  const [file, setFile] = useState(null);
  const removeFile = () => {
    setFile(null);
  };

  const fileInputRef = useRef(null);

  const [location, setLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyingToMessage, setReplyingToMessage] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
  title: '',
  body: '',
  input: false,
  onConfirm: null
});
  const [customModalTitle, setCustomModalTitle] = useState("");
  const [customModalBody, setCustomModalBody] = useState("");
  const [customModalInput, setCustomModalInput] = useState(false);

  const [modalInputValue, setModalInputValue] = useState("");
  useEffect(() => {
    setSender(currentUser);
  }, [currentUser]);








  
  useEffect(() => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        });
    } else {
        openModal({
          title: "Ошибка",
          body: "Geolocation не поддерживается вашим браузером."

        })
    }
}, []);



  const handleSend = () => {
      setMessages(messages.map(msg => ({ ...msg, isTargeted: false })));
      if ((isSendingAllowed || currentUser === "Admin") && sender.trim() && text.trim() && (isFileSendingAllowed || !file)) {
          const newMessage = { sender: sender.trim(), 
            text: text.trim() , 
            reported: false ,
            file: file ? URL.createObjectURL(file) : null,
            fileName: file ? file.name : null ,
            replyTo: replyingToMessage  };
          
          
          if (replyingToMessage) {
            newMessage.replyTo = replyingToMessage;
            setReplyingToMessage(null);
        }
          const updatedMessages = [...messages, newMessage];        
          // Сохранение всех сообщений в localStorage
          localStorage.setItem('all_messages', JSON.stringify(updatedMessages));
          setMessages([...messages, newMessage]);
          setText("");
      } else if (!isSendingAllowed && currentUser !== "Admin") {
        openModal({
            title: 'Ошибка',
            body: 'Отправка сообщений временно ограничена.'
          });
      } else {
        openModal({
            title: 'Ошибка',
            body: 'Введите сообщение'
          });
      }
  };

  const handleEdit = (index, newText) => {
      const updatedMessages = [...messages];
      updatedMessages[index].text = newText;
      localStorage.setItem('all_messages', JSON.stringify(updatedMessages));
      setMessages(updatedMessages);
  };

  const handleDelete = (index) => {
      const updatedMessages = [...messages];
      updatedMessages.splice(index, 1);
      localStorage.setItem('all_messages', JSON.stringify(updatedMessages));
      setMessages(updatedMessages);
  };


  const toggleDevTools = () => {
    setShowDevTools(!showDevTools);
};
useEffect(() => {
    const fetchWeatherByCoordinates = async () => {
        try {
            const apiWeather = "630191d7eb42751452a35aa24e1f0244"; //630191d7eb42751452a35aa24e1f0244

            
            // Получить погоду напрямую по координатам
            
            const responseWeather = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&units=metric&lang=ru&appid=${apiWeather}`);

            const weatherData = await responseWeather.json();
            console.log(location.latitude, location.longitude)
            console.log(weatherData);// Данные о погоде
            if (weatherData && weatherData.main) {  // Проверка на наличие данных о погоде
              setWeatherData(weatherData);
          } else {
              openModal({
                title: "Ошибка 401",
                body: "введите API ключ для openweathermap"
              })
              console.error("Недостаточно данных для отображения погоды.");
          }
      

            //setWeatherData(weatherData);
            setLoading(false);
        } catch (error) {
            console.error("Ошибка при получении данных о погоде:", error);
            setLoading(false);
        }
    };

    if (location) {
        fetchWeatherByCoordinates();
    }
}, [location]);
  const openModal = (content) => {
    setModalContent(content);
    setModalOpen(true);
  };
  
  const closeModal = () => {
    setModalOpen(false);
    setModalContent({
      title: '',
      body: '',
      input: false,
      onConfirm: null
    });
    setModalInputValue('');
  };

  function goToOriginalMessage(targetMessage) {
    const targetIndex = messages.findIndex(msg => msg === targetMessage);
    if (targetIndex !== -1) {

        const updatedMessages = messages.map((msg, idx) => ({
            ...msg,
            isTargeted: idx === targetIndex
        }));
        setMessages(updatedMessages);


        setTimeout(() => {
            const messagesWithoutTarget = updatedMessages.map(message => 
                message === targetMessage ? {...message, isTargeted: false} : message
            );
            setMessages(messagesWithoutTarget);
        }, 3000);
    }
}
const fetchWeatherByCity = async (cityName) => {
  if (!cityName || !cityName.trim()) {
    alert("Введите название города на английском")
    return;
}
    try {
      const apiWeather = "630191d7eb42751452a35aa24e1f0244";
      
      const responseWeather = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&lang=ru&appid=${apiWeather}`);
      const weatherData = await responseWeather.json();
      if (weatherData && weatherData.main) {  // Проверка на наличие данных о погоде
        setWeatherData(weatherData);
    } else {
        openModal({
          title: "Ошибка 404",
          body: "Название города недействительно , его либо не существует в базе данных openweathermap , либо вы ввели город не на английском . Попробуйте еще раз"
        })
        console.error("Недостаточно данных для отображения погоды.");
    }

      //setWeatherData(weatherData);
      setLoading(false);
  }  catch (error) {
      console.error("Ошибка при получении данных о погоде:", error);
      setLoading(false);
  }
 

  
  }




const openCityModal = () => {
  openModal({
      title: 'Введите город',
      body: 'Пожалуйста, введите название города на английском:',
      input: true,
      onConfirm: (cityName) => fetchWeatherByCity(cityName)
  });
};



  return (
        <div id="chatContainer">
            <div id="header">Чат</div>
            {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <span className="modal-title">{modalContent.title}</span>
              <button onClick={closeModal}>✖</button>
            </div>
            <div className="modal-body">
              {modalContent.body}
              {modalContent.input && (
                <input 
                  type="text" 
                  className="modal-input" 
                  value={modalInputValue} 
                  onChange={(e) => setModalInputValue(e.target.value)}
                />
              )}
            </div>
            <div className="modal-footer">
              <button onClick={() => {
                  modalContent.onConfirm && modalContent.onConfirm(modalInputValue);
                  closeModal();
              }}>Ок</button>
              <button onClick={closeModal}>Отмена</button>
            </div>
          </div>
        </div>
      )}
            <div className="weather-widget">
    {
        loading ? (
            <div>Загрузка данных о погоде...</div>
        ) : weatherData ? (
          <div>
          <div className="weather-header">
              <h3>Погода в {weatherData.name}</h3>
              <button className="weather-change-btn" onClick={openCityModal}>!</button>
          </div>
      
          <div className="weather-info">
          
              <img 
                  src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`} 
                  alt={weatherData.weather[0].description} 
                  className="weather-icon" 
              />
      
              <span className="weather-temperature">🌡 {Math.round(weatherData.main.temp)}°C</span>
              <span className="weather-humidity">Влажность: {weatherData.main.humidity}%</span>
              <span className="weather-wind">Ветер: {weatherData.wind.speed} м/с</span>
              <span className="weather-pressure">Давление: {weatherData.main.pressure} гПа</span>
          </div>
      </div>
      
        ) : (
            <div>Не удалось загрузить данные о погоде.</div>
        )
    }
</div>


            {showDevTools && (
            <div className="devToolsPanel">
              <h3>Настройки разработчика</h3>
              <label>
            <input 
                type="checkbox" 
                checked={isSendingAllowed} 
                onChange={() => {
                  const newState = !isSendingAllowed;
                  setSendingAllowed(newState);
                  localStorage.setItem("isSendingAllowed", newState.toString());
              }} 
            />
            Разрешить отправку сообщений
            </label>
            <br/><br/>
            <label>
            <input 
                type="checkbox" 
                checked={isFileSendingAllowed} 
                onChange={() => {
                    const newState = !isFileSendingAllowed;
                    setFileSendingAllowed(newState);
                    localStorage.setItem("isFileSendingAllowed", newState.toString());
                }} 
            />
            Разрешить отправку файлов
            </label>
            <br/><br/>
            <h4>Создать кастомное модальное окно:</h4>
    <input 
      type="text" 
      placeholder="Заголовок"
      value={customModalTitle}
      onChange={(e) => setCustomModalTitle(e.target.value)}
    />
    <input 
      type="text" 
      placeholder="Содержание"
      value={customModalBody}
      onChange={(e) => setCustomModalBody(e.target.value)}
    />
    <label>
      <input 
        type="checkbox" 
        checked={customModalInput}
        onChange={() => setCustomModalInput(!customModalInput)}
      />
      Включить ввод в модальном окне
    </label>
    <button onClick={() => {
      openModal({
        title: customModalTitle,
        body: customModalBody,
        input: customModalInput,
        onConfirm: null
      });
    }}>Открыть модальное окно</button>


              {/* Здесь могут быть ваши инструменты и настройки */}
            </div>
            )}
        
          
            <>
            <>
        <button className="logout-button" onClick={handleLogout}>Выход</button>
    </>
                <div id="messages">
                    {messages.map((message, index) => (
                        <Message
                            key={index}
                            message={message}
                            onEdit={(newText) => handleEdit(index, newText)}
                            onDelete={() => handleDelete(index)}
                            sender={sender}
                            setReplyingToMessage={setReplyingToMessage}
                            goToOriginalMessage={goToOriginalMessage}
                            openModal={openModal}
                        />
                    ))}
                </div>
                {
            replyingToMessage && (
                <div className="replying-to">
                    Отвечаете на: {replyingToMessage.text}
                    <button onClick={() => setReplyingToMessage(null)}>✖</button>
                </div>
            )
        }
                <div id="inputContainer">
                {file && (
          <span className="attached-file">
            {file.name}
            <button className="remove-file-btn" onClick={removeFile}>✖</button>
          </span>
        )}
                <button className="uploadFileButton" onClick={() => fileInputRef.current.click()}>
    📎
                </button>
                <input type="file" style={{display: 'none'}} ref={fileInputRef} onChange={(e) => setFile(e.target.files[0])} />
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Введите сообщение..."
                    />
                    <button onClick={handleSend}>➤</button>
                </div>
                {currentUser === "Admin" && (
                <button className="devToolsButton" onClick={toggleDevTools}>D</button>
            )}
            </>
           
        
    </div>
);


}

export default ChatComponent;
