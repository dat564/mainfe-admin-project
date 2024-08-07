import dayjs from 'dayjs';
import moment from 'moment';
import momentTimezon from 'moment-timezone';

export function convertDatetime(inputStr) {
  if (!inputStr) return;
  // Sử dụng Moment.js để phân tích chuỗi đầu vào
  var momentObj = moment(inputStr, 'YYYY-MM-DD HH:mm:ss');

  // Thêm 7 giờ vào thời gian
  momentObj.add(7, 'hours');

  return momentObj;
}

// export function convertDatetimeByDayjs(inputStr) {
//   if (!inputStr) return;

//   // Sử dụng dayjs để phân tích chuỗi đầu vào
//   var dayjsObj = dayjs(inputStr, 'YYYY-MM-DD HH:mm:ss');

//   // Thêm 7 giờ vào thời gian
//   dayjsObj = dayjsObj.add(7, 'hour');

//   return dayjsObj;
// }

export function convertDateAndFormat(inputStr, format = 'DD/MM/YYYY HH:mm:ss') {
  if (!inputStr) return;
  // Sử dụng Moment.js để phân tích chuỗi đầu vào
  var momentObj = moment(inputStr, 'YYYY-MM-DD HH:mm:ss');

  // Thêm 7 giờ vào thời gian
  momentObj.add(7, 'hours');

  return momentObj.format(format);
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

export function convertDateToServer(inputStr) {
  if (!inputStr) return;
  // Sử dụng Moment.js để phân tích chuỗi đầu vào
  var momentObj = moment(inputStr, 'DD/MM/YYYY');

  // Chuyển đổi đối tượng Moment trở lại chuỗi với định dạng mong muốn
  var outputStr = momentObj.format('YYYY-MM-DD');

  return outputStr;
}

export function convertDatetimeOfDayjsToServer(dateString) {
  // dùng dayjs trừ 7 đi
  return dayjs(dateString).subtract(7, 'hours').format('YYYY-MM-DD HH:mm:ss');
}

export function convertDatetimeByDayjs(inputStr, format = 'DD/MM/YYYY HH:mm:ss') {
  if (!inputStr) return;
  const timeZone = 'Asia/Bangkok';
  if (!dayjs(inputStr).isValid()) {
    return inputStr;
  }

  return momentTimezon(inputStr).tz(timeZone).format(format);
}
