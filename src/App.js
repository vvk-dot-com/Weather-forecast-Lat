import React, { useState, useEffect } from 'react';
import './App.css';
import { AppBar, Toolbar, Typography, Button, TextField } from '@mui/material';
import CloudIcon from '@mui/icons-material/Cloud'; 
import AirIcon from '@mui/icons-material/Air';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WaterIcon from '@mui/icons-material/Water';import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TodayIcon from '@mui/icons-material/Today';
import PlaceIcon from '@mui/icons-material/Place';
import DescriptionIcon from '@mui/icons-material/Description';

const App = () => {
  const [city, setCity] = useState('');
  const [forecast, setForecast] = useState(null);
  const [isloading, setIsloading]=useState(false);
  const apiKey = '2c2995961e879ea7fe8d67371fa19ced';

  const handleSubmit = e => {
    e.preventDefault();
    setIsloading(true);
    const newCity = e.target.elements.city.value;
    setCity(newCity);
  };

  useEffect(() => {
    const getWeatherData = (latitude, longitude) => {
      const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => setForecast(data));
    };

    const getCurrentLocation = () => {
      navigator.geolocation.getCurrentPosition(
        position => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          getWeatherData(latitude, longitude);
        },
        error => console.error(error),
        { enableHighAccuracy: true }
      );
    };
   

    if (!city) {
      getCurrentLocation();
    } else {
      const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => setForecast(data));
    }
  }, [apiKey, city]);

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return `${hours}:${minutes}`;
  };

  return (
    <div className="weather-forecast-container" >
      <AppBar>
            <Toolbar>
            
              <Typography variant='h4'> <CloudIcon /> Weather </Typography> 
            </Toolbar>
          </AppBar>
          
      {!forecast && (
        <div className="weather-search-container">
          
          <form onSubmit={handleSubmit}>
            {/* <input type="text" className='searchbar' name="city" placeholder="Enter a city name" /> */}

            <TextField  type="text" name='city'  label="City Name" variant='filled' size="small"  />

            {/* <button type="submit">Search</button> */}

            <Button type="submit" variant="contained">search</Button>
          </form>
        </div>
      )}
       {forecast && (
        
        <div className="weather-data-container">
          
          <div className='forecast-search-bar'>
              <form onSubmit={handleSubmit}>
                {/* <input type="text" name="city" placeholder="Enter a city name" /> */}

                <TextField  type="text" name='city' label="City Name" variant='outlined' size='small' style={{backgroundColor:"white"}}/>

                {/* <button type="submit">Search</button> */}

                <Button type="submit" variant="contained">search</Button>
                
                <h1 >Forecast for {city || 'your current location'} < PlaceIcon/></h1>
              </form>
          </div>
          {
            isloading
          }
          
		  <div className="weather-items-container">
            {forecast.list.filter(item => item.dt_txt.includes('18')).map((item, index) => {
              const time=getCurrentTime();
              const date = new Date(item.dt_txt);
              const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
              const day = date.getDate();
              const month = date.toLocaleDateString('en-US', { month: 'long' });    
              
			  return (
                <div key={index} className="weather-item">
                 <br /> <strong> <TodayIcon/>{weekday}, {month} {day} </strong> <br />
                  <strong><AccessTimeIcon/> {time}</strong>
                  <img src={`http://openweathermap.org/img/w/${item.weather[0].icon}.png`} alt=" " /> 
                  <strong style={{"color":"Black", fontStyle:'oblique'}} > <DescriptionIcon/> {item.weather[0].description} </strong>
                    <p> <ThermostatIcon /> Temp: {Math.round(item.main.temp)}&deg;C</p>
                    <p> <WaterIcon /> Humidity: {item.main.humidity}%</p>
                    <p> <AirIcon/> Wind-Speed: {item.wind.speed} km/h</p>
                    <br />
                </div>
              );
            })}
          </div>

        </div>
      )}
    </div>

  );
};

export default App;



