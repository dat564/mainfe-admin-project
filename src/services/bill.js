import request from 'configs/request';

export const getBillList = (params) => {
  return request('/bill', { method: 'GET', params });
};

export const updateBill = (data) => {
  return request('/bill/update', { method: 'POST', data });
};

export const multiDeleteBill = (data) => {
  return request('/bill/destroy', { method: 'POST', data });
};

export const createBill = (data) => {
  return request('/bill/store', { method: 'POST', data });
};
