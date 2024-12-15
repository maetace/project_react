import axios from 'axios';

const BASE_URL = 'https://restcountries.com/v3.1';

export const getCountries = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/all`);
    return response.data.map((country) => ({
      name: country.name.common, // ชื่อประเทศ
      region: country.region, // ทวีป
      capital: country.capital || [''], // เมืองหลวง
    }));
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw error;
  }
};