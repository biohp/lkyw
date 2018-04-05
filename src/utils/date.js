export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}
//日期格式化
export function formatDate(arr) {
	const start=new Date(arr[0].getTime());
    const end=new Date(arr[1].getTime());
    const startDate=`${start.getFullYear()}-${fixedZero(start.getMonth() + 1)}-${fixedZero(start.getDate())} ${fixedZero(start.getHours())}:${fixedZero(start.getMinutes())}:${fixedZero(start.getSeconds())}`;
    const endDate=`${end.getFullYear()}-${fixedZero(end.getMonth() + 1)}-${fixedZero(end.getDate())} ${fixedZero(end.getHours())}:${fixedZero(end.getMinutes())}:${fixedZero(end.getSeconds())}`;
    arr = [];
    arr.push(startDate, endDate);
    return arr;
}
//设定日期
export function setDate(date) {
	let arr = [];
	const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * date);
    arr.push(start,end);
    return arr;
}