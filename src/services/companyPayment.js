import request from 'configs/request';

export function getCompanyPaymentList(params) {
  return request('/transportCompanyPayment', {
    method: 'GET',
    params
  });
}

export function createCompanyPayment(data) {
  return request('/transportCompanyPayment/store', {
    method: 'POST',
    data
  });
}

export function updateCompanyPayment(data) {
  return request('/transportCompanyPayment/update', {
    method: 'POST',
    data
  });
}

export function multiDeleteCompanyPayment(data) {
  return request('/transportCompanyPayment/destroy', {
    method: 'POST',
    data
  });
}
