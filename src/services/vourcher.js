import request from 'configs/request';

export function getVoucherList(params) {
  return request('/voucherCenter', {
    method: 'GET',
    params
  });
}

export function createVouchers(data) {
  return request('/voucherCenter/store', {
    method: 'POST',
    data
  });
}

export function updateVouchers(data) {
  return request('/voucherCenter/update', {
    method: 'POST',
    data
  });
}

export function multiDeleteVoucher(data) {
  return request(`/voucherCenter/destroy`, {
    method: 'POST',
    data
  });
}
