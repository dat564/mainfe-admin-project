import moment from 'moment';

export function convertDatetime(inputStr) {
  if (!inputStr) return;
  // Sử dụng Moment.js để phân tích chuỗi đầu vào
  var momentObj = moment(inputStr, 'YYYY-MM-DD HH:mm:ss');

  // Thêm 7 giờ vào thời gian
  momentObj.add(7, 'hours');

  // Chuyển đổi đối tượng Moment trở lại chuỗi với định dạng mong muốn
  var outputStr = momentObj.format('DD/MM/YYYY HH:mm:ss');

  return outputStr;
}

export function convertDatetimeToServer(inputStr) {
  if (!inputStr) return;
  // Sử dụng Moment.js để phân tích chuỗi đầu vào
  var momentObj = moment(inputStr, 'DD/MM/YYYY HH:mm:ss');

  // Trừ 7 giờ từ thời gian
  momentObj.subtract(7, 'hours');

  // Chuyển đổi đối tượng Moment trở lại chuỗi với định dạng mong muốn
  var outputStr = momentObj.format('YYYY-MM-DD HH:mm:ss');

  return outputStr;
}