import request from 'configs/request';

export function getCalendarTripList(params) {
  return request('/calendarTrip', {
    method: 'GET',
    params
  });
}

export function createCalendarTrip(data) {
  return request('/calendarTrip/store', {
    method: 'POST',
    data
  });
}

export function updateCalendarTrip(data) {
  return request('/calendarTrip/update', {
    method: 'POST',
    data
  });
}

export function multiDeleteCalendarTrip(data) {
  return request('/calendarTrip/destroy', {
    method: 'POST',
    data
  });
}
