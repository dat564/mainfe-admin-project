import request from 'configs/request';

export function getTicketList(params) {
  return request('/ticket', {
    method: 'GET',
    params
  });
}

export function createTicket(data) {
  return request('/ticket/store', {
    method: 'POST',
    data
  });
}

export function updateTicket(data) {
  return request('/ticket/update', {
    method: 'POST',
    data
  });
}

export function multiDeleteTicket(data) {
  return request(`/ticket/destroy`, {
    method: 'POST',
    data
  });
}
