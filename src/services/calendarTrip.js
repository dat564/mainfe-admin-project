import request from 'configs/request';

export function getCalendarTripList(params) {
  return request('/calenderTrip', {
    method: 'GET',
    params
  });
}

export function createCalendarTrip(data) {
  return request('/calenderTrip/store', {
    method: 'POST',
    data
  });
}

export function updateCalendarTrip(data) {
  return request('/calenderTrip/update', {
    method: 'POST',
    data
  });
}

export function multiDeleteCalendarTrip(data) {
  return request('/calenderTrip/destroy', {
    method: 'POST',
    data
  });
}
