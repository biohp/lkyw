import { submenu } from '../common/layout.js'

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