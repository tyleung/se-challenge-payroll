const getDaysInMonth = (m, y) => {
  return m === 2
    ? y & 3 || (!(y % 25) && y & 15)
      ? 28
      : 29
    : 30 + ((m + (m >> 3)) & 1);
};

module.exports.dateToPayPeriod = date => {
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  const startDay = day > 15 ? 16 : 1;
  const endDay = day > 15 ? getDaysInMonth(month + 1, year) : 15;
  const startDate = new Date(year, month, startDay);
  const endDate = new Date(year, month, endDay);
  const payPeriod = { startDate, endDate };
  return payPeriod;
};
