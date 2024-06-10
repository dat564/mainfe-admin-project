import request from 'configs/request';

export function getPaymentList(params) {
  return request('/payment', {
    method: 'GET',
    params
  });
}

export function createPayment(data) {
  return request('/payment/store', {
    method: 'POST',
    data
  });
}

export function updatePayment(data) {
  return request('/payment/update', {
    method: 'POST',
    data
  });
}

export function multiDeletePayment(data) {
  return request('/payment/destroy', {
    method: 'POST',
    data
  });
}
