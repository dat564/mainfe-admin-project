import request from 'configs/request';

export function getTemplateCalendarTripList(params) {
  return request('/templateTrip', {
    method: 'GET',
    params
  });
}

export function createTemplateCalendarTrip(data) {
  return request('/templateTrip/store', {
    method: 'POST',
    data
  });
}

export function updateTemplateCalendarTrip(data) {
  return request('/templateTrip/update', {
    method: 'POST',
    data
  });
}

export function multiDeleteTemplateCalendarTrip(data) {
  return request('/templateTrip/destroy', {
    method: 'POST',
    data
  });
}
