export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function formatDate(arr) {
	const start=new Date(arr[0].getTime());
    const end=new Date(arr[1].getTime());
    const startDate=`${start.getFullYear()}-${fixedZero(start.getMonth() + 1)}-${fixedZero(start.getDate())} ${fixedZero(start.getHours())}:${fixedZero(start.getMinutes())}:${fixedZero(start.getSeconds())}`;
    const endDate=`${end.getFullYear()}-${fixedZero(end.getMonth() + 1)}-${fixedZero(end.getDate())} ${fixedZero(end.getHours())}:${fixedZero(end.getMinutes())}:${fixedZero(end.getSeconds())}`;
    arr = [];
    arr.push(startDate, endDate);
    return arr;
}