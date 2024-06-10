import request from 'configs/request';

export function getUserList(params) {
  return request('/user', {
    method: 'GET',
    params
  });
}

export function getUserById(id) {
  return request(`/user/${id}`, {
    method: 'GET'
  });
}

export function createUser(data) {
  return request('/user/store', {
    method: 'POST',
    data
  });
}

export function updateUser(id, data) {
  return request(`/user/update/${id}`, {
    method: 'PUT',
    data
  });
}

export function multipleDeleteUserById(data) {
  return request('/user/destroy', {
    method: 'POST',
    data
  });
}
