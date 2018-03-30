import { submenu } from '../common/layout.js'

//Menu 导航菜单
//参数 String active-name的值
//返回 Array Submenu 数组
export function getSubmenu(name) {
  submenu.map( item => {
    item.children.map( item => {
      item.hasClass = false;
      return item;
    });
    return item;
  });
  submenu.map( item => {
  	item.children.map( item => {
  		if ( item.name === name) {
  			item.hasClass = true;
  		}
  		return item;
  	});
  	return item;
  });
  return submenu;
}

//Breadcrumb 面包屑
//参数 Object open:open-names的数组第一个值,active:Submenu的active-name值
//返回 Array Breadcrumb 数组
export function getBreadcrumb(data) {
  let breadcrumb = [];
  submenu.map( item => {
    if (item.name === data.open) {
      breadcrumb.push(item.value);
      item.children.map( item => {
        if (item.name === data.active) {
          breadcrumb.push(item.value);
        }
        return item;
      });
    }
    return item;
  });
  return breadcrumb;
}

//Select 选择器，
//参数 1. Array Option数组，2. String label值
//返回 String value值
export function getOptionValue(array, label) {
	let value = '';
	array.map( item => {
		if (label === item.label) {
			value = item.value;
		}
		return item;
	});
	return value;
}