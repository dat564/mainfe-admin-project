import request from 'configs/request';

export function uploadImage(data) {
  return request('/image', {
    method: 'POST',
    data
  });
}

export function replaceImage(image_name, data) {
  return request(`/img/replace/${image_name}`, { method: 'POST', data });
}

export function deleteImage(image_name) {
  return request(`/img/delete/${image_name}`, { method: 'DELETE' });
}
