import request from 'configs/request';

export function getTransportCompany(params) {
  return request('/transportCompany', { method: 'GET', params });
}
