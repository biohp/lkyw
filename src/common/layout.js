export const submenu = [
  {
      name: 'vehicle',
      icon: 'android-car',
      value: '过车数据查询',
      children: [
          {
              name: 'all',
              value: '过车查询',
              hasClass: false
          },{
              name: 'unlawful',
              value: '违法闯禁查询',
              hasClass: false
          }
      ]
  },{
      name: 'basic',
      icon: 'android-pin',
      value: '基础数据管理',
      children: [
          {
              name: 'attendance',
              value: '执勤管理',
              hasClass: false
          },{
              name: 'bayonet',
              value: '卡口管理',
              hasClass: false
          },{
              name: 'checkpoint',
              value: '检查点管理',
              hasClass: false
          },{
              name: 'camera',
              value: '摄像头管理',
              hasClass: false
          }
      ]
  },{
      name: 'authorization',
      icon: 'android-person',
      value: '用户权限管理',
      children: [
          {
              name: 'user',
              value: '用户管理',
              hasClass: false
          },{
              name: 'role',
              value: '角色管理',
              hasClass: false
          },{
              name: 'authority',
              value: '权限管理',
              hasClass: false
          }
      ]
  },{
      name: 'organization',
      icon: 'briefcase',
      value: '组织机构管理',
      children: [
          {
              name: 'agency',
              value: '机构管理',
              hasClass: false
          },{
              name: 'personnel',
              value: '人员管理',
              hasClass: false
          }
      ]
  },{
      name: 'configuration',
      icon: 'android-settings',
      value: '系统配置管理',
      children: [
          {
              name: 'dictionary',
              value: '数据字典配置',
              hasClass: false
          },{
              name: 'parameter',
              value: '系统参数配置',
              hasClass: false
          }
      ]
  }
]