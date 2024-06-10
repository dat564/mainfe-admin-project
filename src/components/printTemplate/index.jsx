import moment from "moment";
import React from "react";
import { converNumberToWords } from "utils/utils";
import { formatMoney } from "utils/utils";

const containerStyle = {
  fontFamily: '"Times New Roman", Times, serif',

  header: {
    marginBottom: 20,
    title: {
      margin: 0,
      fontSize: 28,
      textAlign: "center",
      textTransform: "uppercase",
    },
    timeLine: {
      position: "relative",
      fontWeight: "bold",
      fontStyle: "italic",
      fontSize: 16,

      date: {
        margin: 0,
        textAlign: "center",
      },
      interBill: {
        position: "absolute",
        top: 0,
        right: "14%",
      },
    },
  },

  content: {
    info: {
      margin: "6px 0 0",
      fontSize: 16,

      nameAndDob: {
        fontWeight: "bold",
        display: "flex",
        fullName: {
          margin: 0,
          flex: 3,
        },
        dob: {
          margin: 0,
          flex: 1,
        },
      },
      address: {
        margin: "4px 0 0",
        fontWeight: "bold",
      },
      reason: {
        margin: "4px 0 0",
      },
      major: {
        fontWeight: "bold",
        margin: "4px 0 0",
      },
    },
    tableContainer: {
      margin: "4px 0 0",
      unit: {
        fontSize: 16,
        textAlign: "right",
        margin: 0,
      },
      table: {
        width: "100%",
        borderCollapse: "collapse",
        th: {
          padding: "8px 0",
          textAlign: "center",
          fontSize: 14,
          p: {
            margin: 0,
            lineHeight: 1.6,
          },
        },
        td: {
          padding: "8px",
          textAlign: "right",
          fontSize: 16,
          fontWeight: "bold",
        },
      },
    },
    warning: {
      margin: "4px 0 0",
      fontSize: 16,
      fontStyle: "italic",
    },
    moneyByWord: {
      fontWeight: "bold",
      margin: "8px 0 0",
      fontSize: 16,
    },
    contact: {
      fontSize: 16,
      margin: "4px 0 0",
    },
  },

  footer: {
    margin: "10px 0 0",
    signature: {
      display: "flex",
      height: 180,
      item: {
        flex: 1,
        textAlign: "center",
        fontSize: 16,
        display: "flex",
        flexDirection: "column",

        title: {
          fontWeight: "bold",
          margin: 0,
        },
        note: {
          margin: 0,
          fontStyle: "italic",
        },
        createdUser: {
          marginTop: "auto",
          fontStyle: "italic",
          fontWeight: "bold",
        },
      },
    },
  },
};

const {
  header: headerStyle,
  content: contentStyle,
  footer: footerStyle,
} = containerStyle;

function PrintTemplate(props) {
  const { info } = props;

  function formatNumberToFixed(number) {
    let formattedNumber = Number(number).toFixed(1);

    return formattedNumber;
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={headerStyle.title}>Phiếu thu</h1>
        <div style={headerStyle.timeLine}>
          <p style={headerStyle.timeLine.date}>{info?.date}</p>
          <span style={headerStyle.timeLine.interBill}>Liên:</span>
        </div>
      </div>
      <div style={contentStyle}>
        <div style={contentStyle.info}>
          <div style={contentStyle.info.nameAndDob}>
            <p style={contentStyle.info.nameAndDob.fullName}>
              Họ và tên người nộp tiền: {info?.name}
            </p>
            <p style={contentStyle.info.nameAndDob.dob}>
              Ngày sinh: {moment(info?.birth_day).format("DD/MM/YYYY")}
            </p>
          </div>
          <p style={contentStyle.info.address}>Địa chỉ: {info?.address}</p>
          <p style={contentStyle.info.major}>Chuyên ngành: {info?.majorName}</p>
        </div>
        <div style={contentStyle.tableContainer}>
          <p style={contentStyle.tableContainer.unit}>Đvt: VNĐ/sv</p>
          <table style={contentStyle.tableContainer.table} border={1}>
            <thead>
              <tr>
                <th
                  style={{
                    ...contentStyle.tableContainer.table.th,
                    width: "100px",
                  }}
                >
                  <p style={contentStyle.tableContainer.table.th.p}>STT</p>
                </th>
                <th style={contentStyle.tableContainer.table.th}>
                  <p style={contentStyle.tableContainer.table.th.p}>
                    Số tiền nộp
                  </p>
                </th>
                <th style={contentStyle.tableContainer.table.th}>
                  <p style={contentStyle.tableContainer.table.th.p}>
                    Số tiền giảm
                  </p>
                </th>
                <th style={contentStyle.tableContainer.table.th}>
                  <p style={contentStyle.tableContainer.table.th.p}>Học bổng</p>
                </th>
              </tr>
            </thead>
            <tbody>
              {info?.payToTheFee &&
                info.payToTheFee.map((item, index) => {
                  return (
                    <tr key={item.id}>
                      <td style={contentStyle.tableContainer.table.td}>
                        {index + 1}
                      </td>
                      <td style={contentStyle.tableContainer.table.td}>
                        {formatMoney(formatNumberToFixed(item?.cost), "vi-VN")}
                      </td>
                      <td style={contentStyle.tableContainer.table.td}>
                        {formatMoney(
                          formatNumberToFixed(item?.exemptions),
                          "vi-VN"
                        )}
                      </td>
                      <td style={contentStyle.tableContainer.table.td}>
                        {formatMoney(
                          formatNumberToFixed(info?.scholarship),
                          "vi-VN"
                        )}
                      </td>
                    </tr>
                  );
                })}
              <tr>
                <td style={contentStyle.tableContainer.table.td}>Tổng cộng</td>
                <td style={contentStyle.tableContainer.table.td} colSpan={4}>
                  {formatMoney(formatNumberToFixed(info?.totalPrice), "vi-VN")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style={contentStyle.warning}>
          Học phí đã đóng không hoàn trả trong bất cứ trường hợp nào!
        </p>
        <p style={contentStyle.moneyByWord}>
          Viết bằng chữ:{" "}
          {converNumberToWords(Number(info?.totalPrice).toFixed(0))}.
        </p>
        <p style={contentStyle.contact}>
          Mọi thông tin chi tiết xin vui lòng liên hệ số hotline: 0243 623 1023
        </p>
      </div>

      <div style={footerStyle}>
        <div style={footerStyle.signature}>
          <div style={footerStyle.signature.item}>
            <p style={footerStyle.signature.item.title}>Giám đốc</p>
            <p style={footerStyle.signature.item.note}>
              (Ký, họ tên, đóng dấu)
            </p>
          </div>
          <div style={footerStyle.signature.item}>
            <p style={footerStyle.signature.item.title}>Kế toán trưởng</p>
            <p style={footerStyle.signature.item.note}>(Ký, họ tên)</p>
          </div>
          <div style={footerStyle.signature.item}>
            <p style={footerStyle.signature.item.title}>Người nộp tiền</p>
            <p style={footerStyle.signature.item.note}>(Ký, họ tên)</p>
          </div>
          <div style={footerStyle.signature.item}>
            <div>
              <p style={footerStyle.signature.item.title}>Người lập phiếu</p>
              <p style={footerStyle.signature.item.note}>(Ký, họ tên)</p>
            </div>
            <p style={footerStyle.signature.item.createdUser}>
              {info?.assignedPersonName}
            </p>
          </div>
          <div style={footerStyle.signature.item}>
            <p style={footerStyle.signature.item.title}>Thủ quỹ</p>
            <p style={footerStyle.signature.item.note}>(Ký, họ tên)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrintTemplate;
