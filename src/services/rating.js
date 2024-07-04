import request from 'configs/request';

export function getRatingList(params) {
  return request('/rating', {
    method: 'GET',
    params
  });
}
