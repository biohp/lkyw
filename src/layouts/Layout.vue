<template>
  <div id="layout">
    <Layout>
      <Header class="header">
        <div class="header-title">
          <Row align="middle" class="code-row-bg">
		        <Col span="2"><img class="header-title-img" src="../assets/jh.png"></Col>
		        <Col span="10"><span class="header-title-span">两客一危管控平台</span></Col>
		  </Row>
        </div>
        <div class="header-portrait">
          <Dropdown @on-click="dropdownSelect">
            <Avatar class="avatar" icon="person" size="large"/>
            <DropdownMenu slot="list" :style="{textAlign: 'center'}" >
  	          <DropdownItem name="修改密码">修改密码</DropdownItem>
  	          <DropdownItem name="退出">退出</DropdownItem>  
            </DropdownMenu>
          </Dropdown>
    	</div>
      </Header>
      <Layout class="body">
        <Sider hide-trigger class="body-sider">
          <Menu class="body-sider-menu" @on-select="activeSelect" :accordion="true" :active-name="active" theme="light" width="auto" :open-names="open">
          	<Submenu v-for="(menu, key) in list.submenu" :key="key" :name="menu.name">
              <template slot="title">
                <Icon :type="menu.icon"></Icon>
                {{ menu.value }}
              </template>
              <MenuItem 
                v-for="(item, key) in menu.children" 
                :name="item.name" 
                :class="{'menu-item': item.hasClass}"
                :key="key">
                {{ item.value }}
              </MenuItem>
            </Submenu>
          </Menu>
        </Sider>
        <Layout class="body-layout">
          <Breadcrumb class="breadcrumb">
          	<BreadcrumbItem v-for="(item, key) in list.breadcrumb" :key="key">{{ item }}</BreadcrumbItem>
          </Breadcrumb>
          <Content class="body-layout-content">
            <router-view></router-view>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'layout',
  data () {
    return {
      
    }
  },
  computed: {
    ...mapGetters([
      'active',
      'open',
      'list'
    ])
  },
  created() {
  	//axios
  	let arr = this.$router.history.current.path.split("/");
  	this.$store.dispatch('initLayout', {open: arr[1], active: arr[2]});
  },
  methods: {
  	dropdownSelect(name) {
  	  if("退出" === name){
        this.$router.push({ path: '/login' });
      } else if ("修改密码" === name) {
      	console.log(name);
      }
  	},
  	activeSelect(name){
      let open = '';
      if (['local','outland','unlawful'].includes(name)) {
        open = 'vehicle'; 
      } else if (['attendance','bayonet','led','interface','checkpoint','camera'].includes(name)) {
        open = 'basic'; 
      } else if (['user','role','authority'].includes(name)) {
        open = 'authorization'; 
      } else if (['agency','personnel'].includes(name)) {
        open = 'organization'; 
      } else if (['dictionary','parameter'].includes(name)) {
        open = 'configuration'; 
      }
      this.$router.push({path: `/${open}/${name}`});
      this.$store.dispatch('initLayout', {open: open, active: name}); 
  	}
  }
}
</script>

<style scoped>
.header {
  position: fixed;
  width: 100vw;
  min-width: 850px;
  z-index: 10000;
  background-image: linear-gradient(143deg,#2945cb 20%,#2b83f9 81%,#3a9dff); 
  box-shadow: 0 2px 3px 2px rgba(0,0,0,.2);
}
.header-title {
  float: left;
  height: 100%;
  width: 700px;
}
.header-title-img {
  margin-top: 5px;
  width: 50px;
  width: 50px;
}
.header-title-span {
  color: #fff;
  font-size: 22px;
  font-weight: 700;
}
.header-portrait {
  float: right;
  width: 50px;
  text-align: center;
}
.avatar {
  cursor: pointer;
}
.body {
  margin-top: 65px;
}
.body-sider {
  position: fixed; 
  height: 100vh; 
  left: 0;
}
.body-sider-menu {
  background-color: #d6e4ff;
  height: 100%;
}
.menu-item{
  background-color: #fff;
}
.body-layout {
  margin-left: 200px; 
  padding: 0 16px 16px;
}
.breadcrumb {
  margin: 12px 0;
}
.body-layout-content {
  padding: 16px;
  background: #fff;  
  /*min-height: 600px;*/	/*content高度*/
}
</style>