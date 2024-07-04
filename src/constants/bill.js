// public const WAIT_FOT_PAY = 0;
// public const PAYMENT_SUCCESS = 1;
// public const CANCELED = 2;

export const BILL_STATUS = {
  WAIT_FOT_PAY: 0,
  PAYMENT_SUCCESS: 1,
  CANCELED: 2
};

export const billLabel = {
  [BILL_STATUS.WAIT_FOT_PAY]: 'Chờ thanh toán',
  [BILL_STATUS.PAYMENT_SUCCESS]: 'Thanh toán thành công',
  [BILL_STATUS.CANCELED]: 'Đã hủy'
};
