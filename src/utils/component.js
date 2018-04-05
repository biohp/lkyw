import { submenu } from '../common/layout.js';
import { letter } from '../common/common.js';

//Menu 导航菜单
//参数 String active-name值
//返回 Array submenu数组
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
//参数 Object open-names数组第一个值,active-name值
//返回 Array breadcrumb数组
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
//参数 1. Array select数组，2. String label值
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

//Progress 进度条
//参数 String password值
//返回 Object percent值，status值
export function getProgress(value) {
  let arr = value.split("");
  let percent = 0 ;
  let status = '';
  if(arr.length>=6&&arr.length<10){
    percent = 33;
    status = 'wrong';
    for (let i = 0; i < arr.length; i++) {
      if(letter.includes(arr[i])){
        percent = 66;
        status = 'active';
      }
    }
  }else if (arr.length>=10){
    percent = 66;
    status = 'active';
    for (let i = 0; i < arr.length; i++) {
      if(letter.includes(arr[i])){
        percent = 100;
        status = 'success';
      }
    }
  }else {
    percent = 0;
    status = 'wrong';
  }
  return { percent , status }
}

//Cascader 级联选择器
//参数 1.Array cascader数组,2.String label值
//返回 Array value数组
export function getCascaderValue(array, label) {
  let value = [];
  let flag = true;
  array.map( item => {
    if (item.hasOwnProperty('children')) {
      item.children.map( item => {
        if (item.label === label) {
          value.push(item.value);
        }
        return item;
      });
    }
    if (flag) {
      if (item.label !== label && value.length === 1) {
        value.unshift(item.value);
        flag = false;
      } else if (item.label === label) {
        value.push(item.value);
        flag = false;
      }
    }
    return item;
  });
  return value;
}

//Tree 树
//参数 Array tree数组
//返回 Array value数组
export function getTreeValue(array) {
  let value = [];
  array.map( item => {
    if (!item.hasOwnProperty('children')) {
      value.push(item.value);
    }
    return item;
  });
  return value;
}
//参数 Array tree数组
//返回 Array tree数组
export function resetTree(array) {
  array.map( item => {
    if (item.hasOwnProperty('children')) {
      item.children.map( item => {
        item.checked = false;
        return item;
      });
      item.indeterminate = false;
    }
    item.checked = false;
    return item;
  });
  return array;
}
//参数 1.Array tree数组,2.Array checked数组
//返回 Array value数组
export function setTree(array, check) {
    array = array.map( item => {
        if (item.hasOwnProperty('children')) {
            item.children = item.children.map( item => {
        if (item.hasOwnProperty('checked')) {
                    item.checked = false;
                }
                return item;
            });
        }
    if (item.hasOwnProperty('indeterminate')) {
            item.indeterminate = false;
        }
        return item;
    });
    if (check.length !== 0) {
      array = array.map( item => {
          if (item.hasOwnProperty('children')) {
              item.children = item.children.map( item => {
                if (check.length !== 0) {
                  for (let i = 0; i < check.length; i++) {
                    if(item.value === check[i]){
                          item = { ...item, checked: true };
                      }
                  }
                }
                  return item;
              });
          }
          return item;
      });
    }
    return array;
}
