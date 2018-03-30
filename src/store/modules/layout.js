import { getSubmenu, getBreadcrumb } from '../../utils/component.js'
import { INIT_LAYOUT } from '../type.js'

const state = {
  active: '',
  open: [],
  list: {
	  submenu: [],
	  breadcrumb: []
  }
}

const getters = {
  active: state => state.active,
  open: state => state.open,
  list: state => state.list
}

const actions = {
  initLayout(context, payload) {
  	let submenu = getSubmenu(payload.active);
  	let breadcrumb = getBreadcrumb(payload);
  	context.commit('INIT_LAYOUT' , { ...payload, submenu: submenu, breadcrumb: breadcrumb});
  }
}

const mutations = {
  [INIT_LAYOUT](state, data) {
  	state.active = data.active;
    state.open = [];
  	state.open.push(data.open);
  	state.list.submenu = data.submenu;
  	state.list.breadcrumb = data.breadcrumb;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}