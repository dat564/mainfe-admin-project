import request from 'configs/request';

export function getRatingList(params) {
  return request('/billEvaluation', {
    method: 'GET',
    params
  });
}
