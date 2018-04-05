import Vue from 'vue';
import Router from 'vue-router';
import Layout from './layouts/Layout.vue';
import Login from './views/Login/Login.vue';
import Local from './views/Vehicle/Local.vue';
import Outland from './views/Vehicle/Outland.vue';
import Unlawful from './views/Vehicle/Unlawful.vue';
import Attendance from './views/Basic/Attendance.vue';
import Bayonet from './views/Basic/Bayonet.vue';
import LED from './views/Basic/LED.vue';
import Interface from './views/Basic/Interface.vue';
import Checkpoint from './views/Basic/Checkpoint.vue';
import Camera from './views/Basic/Camera.vue';
import User from './views/Authorization/User.vue';
import Role from './views/Authorization/Role.vue';
import Authority from './views/Authorization/Authority.vue';
import Agency from './views/Organization/Agency.vue';
import Personnel from './views/Organization/Personnel.vue';
import Dictionary from './views/Configuration/Dictionary.vue';
import Parameter from './views/Configuration/Parameter.vue';
import Exception403 from './views/Exception/403.vue';
import Exception404 from './views/Exception/404.vue';
import Exception500 from './views/Exception/500.vue';

Vue.use(Router); 

export default new Router({
    routes : [
	  	{ 
	  		path: '/login', 
	  		component: Login ,
	  		alias: '/',
	  	},{
	  		path: '/:open',
	  		component: Layout,
	  		children: [
	  			{
	  				path: 'local',
	  				component: Local,
	  			},{
	  				path: 'outland',
	  				component: Outland,
	  			},{
	  				path: 'unlawful',
	  				component: Unlawful,
	  			},{
	  				path: 'attendance',
	  				component: Attendance,
	  			},{
	  				path: 'bayonet',
	  				component: Bayonet,
	  			},{
	  				path: 'led',
	  				component: LED,
	  			},{
	  				path: 'interface',
	  				component: Interface,
	  			},{
	  				path: 'checkpoint',
	  				component: Checkpoint,
	  			},{
	  				path: 'camera',
	  				component: Camera,
	  			},{
	  				path: 'user',
	  				component: User,
	  			},{
	  				path: 'role',
	  				component: Role,
	  			},{
	  				path: 'authority',
	  				component: Authority,
	  			},{
	  				path: 'agency',
	  				component: Agency,
	  			},{
	  				path: 'personnel',
	  				component: Personnel,
	  			},{
	  				path: 'dictionary',
	  				component: Dictionary,
	  			},{
	  				path: 'parameter',
	  				component: Parameter,
	  			},{
	  				path: '403',
	  				component: Exception403,
	  			},{
	  				path: '404',
	  				component: Exception404,
	  			},{
	  				path: '500',
	  				component: Exception500,
	  			}
	  		]
	  	}
    ]
})