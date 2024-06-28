export const TICKET_STATUS = {
  EMPTY: 0, // Trống
  RESERVED: 1, // Đang đặt
  PAID: 2 // Đã thanh toán
};

export const TICKET_STATUS_OPTIONS = [
  {
    label: 'Trống',
    value: TICKET_STATUS.EMPTY
  },
  {
    label: 'Đang đặt',
    value: TICKET_STATUS.RESERVED
  },
  {
    label: 'Đã thanh toán',
    value: TICKET_STATUS.PAID
  }
];
