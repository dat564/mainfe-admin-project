import request from 'configs/request';

export const getReconciledList = async (params) => {
  return request({
    url: '/reconciliationCompany',
    method: 'GET',
    params
  });
};

export const createReconciled = async (data) => {
  return request({
    url: '/reconciliationCompany/store',
    method: 'POST',
    data
  });
};

export const getDetailReconciled = async (params) => {
  return request({
    url: `/reconciliationCompany/detail`,
    method: 'GET',
    params
  });
};
