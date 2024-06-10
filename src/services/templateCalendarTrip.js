import request from 'configs/request';

export function getTemplateCalendarTripList(params) {
  return request('/templateCalendarTrip', {
    method: 'GET',
    params
  });
}

export function createTemplateCalendarTrip(data) {
  return request('/templateCalendarTrip/store', {
    method: 'POST',
    data
  });
}

export function updateTemplateCalendarTrip(data) {
  return request('/templateCalendarTrip/update', {
    method: 'POST',
    data
  });
}

export function multiDeleteTemplateCalendarTrip(data) {
  return request('/templateCalendarTrip/destroy', {
    method: 'POST',
    data
  });
}
