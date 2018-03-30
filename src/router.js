import Vue from 'vue'
import Router from 'vue-router'
import Layout from './layouts/Layout.vue'
import Login from './views/Login/Login.vue'
import Local from './views/Vehicle/Local'
import Outland from './views/Vehicle/Outland'
import Unlawful from './views/Vehicle/Unlawful'
import Attendance from './views/Basic/Attendance'
import Bayonet from './views/Basic/Bayonet'
import LED from './views/Basic/LED'
import Interface from './views/Basic/Interface'
import Checkpoint from './views/Basic/Checkpoint'
import Camera from './views/Basic/Camera'
import User from './views/Authorization/User'
import Role from './views/Authorization/Role'
import Authority from './views/Authorization/Authority'
import Agency from './views/Organization/Agency'
import Personnel from './views/Organization/Personnel'
import Dictionary from './views/Configuration/Dictionary'
import Parameter from './views/Configuration/Parameter'

Vue.use(Router) 

export default new Router({
    routes : [
	  	{ 
	  		path: '/login', 
	  		component: Login ,
	  		alias: '/'
	  	},{
	  		path: '/:open',
	  		component: Layout,
	  		children: [
	  			{
	  				path: 'local',
	  				component: Local
	  			},{
	  				path: 'outland',
	  				component: Outland
	  			},{
	  				path: 'unlawful',
	  				component: Unlawful
	  			},{
	  				path: 'attendance',
	  				component: Attendance
	  			},{
	  				path: 'bayonet',
	  				component: Bayonet
	  			},{
	  				path: 'led',
	  				component: LED
	  			},{
	  				path: 'interface',
	  				component: Interface
	  			},{
	  				path: 'checkpoint',
	  				component: Checkpoint
	  			},{
	  				path: 'camera',
	  				component: Camera
	  			},{
	  				path: 'user',
	  				component: User
	  			},{
	  				path: 'role',
	  				component: Role
	  			},{
	  				path: 'authority',
	  				component: Authority
	  			},{
	  				path: 'agency',
	  				component: Agency
	  			},{
	  				path: 'personnel',
	  				component: Personnel
	  			},{
	  				path: 'dictionary',
	  				component: Dictionary
	  			},{
	  				path: 'parameter',
	  				component: Parameter
	  			}
	  		]
	  	}
    ]
})