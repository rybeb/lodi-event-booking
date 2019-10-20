const months_array = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];
const months_full_array = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];
const days_array = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

export const HOURS = hours => {
  const H = new Date(hours).getHours();
  if (H > 12) {
    const h = H - 12;
    return `${h} PM`;
  }
  return `${H} AM`;
};

export const MONTHS = date => {
  return months_array[new Date(date).getMonth()];
};

export const MONTHS_FULL = date => {
  return months_full_array[new Date(date).getMonth()];
};

export const DAYS = date => {
  return days_array[new Date(date).getDay()];
};

export const DATE = date => {
  return new Date(date).getDate();
};

export const YEAR = date => {
  return new Date(date).getFullYear();
};
