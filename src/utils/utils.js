import moment from "moment";

export function formatCurrency(amount) {
  return Number(amount).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}

export const formatMoney = (price, locale) =>
  new Intl.NumberFormat(locale).format(price);

export function converNumberToWords(number) {
  const units = [
    "",
    "một",
    "hai",
    "ba",
    "bốn",
    "năm",
    "sáu",
    "bảy",
    "tám",
    "chín",
  ];
  const placeValue = [
    "",
    "ngàn",
    "triệu",
    "tỷ",
    "ngàn tỷ",
    "triệu tỷ",
    "tỷ tỷ",
  ];

  function convertLessThanThousand(_number) {
    let result = "";

    const hundreds = Math.floor(_number / 100);
    const tens = Math.floor((_number % 100) / 10);
    const ones = _number % 10;

    if (hundreds > 0) {
      result += `${units[hundreds]} trăm `;
    }

    if (tens === 1) {
      if (ones === 5) {
        result += "mười lăm";
      } else if (ones === 0) {
        result += "mười";
      } else {
        result += `mười ${units[ones]}`;
      }
    } else {
      if (tens > 1) {
        result += `${units[tens]} mươi `;
      }

      if (ones === 1 && tens === 0) {
        result += "một";
      } else if (ones === 1 && tens > 0) {
        result += "mốt";
      } else if (ones > 0) {
        result += units[ones];
      }
    }

    return result;
  }

  if (number === 0) {
    return "không";
  }

  let words = "";
  let i = 0;

  do {
    const chunk = number % 1000;
    if (chunk !== 0) {
      const chunkWords = convertLessThanThousand(chunk);
      words = `${chunkWords} ${placeValue[i]} ${words}`;
    }
    number = Math.floor(number / 1000);
    i++;
  } while (number > 0);

  // Viết hoa chữ cái đầu trong chuỗi
  const arrWords = words.split(" ");
  arrWords[0] = arrWords[0].charAt(0).toUpperCase() + arrWords[0].slice(1);
  words = arrWords.join(" ");

  return words.trim() + " đồng";
}

export const commonRegexes = {
  affirmative: /^(?:1|t(?:rue)?|y(?:es)?|ok(?:ay)?)$/,
  alphaNumeric: /^[A-Za-z0-9]+$/,
  caPostalCode: /^(?!.*[DFIOQU])[A-VXY][0-9][A-Z]\s?[0-9][A-Z][0-9]$/,
  creditCard:
    /^(?:(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$/,
  dateString:
    /^(1[0-2]|0?[1-9])([\/-])(3[01]|[12][0-9]|0?[1-9])(?:\2)(?:[0-9]{2})?[0-9]{2}$/,
  email:
    /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i, // eslint-disable-line no-control-regex
  eppPhone: /^\+[0-9]{1,3}\.[0-9]{4,14}(?:x.+)?$/,
  hexadecimal: /^(?:0x)?[0-9a-fA-F]+$/,
  hexColor: /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
  ipv4: /^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/,
  ipv6: /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i,
  nanpPhone: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
  socialSecurityNumber:
    /^(?!000|666)[0-8][0-9]{2}-?(?!00)[0-9]{2}-?(?!0000)[0-9]{4}$/,
  timeString: /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/,
  ukPostCode:
    /^[A-Z]{1,2}[0-9RCHNQ][0-9A-Z]?\s?[0-9][ABD-HJLNP-UW-Z]{2}$|^[A-Z]{2}-?[0-9]{4}$/,
  url: /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/i,
  usZipCode: /^[0-9]{5}(?:-[0-9]{4})?$/,
  http: /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/,
  tiengViet:
    /^([A-Za-z0-9aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ]+[\s]*)+$/g,
  password: /^[\w\d]{5,}$/g,
  tiengVietDacBiet:
    /^([A-Za-z0-9aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ#+\-&]+[\s]*)+$/g,
  number: /^([-]?[1-9][0-9]*|0)$/g,
};

export const validateConstant = {
  required: {
    required: true,
    message: "Please enter this field",
  },
  tiengViet: {
    pattern: commonRegexes.tiengViet,
    message: "Không chứa ký tự đặc biệt và ô trống ở đầu",
  },
  password: {
    pattern: commonRegexes.password,
    message: "Mật khẩu tối thiểu 5 kí tự và không chứa kí tự đặc biệt",
  },
  email: {
    pattern: commonRegexes.email,
    message: "Email invalid",
  },
  tiengVietDacBiet: {
    pattern: commonRegexes.tiengVietDacBiet,
    message: "Không chứa ký tự quá đặc biệt bị cấm",
  },
  numberTextOnly: {
    pattern: /^([0-9]*)$/g,
    message: "Vui lòng nhập số",
  },
  numberOnly: {
    type: "number",
    message: "Vui lòng nhập số",
  },
  numberOnlyNotZero: {
    type: "number",
    min: 1,
    message: "Vui lòng nhập số lớn hơn 0",
  },
};

export const buildValidate = (validateData) => {
  if (!Array.isArray(validateData)) return [];
  if (!validateData.length) return [];

  const validateArray = [];

  for (let i = 0, n = validateData.length; i < n; i++) {
    const validate = validateData[i];

    if (!validate) continue;

    if (typeof validate === "string") {
      const validateValue = validateConstant[validate];

      if (validateValue) {
        validateArray.push(validateValue);
      } else {
        console.warn("Validate not found", validate);
      }

      continue;
    }

    if (typeof validate === "object" && validate._customType) {
      const validateType = validate._customType;

      const validateValue = validateConstant[validateType];

      if (validateValue) {
        const customValidateValue = {
          ...validateValue,
          ...validate,
        };
        validateArray.push(customValidateValue);
      } else {
        console.warn("Custom validate type not found", validate);
      }

      continue;
    }

    if (typeof validate === "object" && !validate._customType) {
      validateArray.push(validate);

      continue;
    }

    if (typeof validate === "function") {
      validateArray.push(validate);

      continue;
    }
  }

  return validateArray;
};

export function formatNumberToFixed(number) {
  let formattedNumber = Number(number).toFixed(1);

  return formattedNumber;
}

export function formatTime(timeString) {
  return moment(timeString).format("DD/MM/YYYY HH:MM:SS");
}
