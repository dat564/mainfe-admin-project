import request from 'configs/request';
import { ROLES } from 'constants';

export function getUserList(params) {
  return request('/user', {
    method: 'GET',
    params,
  });
}

export function createUser(data) {
  return request('/user/store', {
    method: 'POST',
    data
  });
}

export function updateUser(data) {
  return request(`/user/update`, {
    method: 'POST',
    data
  });
}

export function multipleDeleteUserById(data) {
  return request('/user/destroy', {
    method: 'POST',
    data
  });
}

export function getDriverList(params) {
  return request('/user', {
    method: 'GET',
    params: {
      ...params,
      role: ROLES.DRIVER
    }
  });
}
