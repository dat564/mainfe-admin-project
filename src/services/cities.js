import axios from 'axios';

export const getCityList = async () => {
  return await axios.get('https://vapi.vnappmob.com/api/province/', {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const getDistrictList = async (provinceId) => {
  return await axios.get(`https://vapi.vnappmob.com/api/province/district/${provinceId}`);
};

export const getWardList = async (districtId) => {
  return await axios.get(`https://vapi.vnappmob.com/api/province/ward/${districtId}`);
};
