import request from 'configs/request';

export function getCarList(params) {
  return request('/transportCompanyCar', {
    method: 'GET',
    params
  });
}

export function createCar(data) {
  return request('/transportCompanyCar/store', {
    method: 'POST',
    data
  });
}

export function updateCar(data) {
  return request('/transportCompanyCar/update', {
    method: 'POST',
    data
  });
}

export function deleteCar(data) {
  return request(`/transportCompanyCar/destroy`, {
    method: 'POST',
    data
  });
}
