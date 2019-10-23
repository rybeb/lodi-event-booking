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
const months_number = [
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12'
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

export const hours = param => {
  const H = new Date(param).getHours();
  const M = new Date(param).getMinutes();
  const m = M !== 0 ? `:${M}` : '';
  if (H === 0) return `12${m} AM`;
  if (H > 12) {
    const h = H - 12;
    return `${h}${m} PM`;
  }
  return `${H}${m} AM`;
};

export const days = d => days_array[new Date(d).getDay()];
export const date = d => new Date(d).getDate();
export const months = d => months_array[new Date(d).getMonth()];
export const months_full = d => months_full_array[new Date(d).getMonth()];
export const year = d => new Date(d).getFullYear();

export const date_full = d => {
  return `${new Date(d).getFullYear()}-${
    months_number[new Date(d).getMonth()]
  }-${new Date(d).getDate()}T00:00`;
};

export const eventDate = (starts, ends) => {
  if (!ends)
    return `${days(starts)}, ${months_full(starts)} ${date(starts)}, ${year(
      starts
    )} at ${hours(starts)} `;

  if (days(starts) !== days(ends))
    return `${months(starts)} ${date(starts)} at ${hours(starts)} - ${months(
      ends
    )} ${date(ends)} at ${hours(ends)}`;

  if (days(starts) === days(ends))
    return `${days(starts)}, ${months_full(starts)} ${date(starts)}, ${year(
      starts
    )} at ${hours(starts)} - ${hours(ends)}`;
};
