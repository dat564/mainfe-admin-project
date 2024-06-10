export const STATUS_ARR = [
  { label: 'Attend', value: 0 },
  { label: 'Dropout', value: 1 },
  { label: 'Graduated', value: 3 },
  { label: 'Skip', value: 4 }
];

export const NOTIFY_MESSAGE = {
  ADD_SUCCESS: 'New record added successfully',
  UPDATE_SUCCESS: 'Update was successful.',
  DELETE_SUCCESS: 'Record has been removed successfully.',
  GENERAL_SUCCESS: 'Your request was successful',
  ADD_ERROR: 'Error occurred while adding a new record.',
  UPDATE_ERROR: 'Update failed. Please check your input.',
  DELETE_ERROR: 'Deletion was unsuccessful. Please try again.',
  GENERAL_ERROR: 'Sorry, something went wrong. Please try again.'
};

export const GENDER_OPTIONS = [
  {
    label: 'Nam',
    value: 0
  },
  {
    label: 'Nữ',
    value: 1
  },
  {
    label: 'Khác',
    value: 2
  }
];

export const GENDER_LABEL = {
  0: 'Nam',
  1: 'Nữ',
  2: 'Khác'
};
