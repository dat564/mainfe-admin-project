import request from 'configs/request';

export function getTransportCompany(params) {
  return request('/transportCompany', { method: 'GET', params });
}

export function multiDeleteTransportCompany(ids) {
  return request('/transportCompany/destroy', { method: 'POST', data: { ids } });
}

export function updateTransportCompany(data) {
  return request('/transportCompany/update', { method: 'POST', data });
}
