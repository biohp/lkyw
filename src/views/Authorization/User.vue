<!-- 用户管理 [1.2]-->
<template>
  <div id="user">
  	<Form ref="formQuery" :model="form.query" inline label-position="right" :label-width="80">
	  <FormItem label="用户名：" prop="user">
	    <Input v-model.trim="form.query.user" placeholder="输入用户名"></Input>
	  </FormItem>
	  <FormItem label="机构：" prop="agency">
	    <Cascader 
          :data="list.agency" 
          v-model="form.query.agency" 
          change-on-select
          :render-format="label => label.pop()"
          style="width: 200px"
          placeholder="选择机构"></Cascader>
	  </FormItem>
	  <FormItem label="姓名：" prop="name">
	    <Input v-model.trim="form.query.name" placeholder="输入姓名" style="width: 200px"></Input>
	  </FormItem>
	  <Button type="primary" @click="query">查询</Button>
	  <Button type="ghost" @click="reset('formQuery')">重置</Button>
	</Form>
    <Card class="card">
      <p slot="title">
        <Icon type="person-stalker"></Icon>
        &nbsp;用户信息
      </p>
      <div slot="extra">
        <Button type="primary" icon="plus-round" @click="modalAdd">新增</Button>
      </div>
      <Table size="small" border :stripe="true" :highlight-row="true" :columns="columns.user" :data="data.user"></Table>
      <div class="page" v-if="page.total===0?false:true">
        <div style="float: right">
          <Page 
            :total="page.total" 
            :current="page.current" 
            @on-change="pageChange" 
            show-total
            size="small"
            no-data-text 
            show-elevator></Page>
        </div>
      </div>
    </Card>
    <Modal v-model="modal.visible.save" :width="380" :mask-closable="false" @on-cancel="modalCloseSave(modal.form)">
      <p slot="header">
        <Icon :type="modal.icon"></Icon>
        <span>&nbsp;{{ modal.title }}</span>
      </p>
      <div class="modal-form">
        <Form ref="formSave" :model="form.save" :rules="rule.save" label-position="right" :label-width="90">
          <FormItem label="用户名：" prop="user">
            <Input v-model.trim="form.save.user" placeholder="输入用户名"></Input>
          </FormItem>
          <FormItem label="所属机构：" prop="agency">
        	<Cascader 
        	  :data="list.agency" 
        	  v-model="form.save.agency" 
        	  change-on-select
        	  :render-format="label => label.pop()"
        	  placeholder="选择机构"></Cascader>
          </FormItem>
          <FormItem label="姓名：" prop="name">
            <Input v-model.trim="form.save.name" placeholder="输入姓名"></Input>
          </FormItem>
          <FormItem label="IP地址：" prop="ip">
            <Input v-model.trim="form.save.ip" placeholder="输入IP地址"></Input>
          </FormItem>
          <FormItem label="密码：" prop="pwd">
            <Input 
              v-model.trim="form.save.pwd" 
              type="password"
              placeholder="输入6-12位数字字母组合" 
              @on-change="pwdChange"></Input>
          </FormItem>
          <FormItem label="密码强度：">
            <Progress  :percent="progress.percent" hide-info :status="progress.status"></Progress>
          </FormItem>
          <FormItem label="角色：" prop="role">
            <Select v-model="form.save.role" filterable multiple placeholder="选择角色" >
              <Option v-for="item in list.role" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" @click="save(modal.form)">保存</Button>
        <Button type="ghost" @click="reset(modal.form)">重置</Button> 
      </div>
    </Modal>
    <Modal v-model="modal.visible.del" :width="360" :mask-closable="false">
      <p slot="header" class="modal-del-title">
        <Icon :type="modal.icon"></Icon>
        <span>&nbsp;{{ modal.title }}</span>
      </p>
      <div style="text-align: center">
        <p>用户&nbsp;<strong style="color: #f60">{{ form.save.user }}</strong>&nbsp;删除后，将无法恢复！</p>
        <p>是否继续删除？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long @click="del">删 除</Button> 
      </div>
    </Modal>
    <Modal v-model="modal.visible.show" :width="250" :closable="false">
      <p slot="header">
        <Icon type="person"></Icon>
        <span>&nbsp;{{ modal.title }}</span>
      </p>
      <div style="text-align: center">
        <Poptip v-for="(item, key) in data.role" :key="key" trigger="hover" title="备注" :content="item.remarks">
          <Tag type="dot" color="green">{{ item.label }}</Tag>
        </Poptip>
      </div>
      <div slot="footer">
        <Button type="primary" long @click="modalCloseShow">关 闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getCascaderValue, getProgress } from '../../utils/component.js';
export default {
  name: 'user',
  data () {
    return {
    	form: {
    		query: {
    			user: '',
            	agency: [],
            	name: '',
    		},
    		save: {
    			id: '',
    			user: '',
            	agency: [],
            	name: '',
            	pwd: '',
            	ip: '',
            	role: [],
    		}
        },
        rule: {
        	save: {
        		user: [
	                { required: true, message: '用户名不能为空', trigger: 'blur' }
	            ],
	            agency: [
	                { type: 'array', required: true, message: '请选择一个机构', trigger: 'change' }
	            ],
	            name: [
	                { required: true, message: '姓名不能为空', trigger: 'blur' }
	            ],
	            pwd: [
	                { required: true, message: '密码不能为空', trigger: 'blur' },
	                { type: 'string', min: 6, message: '密码至少6位', trigger: 'blur' }
	            ],
        	}
        },
    	list: {
    		agency: [
    		    {
	                label: '湖南省高速公路交通管理局',
	                value: '001',
	            },{
	                label: '长沙支队',
	                value: '002',
	                children: [{
	                    label: '星沙支队',
	                    value: '003'
	                },{
	                    label: '浏阳支队',
	                    value: '004',
	                    
	                },{
	                    label: '道林支队',
	                    value: '005'
	                }]
	            },{
	                label: '株洲支队',
	                value: '006',
	                children: [{
	                    label: '天元支队',
	                    value: '007'
	                },{
	                    label: '荷塘支队',
	                    value: '008'
	                }]
            	}
            ],
            role: [
            	{
	                value: '1',
	                label: '超级管理员',
	                remarks: ''
	            },
	            {
	                value: '2',
	                label: '总队用户',
	                remarks: '查看经纬度'
	            },
	            {
	                value: '3',
	                label: '支队用户',
	                remarks: ''
	            },
	            {
	                value: '4',
	                label: '普通用户',
	                remarks: ''
	            }
            ],
    	},
        page: {
            current: 1,
            total: 0
        },
        modal: {
            title: '',
            visible: {
                save: false,
                del: false,
                show: false
            },
            icon: 'plus-round',
            form: 'formSave',
        },
        progress: {
        	percent: 0,
        	status: 'wrong', 
        },
        columns: {
        	user: [
	            {
	                title: '用户名',
	                key: 'user',
	                align: 'center',
	                sortable: true
	            },
	            {
	                title: '所属机构',
	                key: 'agency',
	                align: 'center',
	                sortable: true
	            },
	            {
	                title: '姓名',
	                key: 'name',
	                align: 'center',
	                sortable: true
	            },
	            {
	                title: 'IP地址',
	                key: 'ip',
	                align: 'center',
	                sortable: true
	            },
	            {
	                title: '用户角色',
	                key: 'role',
	                align: 'center',
	                render: (h, params) => {
	                    return h('div', [
	                        h('Button', {
	                            props: {
	                                type: 'success',
	                                size: 'small'
	                            },
	                            on: {
	                                click: () => {
	                                    this.modalShow(params.index)
	                                }
	                            }
	                        }, '查看角色')
	                    ]);
	                }
	            },
	            {
	                title: '操作',
	                key: 'handle',
	                width: 150,
	                align: 'center',
	                render: (h, params) => {
	                    return h('div', [
	                        h('Button', {
	                            props: {
	                                type: 'primary',
	                                size: 'small'
	                            },
	                            style: {
	                                marginRight: '5px'
	                            },
	                            on: {
	                                click: () => {
	                                    this.modalEdit(params.index)
	                                }
	                            }
	                        }, '编辑'),
	                        h('Button', {
	                            props: {
	                                type: 'warning',
	                                size: 'small'
	                            },
	                            on: {
	                                click: () => {
	                                    this.modalDel(params.index)
	                                }
	                            }
	                        }, '删除')
	                    ]);
	                }
	            }
	        ],
        },
        data: {
        	user: [ 
	            {
	                user: '662366',
	                agency: '长沙支队',
	                name: '张三',
	                ip: '',
	                role: ['3','4']
	            },
	            {
	                user: '662366',
	                agency: '浏阳支队',
	                name: '王五',
	                ip: '',
	                role: ['4','1']
	            },
	            {
	                user: '662366',
	                agency: '浏阳支队',
	                name: '王五',
	                ip: '',
	                role: ['4','1']
	            },
	            {
	                user: '662366',
	                agency: '株洲支队',
	                name: '李四',
	                ip: '',
	                role: ['3','4']
	            },
	            {
	                user: '662366',
	                agency: '浏阳支队',
	                name: '王五',
	                ip: '',
	                role: ['4','1']
	            },
	            {
	                user: '662366',
	                agency: '浏阳支队',
	                name: '王五',
	                ip: '',
	                role: ['4','1']
	            },
	            {
	                user: '662366',
	                agency: '株洲支队',
	                name: '李四',
	                ip: '',
	                role: ['3','4']
	            },
	            {
	                user: '662366',
	                agency: '浏阳支队',
	                name: '王五',
	                ip: '',
	                role: ['4','1']
	            },
	            {
	                user: '662366',
	                agency: '浏阳支队',
	                name: '王五',
	                ip: '',
	                role: ['4','1']
	            },
	            {
	                user: '662366',
	                agency: '株洲支队',
	                name: '李四',
	                ip: '',
	                role: ['3','4']
	            }      
            ],
            role: [],
        }
    }
  },
  created() {
    this.page.total = 120;  
  },
  methods: {
    //数据接口
    query() {
        
    },
    pageChange(val) {
      this.page.current = val;
    },
    save(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Message.success('保存成功！');
          this.modal.visible.save = false;
        } else {
          this.$Message.error('提交失败！');
        }
      });
    },
    del() {
      this.modal.visible.del = false;
      this.$Message.success('删除成功'); 
    },
    //页面交互
    modalAdd() {
      this.modal.icon = 'plus-round';
      this.modal.title = '新增用户';
      this.modal.visible.save = true;
    },
    modalEdit(index) {
      this.modal.icon = 'edit';
      this.modal.title = '编辑用户';
      const data = this.data.user[index];
  	  for (let key in this.form.save) {
		if (key === 'agency') {
		  this.form.save[key] = getCascaderValue(this.list.agency, data[key]);
		} else if (key === 'role'){
		  data[key].map( item => {
		  	this.form.save[key].push(item);
		  	return item;
		  }); 
		} else {
		  this.form.save[key] = data[key];
		}
	  }
      this.modal.visible.save = true;
    },
    modalDel(index) {
      this.modal.icon = 'trash-a';
      this.modal.title = '删除用户';
      const data = this.data.user[index];
  	  for (let key in this.form.save) {
		if (['id','user'].includes(key)) {
		  this.form.save[key] = data[key];
		}
	  }
      this.modal.visible.del = true;
    },
    modalShow(index) {
      this.modal.title = '用户角色';
      let arr = this.list.role;
      this.data.role = [];
      this.data.user[index].role.map( item => {
        for (let i = 0; i < arr.length; i++) {
          if (item === arr[i].value) {
            this.data.role.push(arr[i]);
          }
        }
        return item;
      });
      this.modal.visible.show = true;
    },
    modalCloseSave(name) {
      this.modal.visible.save = false;
      this.$Message.warning('本次修改已撤销！');
      this.$refs[name].resetFields();
      if (name === 'formSave') {
    	this.form.save.role = [];
    	this.progress.percent = 0;
      }
    },
    modalCloseShow() {
      this.modal.visible.show = false;
    },
    reset(name) {
      this.$refs[name].resetFields();
      if (name === 'formSave') {
        this.form.save.role = [];
        this.progress.percent = 0;
      }
    },
    pwdChange(){
      //百分比和颜色(Percent,Status)
      let progress = getProgress(this.form.save.pwd);
      this.progress.percent = progress.percent;
      this.progress.status = progress.status;
    }
  }
}
</script>

<style scoped>
.card{
  background: #f0f5ff;
}
.page{
  margin-top: 10px;
  padding-bottom: 2px;
  overflow: hidden;
}
.modal-del-title{
  color: #f60;
}
.modal-form{
  margin-right: 20px;
}  
</style>