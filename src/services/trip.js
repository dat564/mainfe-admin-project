import request from 'configs/request';

export const getTripList = (params) => {
  return request('/trip', {
    method: 'GET',
    params
  });
};

export const createTrip = (data) => {
  return request('/trip/store', {
    method: 'POST',
    data
  });
};

export const updateTrip = (data) => {
  return request(`/trip/update`, {
    method: 'POST',
    data
  });
};

export const multiDeleteTrip = (data) => {
  return request(`/trip/destroy`, {
    method: 'POST',
    data
  });
};

export const getTripProfit = (params) => {
  return request(`/trip/profit`, {
    method: 'GET',
    params
  });
};
