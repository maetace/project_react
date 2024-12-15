import React, { useState, useEffect, useMemo } from 'react';
import { Select, Typography, Card, Spin, Alert, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getCountries } from '../services/continentService';
import { getWeatherByCity } from '../services/weatherService';

const { Option } = Select;
const { Title } = Typography;

const Weather = () => {
  const navigate = useNavigate();

  const [countries, setCountries] = useState([]);
  const [continents, setContinents] = useState([]);
  const [selectedContinent, setSelectedContinent] = useState('Asia'); // Default: Asia
  const [selectedCountry, setSelectedCountry] = useState('Thailand'); // Default: Thailand
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('Bangkok'); // Default: Bangkok
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [error, setError] = useState(null);

  // ดึงข้อมูลทวีปและประเทศ
  useEffect(() => {
    setLoadingCountries(true);
    getCountries()
      .then((data) => {
        const uniqueContinents = [...new Set(data.map((c) => c.region).filter(Boolean))].sort();
        setContinents(uniqueContinents);
        setCountries(data);
        setLoadingCountries(false);
      })
      .catch(() => {
        setError('Could not fetch countries data. Please try again.');
        setLoadingCountries(false);
      });
  }, []);

  // คำนวณประเทศที่ถูกคัดกรองตามทวีป
  const filteredCountries = useMemo(() => {
    return countries
      .filter((country) => country.region === selectedContinent)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [countries, selectedContinent]);

  // โหลดเมืองหลวงและดึงข้อมูลเริ่มต้น
  useEffect(() => {
    if (selectedCountry) {
      const country = countries.find((c) => c.name === selectedCountry);
      setCities(country?.capital || []);
    }
  }, [countries, selectedCountry]);

  // โหลดข้อมูลสภาพอากาศเริ่มต้น
  useEffect(() => {
    if (selectedCity) {
      setLoading(true);
      setError(null);
      getWeatherByCity(selectedCity)
        .then((data) => {
          setWeather({
            temp: data.main.temp.toFixed(1),
            description: data.weather[0].description,
            icon: data.weather[0].icon,
          });
          setLoading(false);
        })
        .catch(() => {
          setError('Could not fetch weather data. Please try again.');
          setLoading(false);
        });
    }
  }, [selectedCity]);

  return (
    <div style={{ fontFamily: 'Prompt', textAlign: 'center', padding: '20px' }}>
      <Title level={2}>Weather by Location</Title>

      {/* ปุ่มย้อนกลับ */}
      <Button
        type="primary"
        onClick={() => navigate('/')}
        style={{ marginBottom: '20px' }}
      >
        Back to Home
      </Button>

      {/* Dropdown เลือกทวีป */}
      <div style={{ marginBottom: '20px' }}>
        <Select
          placeholder="Select a Continent"
          style={{ width: '100%', maxWidth: 300 }}
          value={selectedContinent}
          onChange={(value) => {
            setSelectedContinent(value);
            setSelectedCountry('');
            setSelectedCity('');
            setWeather(null);
          }}
        >
          {continents.map((continent) => (
            <Option key={continent} value={continent}>
              {continent}
            </Option>
          ))}
        </Select>
      </div>

      {/* Dropdown เลือกประเทศ */}
      <div style={{ marginBottom: '20px' }}>
        <Select
          placeholder="Select a Country"
          style={{ width: 300 }}
          value={selectedCountry}
          onChange={(value) => {
            setSelectedCountry(value);
            setSelectedCity('');
            setWeather(null);
          }}
        >
          {filteredCountries.map((country) => (
            <Option key={country.name} value={country.name}>
              {country.name}
            </Option>
          ))}
        </Select>
      </div>

      {/* Dropdown เลือกเมือง */}
      <div style={{ marginBottom: '20px' }}>
        <Select
          placeholder="Select a City"
          style={{ width: 300 }}
          value={selectedCity}
          onChange={(value) => setSelectedCity(value)}
        >
          {cities.map((city) => (
            <Option key={city} value={city}>
              {city}
            </Option>
          ))}
        </Select>
      </div>

      {/* แสดงผลข้อมูลสภาพอากาศ */}
      {loading ? (
        <Spin size="large" />
      ) : error ? (
        <Alert message={error} type="error" showIcon />
      ) : weather ? (
        <Card
          title={`Weather in ${selectedCity}`}
          style={{ width: 300, margin: '0 auto' }}
          cover={
            weather.icon && (
              <img
                alt="Weather Icon"
                src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              />
            )
          }
        >
          <p>Temperature: {weather.temp}°C</p>
          <p>Description: {weather.description}</p>
        </Card>
      ) : null}
    </div>
  );
};

export default Weather;