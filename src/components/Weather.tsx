import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCity,
  setTemperature,
  setHumidity,
  setWindSpeed,
  toggleUnit,
  selectWeather,
} from '../features/weather/weatherSlice';

const Weather: React.FC = () => {
    const dispatch = useDispatch();
    const { city, temperature, humidity, windSpeed, unit } = useSelector( selectWeather );
    const [searchText, setSearchText] = useState('');

    const handleSearch = () => {
        fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchText}&appid=13cdd25b9d5681796cc24799a09298ff&units=metric`
        )
        .then((response) => response.json())
        .then((data) => {
            dispatch(setCity(data.name));
            dispatch(setTemperature(data.main.temp));
            dispatch(setHumidity(data.main.humidity));
            dispatch(setWindSpeed(data.wind.speed));
            localStorage.setItem(
            'weather',
            JSON.stringify({
                city: data.name,
                temperature: data.main.temp,
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
            })
            );
        })
        .catch((error) => console.log(error));
    
        setSearchText('');
    };
  
    const handleUnitToggle = () => {
        dispatch(toggleUnit());
    };

    React.useEffect(() => {
        const savedWeather = localStorage.getItem('weather');
        if (savedWeather) {
          const { city, temperature, humidity, windSpeed } = JSON.parse(
            savedWeather
          );
          dispatch(setCity(city));
          dispatch(setTemperature(temperature));
          dispatch(setHumidity(humidity));
          dispatch(setWindSpeed(windSpeed));
        }
    }, [dispatch]);
      

    return (

    <div>
        <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
        <button onClick={handleSearch}>Search</button>
        <div>
        <div>City: {city}</div>
        <div>
            Temperature:{' '}
            {unit === 'C'
            ? `${temperature} °C`
            : `${(temperature * 9) / 5 + 32} °F`}
        </div>
        <div>Humidity: {humidity}%</div>
        <div>Wind speed: {windSpeed} miles per hour</div>
        <button onClick={handleUnitToggle}>
            Switch to {unit === 'C' ? 'Fahrenheit' : 'Celsius'}
        </button>
        </div>
    </div>
    );
};
export default Weather;