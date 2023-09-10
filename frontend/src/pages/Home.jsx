import React, { useState, useEffect } from "react";
import Axios from "axios";
const Home = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState({
    name: "",
    country: "",
    temp: "",
    description: "",
    max: "",
    min: "",
    icon: "",
    humidity: "",
    feelsLike: "",
    windSpeed: "",
  });

  const {
    name,
    country,
    temp,
    description,
    max,
    min,
    icon,
    humidity,
    feelsLike,
    windSpeed,
  } = weatherData;
  const imgURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;

  useEffect(() => {
    searchWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const searchWeather = async () => {
    const apiKey = "d76e52f8523b88ad4aa15b514a3d7028";
    const units = "metric";
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (!city) {
            url = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=${units}`;
            fetchWeather(url);
          }
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }

    if (city) {
      fetchWeather(url);
    }
  };

  const fetchWeather = async (url) => {
    try {
      const response = await Axios.get(url);

      const icon = response.data.weather[0].icon;
      setWeatherData({
        name: response.data.name,
        country: response.data.sys.country,
        temp: response.data.main.temp.toFixed(),
        description: response.data.weather[0].description,
        max: response.data.main.temp_max.toFixed(),
        min: response.data.main.temp_max.toFixed(),
        icon: icon,
        imgURL: imgURL,
        humidity: response.data.main.humidity,
        feelsLike: response.data.main.feels_like,
        windSpeed: response.data.wind.speed,
      });
    } catch (error) {
      console.error(error);
    }

    setCity("");
  };

  return (
    <>
      <div className="app">
        <div className="search">
          <input
            id="cityInput"
            type="text"
            name="cityName"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Search..."
          ></input>
          <button type="submit" onClick={searchWeather}>
            <i class="fa fa-search"></i>
          </button>
        </div>

        <div className="container">
          {/* TOP */}
          <div className="top">
            <div className="img-url">
              <img src={imgURL} alt="weather"></img>
            </div>
            <div className="location">
              <p>
                {name}, {country}{" "}
              </p>
            </div>

            <div className="temp">
              <h2>{temp} °C</h2>
            </div>

            <div className="description">
              <p>{description}</p>
            </div>

            <div className="min-max">
              <p>
                Max: {max} °C, Min: {min} °C
              </p>
            </div>
          </div>

          {/* BOTTOM */}
          <div className="bottom">
            <div className="feels">
              <p className="bold"> {feelsLike} °C</p>
              <p>Feels like</p>
            </div>

            <div className="humidity">
              <p className="bold">{humidity}%</p>
              <p>Humidity</p>
            </div>

            <div className="wind">
              <p className="bold">{windSpeed} MPH</p>
              <p>Wind speed</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
