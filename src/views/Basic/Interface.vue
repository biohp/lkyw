<!-- 接口管理 [1.2]-->
<template>
  <div id="interface">
  	<Form ref="formQuery" inline :model="form.query" label-position="right" :label-width="80">
      <FormItem label="接口编码：" prop="code">
        <Input v-model.trim="form.query.code" placeholder="输入接口编码"></Input>
      </FormItem>
	    <FormItem label="接口名称：" prop="name">
	      <Input v-model.trim="form.query.name" placeholder="输入接口名称"></Input>
	    </FormItem>
	    <Button type="primary" @click="query">查询</Button>
  	</Form>
    <Card :bordered="false" class="card">
      <p slot="title">
        <Icon type="shuffle"></Icon>
        &nbsp;接口信息
      </p>
      <div slot="extra">
        <Button type="primary" icon="plus-round" @click="modalAdd">新增</Button>
      </div>
      <Table highlight-row :stripe="true" border :columns="columns.interface" :data="data.interface" size="small"></Table>
      <div class="page" v-if="page.total===0?false:true">
        <div style="float: right">
          <Page 
            :total="page.total" 
            :current="page.current" 
            @on-change="pageChange" 
            size="small"
            show-total
            no-data-text 
            show-elevator></Page>
        </div>
      </div>
  	</Card>
    <Modal v-model="modal.visible.save" :width="880" :mask-closable="false" @on-cancel="modalCloseSave(modal.form)">
      <p slot="header">
        <Icon :type="modal.icon"></Icon>
        <span>&nbsp;{{ modal.title }}</span>
      </p>
      <div>
        <Form ref="formSave" :model="form.save" inline label-position="right" :label-width="90">
          <Card class="card" dis-hover>
            <FormItem label="接口名称：" prop="name">
              <Input v-model.trim="form.save.name" placeholder="输入接口名称"></Input>
            </FormItem>
            <FormItem label="接口编码：" prop="code">
              <Input v-model.trim="form.save.code" placeholder="输入接口编码"></Input>
            </FormItem>
            <FormItem label="接口地址：" prop="address">
              <Input v-model.trim="form.save.address" placeholder="输入接口地址"></Input>
            </FormItem>
            <FormItem label="接口类型：" prop="type">
              <Input v-model.trim="form.save.type" placeholder="输入接口类型"></Input>
            </FormItem>
            <FormItem label="接口提供方：" prop="factory">
              <Input v-model.trim="form.save.factory" placeholder="输入接口提供方"></Input>
            </FormItem>
            <FormItem label="状态：" prop="status">
              <Select v-model="form.save.status" class="select" filterable placeholder="选择状态">
                <Option v-for="item in list.status" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="接口参数：" prop="param">
              <Input v-model.trim="form.save.param" placeholder="输入接口参数"></Input>
            </FormItem>
            <FormItem label="接口描述：" prop="remark">
              <Input v-model="form.save.remark" type="textarea" class="textarea" :autosize="true" placeholder="输入接口描述"></Input>
            </FormItem>
          </Card>
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
        <span>&nbsp;{{modal.title}}</span>
      </p>
      <div style="text-align: center">
        <p>接口&nbsp;&nbsp;<strong style="color: #f60">{{ form.save.name }}</strong>&nbsp;&nbsp;删除后，将无法恢复！</p>
        <p>是否继续删除？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long @click="del">删 除</Button> 
      </div>
    </Modal>
  </div>
</template>

<script>
import { getOptionValue } from '../../utils/component.js';
export default {
  name: 'interface',
  data () {
    return {
      form: {
        query: {
          code: '',
          name: '',
        },
        save: {
          id: '',
          name: '',
          remark: '',
          address: '',
          code: '',
          factory: '',
          type: '',
          status: '',
          param: ''
        }
      },
      list: {
      	agency: [
        	{
  		        value: '1',
  		        label: '全国稽查布控系统'
  		    },
  		    {
  		        value: '2',
  		        label: '长沙支队'
  		    },
  		    {
  		        value: '3',
  		        label: '株洲支队'
  		    },
  		    {
  		        value: '4',
  		        label: '湘潭支队'
  		    },
  		    {
  		        value: '5',
  		        label: '永州支队'
  		    },
  		    {
  		        value: '6',
  		        label: '郴州支队'
  		    }
      	],
        status: [
          {
              value: '1',
              label: '有效'
          },
          {
              value: '2',
              label: '无效'
          }
        ],
      },
      page: {
      	total: 0,
      	current: 1,
      },
      modal: {
        visible: {
          save: false,
          del: false,
        },
        title: '',
        icon: 'shuffle',
        form: 'formSave',
      },
      columns: {
        interface: [
          {
              title: '接口名称',
              key: 'name',
              align: 'center',
              width: 250
          },
          {
              title: '接口描述',
              key: 'remark',
              align: 'center',
              width: 300
          },
          {
              title: '接口地址',
              key: 'address',
              align: 'center',
              width: 300
          },
          {
              title: '接口编码',
              key: 'code',
              align: 'center'
          },
          {
              title: '接口提供方',
              key: 'factory',
              align: 'center',
              width: 150
          },
          {
              title: '状态',
              key: 'status',
              align: 'center'
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
        interface: [
          {
            id: '111',
            name: '接口名称',
            remark: '接口描述',
            address: '接口地址',
            code: '接口编码',
            factory: '接口提供方',
            type: '接口类型',
            status: '有效',
            param: '接口参数'
          },
          {
            id: '111',
            name: '接口名称',
            remark: '接口描述',
            address: '接口地址',
            code: '接口编码',
            factory: '接口提供方',
            type: '接口类型',
            status: '有效',
            param: '接口参数'
          },
          {
            id: '111',
            name: '接口名称',
            remark: '接口描述',
            address: '接口地址',
            code: '接口编码',
            factory: '接口提供方',
            type: '接口类型',
            status: '有效',
            param: '接口参数'
          },
          {
            id: '111',
            name: '接口名称',
            remark: '接口描述',
            address: '接口地址',
            code: '接口编码',
            factory: '接口提供方',
            type: '接口类型',
            status: '有效',
            param: '接口参数'
          },
          {
            id: '111',
            name: '接口名称',
            remark: '接口描述',
            address: '接口地址',
            code: '接口编码',
            factory: '接口提供方',
            type: '接口类型',
            status: '有效',
            param: '接口参数'
          },
          {
            id: '111',
            name: '接口名称',
            remark: '接口描述',
            address: '接口地址',
            code: '接口编码',
            factory: '接口提供方',
            type: '接口类型',
            status: '有效',
            param: '接口参数'
          },
          {
            id: '111',
            name: '接口名称',
            remark: '接口描述',
            address: '接口地址',
            code: '接口编码',
            factory: '接口提供方',
            type: '接口类型',
            status: '有效',
            param: '接口参数'
          },
          {
            id: '111',
            name: '接口名称',
            remark: '接口描述',
            address: '接口地址',
            code: '接口编码',
            factory: '接口提供方',
            type: '接口类型',
            status: '有效',
            param: '接口参数'
          },
          {
            id: '111',
            name: '接口名称',
            remark: '接口描述',
            address: '接口地址',
            code: '接口编码',
            factory: '接口提供方',
            type: '接口类型',
            status: '有效',
            param: '接口参数'
          },
          {
            id: '111',
            name: '接口名称',
            remark: '接口描述',
            address: '接口地址',
            code: '接口编码',
            factory: '接口提供方',
            type: '接口类型',
            status: '有效',
            param: '接口参数'
          }
        ],
      }
    }
  },
  created() {
    //request
    this.page.total = 120;
  },
  methods: {
    //数据接口
  	query() {
      
    },
    pageChange(val) {
      
    },
    save(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.modal.visible.save = false;
          this.$Message.success('保存成功！');
        } else {
          this.$Message.error('提交失败！');
        }
      });
    },
    del() {
      this.$Message.success('删除成功！');
      this.modal.visible.del = false;
    },
    //页面交互
  	modalAdd(index) {
      this.modal.title = '新增接口';
      this.modal.icon = 'plus-round';
      this.modal.visible.save = true;
    },
    modalEdit(index) {
      this.modal.title = '编辑接口';
      this.modal.icon = 'edit';
      const data = this.data.interface[index];
      for (let key in this.form.save) {
        if (['status'].includes(key)) {
          this.form.save[key] = getOptionValue(this.list[key], data[key]);
        } else {
          this.form.save[key] = data[key];
        }
      }
      this.modal.visible.save = true;
    },
    modalDel(index) {
      this.modal.title = '删除接口';
      this.modal.icon = 'trash-a';
      const data = this.data.interface[index];
      for (let key in this.form.save) {
        if (['id','name'].includes(key)) {
          this.form.save[key] = data[key];
        }
      }
      this.modal.visible.del = true;
    },
    modalCloseSave(name) {
      this.$refs[name].resetFields();
      this.form.save.id = '';
      this.$Message.warning('本次操作已取消！');
    },
    reset(name) {
      this.$refs[name].resetFields();
    }
  }
}
</script>

<style scoped>
.card{
  background: #f0f5ff;
}
.page{
	margin: 10px;
	overflow: hidden;
	padding-bottom: 2px;
}
.modal-del-title{
  color: #f60;
}
.select{
  width: 162px;
}
.textarea{
  width: 429px;
}
</style>