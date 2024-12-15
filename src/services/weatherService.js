import axios from 'axios';

const API_KEY = '3e6b1cd5ebe5ceac06ae1fd8b649e3a3';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const TIMEOUT = 5000; // 5 วินาที

export const getWeatherByCity = async (city) => {
  if (!API_KEY) {
    throw new Error('API Key is missing. Please provide a valid API Key.');
  }

  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric', // ใช้ Celsius
      },
      timeout: TIMEOUT, // กำหนด timeout
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('API Error:', error.response.data.message || error.response.status);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    throw error;
  }
};