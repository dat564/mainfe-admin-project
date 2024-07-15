import request from 'configs/request';

export const getBreakpointList = async (params) => {
  return request('/breakpoint', { method: 'GET', params });
};

export const createBreakpoint = async (data) => {
  return request('/breakpoint/store', { method: 'POST', data });
};

export const updateBreakpoint = async (data) => {
  return request('/breakpoint/update', { method: 'POST', data });
};

export const multiDeleteBreakpoint = async (data) => {
  return request('/breakpoint/destroy', { method: 'POST', data });
};
