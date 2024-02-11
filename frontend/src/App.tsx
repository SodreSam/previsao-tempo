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
  
const translateDescription = (description: string): string => {
  const weatherDescriptions: { [key: string]: string } = {
    'clear sky': 'Céu limpo',
    'few clouds': 'Poucas nuvens',
    'scattered clouds': 'Nuvens esparsas',
    'broken clouds': 'Nuvens dispersas',
    'light rain': 'Chuva fraca',
    'rain': 'Chuva',
    'thunderstorm': 'Tempestade',
    'snow': 'Neve',
    'mist': 'Nevoeiro',
    'wind': 'Vento forte',
    'overcast clouds': 'Nublado',
    'moderate rain': 'Chuva moderada'
  };
  return weatherDescriptions[description] || 'Descrição não disponível';
};

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
  const [loading, setLoading] = useState(true);
  const splitIndex = Math.ceil(cityWeatherData.length / 2);
  const firstHalfCities = cityWeatherData.slice(0, splitIndex);
  const secondHalfCities = cityWeatherData.slice(splitIndex);

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
        const description = translateDescription(item.weather[0].description);
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
          <h2>Clima Atual</h2>
          <p>Temperatura: {Math.round(weatherData.temperature)}°C</p>
          <p>Temperatura Mínima: {Math.round(weatherData.minTemperature)}°C</p>
          <p>Temperatura Máxima: {Math.round(weatherData.maxTemperature)}°C</p>
          <p>Sensação: {Math.round(weatherData.feelsLike)}°C</p>
          <p>Humidade: {weatherData.humidity}%</p>
          <p>Vento: {Math.round(weatherData.windSpeed)} m/s</p>
          <p>Descrição: {translateDescription(weatherData.description)}</p>
          <h2>Previsão da semana</h2>
          <ul>
            {dailyForecast.map((forecast, index) => (
              <li key={index}>
                <p>Dia: {forecast.dayOfWeek}</p>
                <p>Temperatura Mínima: {Math.round(forecast.minTemperature)}°C</p>
                <p>Temperatura Máxima: {Math.round(forecast.maxTemperature)}°C</p>
                <p>Descrição: {forecast.description}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Sem dados disponíves. Por favor, pesquise pela cidade desejada!</p>
      )}

      <div className='capitals-container'>
        <h2>Capitais</h2>
        <div className='table-container'>
          <table className='half-table'>
            <thead>
              <tr>
                <th>Min</th>
                <th>Máx</th>
              </tr>
            </thead>
            <tbody>
              {firstHalfCities.map((cityData, index) => (
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
          <table className='half-table'>
            <thead>
              <tr>
                <th>Min</th>
                <th>Máx</th>
              </tr>
            </thead>
            <tbody>
              {secondHalfCities.map((cityData, index) => (
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
    </div>
  );
};

export default WeatherForecast;
