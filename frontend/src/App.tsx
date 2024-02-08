import React, { useState, useEffect } from 'react';
import './App.css'
import axios from 'axios';
import Search from './assets/search.svg'

interface WeatherData {
  temperature: number;
  minTemperature: number;
  maxTemperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
}

interface DailyForecast {
  dayOfWeek: string;
  minTemperature: number;
  maxTemperature: number;
  description: string;
}

interface CityWeatherData {
  cityName: string;
  weatherData: WeatherData | null;
}

const WeatherForecast: React.FC = () => {
  const cities = [
    'Rio de Janeiro',
    'São Paulo',
    'Belo Horizonte',
    'Brasília',
    'Porto Alegre',
    'Salvador',
    'Curitiba',
    'Fortaleza',
    'Manaus',
    'João Pessoa'
  ];
  

  const [cityWeatherData, setCityWeatherData] = useState<CityWeatherData[]>([]);
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [dailyForecast, setDailyForecast] = useState<DailyForecast[] | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchWeatherData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=2844d4d1a0b43a667a236ae0e2c40213&units=metric`);
      const forecastResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=2844d4d1a0b43a667a236ae0e2c40213&units=metric`);

      const { main, weather, wind } = response.data;
      setWeatherData({
        temperature: main.temp,
        minTemperature: main.temp_min,
        maxTemperature: main.temp_max,
        feelsLike: main.feels_like,
        humidity: main.humidity,
        windSpeed: wind.speed,
        description: weather[0].description
      });

      const dailyForecastData: DailyForecast[] = [];
      forecastResponse.data.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000);
        const dayOfWeek = date.toLocaleDateString('pt-br', { weekday: 'long' });
        const temperature = item.main.temp;
        const description = item.weather[0].description;
        if (!dailyForecastData.some(forecast => forecast.dayOfWeek === dayOfWeek)) {
          dailyForecastData.push({
            dayOfWeek,
            minTemperature: temperature,
            maxTemperature: temperature,
            description
          });
          
        } else {
          const index = dailyForecastData.findIndex(forecast => forecast.dayOfWeek === dayOfWeek);
          if (temperature < dailyForecastData[index].minTemperature) {
            dailyForecastData[index].minTemperature = temperature;
          }
          if (temperature > dailyForecastData[index].maxTemperature) {
            dailyForecastData[index].maxTemperature = temperature;
          }
        }
      });
      setDailyForecast(dailyForecastData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setLoading(false);
    }
    
  };

  useEffect(() => {
    if (city) {
      fetchWeatherData();
    }
  }, [city]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const promises = cities.map(async (city) => {
        try {
          const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=2844d4d1a0b43a667a236ae0e2c40213&units=metric`);
          const { main, weather } = response.data;
          return {
            cityName: city,
            weatherData: {
              temperature: main.temp,
              minTemperature: main.temp_min,
              maxTemperature: main.temp_max,
              feelsLike: main.feels_like,
              humidity: main.humidity,
              windSpeed: response.data.wind.speed,
              description: weather[0].description
            }
          };
        } catch (error) {
          console.error('Error fetching weather data:', error);
          return {
            cityName: city,
            weatherData: null
          };
        }
      });
      const cityWeatherData = await Promise.all(promises);
      setCityWeatherData(cityWeatherData);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    if (city) {
      fetchWeatherData();
    }
  };

  return (
    <div>
      <h1>Previsão do Tempo</h1>
      <div className='input-container'>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Digite o nome da cidade"
        />
        <button onClick={handleSearch}>
          <img src={Search}/>
        </button>
      </div>
      {loading ? (
        <p>Carregando...</p>
      ) : weatherData && dailyForecast ? (
        <div>
          <h2>Current Weather</h2>
          <p>Temperatura: {weatherData.temperature}°C</p>
          <p>Min Temperature: {weatherData.minTemperature}°C</p>
          <p>Max Temperature: {weatherData.maxTemperature}°C</p>
          <p>Sensação: {weatherData.feelsLike}°C</p>
          <p>Humidade: {weatherData.humidity}%</p>
          <p>Vento: {weatherData.windSpeed} m/s</p>
          <p>Description: {weatherData.description}</p>
          <h2>Previsão da semana</h2>
          <ul>
            {dailyForecast.map((forecast, index) => (
              <li key={index}>
                <p>Day: {forecast.dayOfWeek}</p>
                <p>Min Temperature: {forecast.minTemperature}°C</p>
                <p>Max Temperature: {forecast.maxTemperature}°C</p>
                <p>Description: {forecast.description}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Sem dados disponíves. Por favor, pesquise pela cidade desejada!</p>
      )}

      <div className='capitals-container'>
        <h2>Capitais</h2>
        <table>
          <thead>
            <tr>
              <th>Min</th>
              <th>Máx</th>
            </tr>
          </thead>
          <tbody>
            {cityWeatherData.map((cityData, index) => (
              <tr key={index}>
                {cityData.weatherData ? (
                  <>
                    <td>{Math.round(cityData.weatherData.minTemperature)}</td>
                    <td>{Math.round(cityData.weatherData.maxTemperature)}</td>
                  </>
                ) : (
                  <td colSpan={2}>Não disponível</td>
                )}
                <td>{cityData.cityName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeatherForecast;
