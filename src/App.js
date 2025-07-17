import React, { useState, useEffect } from 'react';
import './App.css';

// OpenWeather API Key를 입력하세요
const API_KEY = '14290659cfe9cafb2e623bdbcd77075c';

function App() {
  // 입력값(도시 이름)을 저장할 상태
  const [city, setCity] = useState('');
  // 날씨 정보를 저장할 상태 (초기값: null, 첫 화면에 환영 인사)
  const [weather, setWeather] = useState(null);
  // 에러 메시지 상태
  const [error, setError] = useState('');
  // 현재 시간 상태
  const [currentTime, setCurrentTime] = useState(new Date());

  // 1초마다 현재 시간 갱신
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 입력값이 변경될 때 실행되는 함수
  const handleInputChange = (e) => {
    let value = e.target.value;
    // 영어로 입력된 경우 첫 글자만 대문자로 변환
    if (/^[a-zA-Z]/.test(value)) {
      value = value.charAt(0).toUpperCase() + value.slice(1);
    }
    setCity(value);
  };

  // 검색 버튼 클릭 또는 엔터 키 입력 시 실행되는 함수
  const handleSearch = async () => {
    if (!city) return; // 입력값이 없으면 아무것도 하지 않음

    try {
      // OpenWeather API 호출 (단위: metric = 섭씨)
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=kr`
      );
      const data = await response.json();

      if (data.cod === 200) {
        // API 호출 성공 시 날씨 정보 및 아이콘 코드 업데이트
        setWeather({
          city: data.name,
          temp: `${Math.round(data.main.temp)}°C`,
          desc: data.weather[0].description,
          icon: data.weather[0].icon, // 아이콘 코드 저장
        });
        setError(''); // 에러 메시지 초기화
      } else {
        // 도시를 찾을 수 없는 경우 에러 메시지 표시
        setError('도시를 찾을 수 없습니다');
        setWeather(null); // 날씨 정보 초기화
      }
    } catch (error) {
      // 네트워크 오류 등 예외 처리
      setError('도시를 찾을 수 없습니다');
      setWeather(null); // 날씨 정보 초기화
    }
  };

  // input에서 엔터 키를 눌렀을 때 검색 실행
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // OpenWeather 아이콘 이미지 URL 생성 (weather가 있을 때만)
  const iconUrl = weather ? `https://openweathermap.org/img/wn/${weather.icon}@4x.png` : '';

  // 현재 시간을 'HH:MM:SS' 형식으로 반환하는 함수
  const formatTime = (date) => {
    const pad = (n) => n.toString().padStart(2, '0');
    return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  return (
    <div className="weather-app">
      {/* 도시 이름을 입력하는 input */}
      <input
        type="text"
        placeholder="도시 이름을 입력하세요"
        value={city}
        onChange={handleInputChange} // 입력값 변경 시 첫 글자 대문자 처리
        onKeyDown={handleKeyDown} // 엔터 키 입력 시 검색
      />
      {/* 검색 버튼 */}
      <button onClick={handleSearch}>검색</button>
      {/* 날씨 정보를 표시하는 영역 */}
      <div className="weather-info">
        {/* 에러 메시지가 있을 때 빨간 글씨로 표시 */}
        {error && <div className="error-message">{error}</div>}
        {/* 날씨 정보가 있으면 날씨, 없으면 환영 인사 */}
        {weather ? (
          <>
            {/* 날씨 아이콘을 온도 위에 크게 표시 */}
            <img
              src={iconUrl}
              alt="날씨 아이콘"
              className="weather-icon"
            />
            <h2>{weather.city}</h2>
            <p>{weather.temp}</p>
            <p>{weather.desc}</p>
          </>
        ) : (
          // 환영 인사 메시지
          <div className="welcome-message">
            <h2>환영합니다!</h2>
            <p>도시 이름을 입력하고 날씨를 검색해보세요.</p>
          </div>
        )}
      </div>
      {/* 현재 시간 표시 (카드 아래, 검은색) */}
      <div className="current-time">{formatTime(currentTime)}</div>
    </div>
  );
}

export default App;
