<!-- 数据字典配置 [1.2]-->
<template>
  <div id="dictionary">
	  <Form ref="formQuery" inline :model="form.query" label-position="right" :label-width="80">
	    <FormItem label="代码类别：" prop="type">
	      <Input v-model.trim="form.query.type" placeholder="输入代码类别"></Input>
	    </FormItem>
	    <FormItem label="代码：" prop="code">
	      <Input v-model.trim="form.query.code" placeholder="输入代码"></Input>
	    </FormItem>
	    <Button type="primary" @click="query">查询</Button>
	  </Form>
	  <Card :bordered="false" class="card">
      <p slot="title">
        <Icon type="ios-book"></Icon>
        &nbsp;数据字典信息
      </p>
      <div slot="extra">
        <Button type="primary" icon="plus-round" @click="modalAdd">新增</Button>
      </div>
	    <Table highlight-row :stripe="true" border :columns="columns.dictionary" :data="data.dictionary" size="small"></Table>
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
	  <Modal v-model="modal.visible.save" :width="350" :mask-closable="false" @on-cancel="modalCloseSave(modal.form)">
      <p slot="header">
        <Icon :type="modal.icon"></Icon>
        <span>&nbsp;{{ modal.title }}</span>
      </p>
      <div>
        <Form ref="formSave" :model="form.save" inline label-position="right" :label-width="90">
          <Card class="card" dis-hover>
            <FormItem label="代码类别：" prop="type">
              <Input v-model.trim="form.save.type" placeholder="输入检查点名称"></Input>
            </FormItem>
            <FormItem label="代码：" prop="code">
              <Input v-model.trim="form.save.code" placeholder="输入地点名称"></Input>
            </FormItem>
            <FormItem label="代码说明：" prop="explain">
              <Input v-model="form.save.explain" type="textarea" style="width: 162px" :autosize="true" placeholder="输入说明"></Input>
            </FormItem>
            <FormItem label="代码描述：" prop="remark">
              <Input v-model="form.save.remark" type="textarea" style="width: 162px" :autosize="true" placeholder="输入描述"></Input>
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
        <span>&nbsp;{{ modal.title }}</span>
      </p>
      <div style="text-align: center">
        <p>数据&nbsp;&nbsp;<strong style="color: #f60">{{ form.save.type }}</strong>&nbsp;&nbsp;删除后，将无法恢复！</p>
        <p>是否继续删除？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long @click="del">删 除</Button> 
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'dictionary',
  data () {
    return {
      form: {
      	query: {
  		  type: '',
  		  code: '',
      	},
      	save: {
      	  id: '',
		  type: '',
	      code: '',
		  explain: '',
		  remark: '',
      	}
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
      	icon: 'ios-book',
      	form: 'formSave',
      },
      columns: {
      	dictionary: [
      	  {
              title: '代码类别',
              key: 'type',
              sortable: true,
              align: 'center',
          },
          {
              title: '代码',
              key: 'code',
              align: 'center',
          },
          {
              title: '代码说明',
              key: 'explain',
              align: 'center',
          },
          {
              title: '代码备注',
              key: 'remark',
              width: 450,
              align: 'center',
          },
          {
              title: '操作',
              key: 'handle',
              width: 75,
              align: 'center',
              render: (h, params) => {
                  return h('div', [
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
      	dictionary: [
      		{
      			id: '',
      			type: '0011001',
      			code: '0',
      			explain: '北',
      			remark: '路口方向编码',
      		},
      		{
      			id: '',
      			type: '0011001',
      			code: '0',
      			explain: '北',
      			remark: '路口方向编码',
      		},
      		{
      			id: '',
      			type: '0011001',
      			code: '0',
      			explain: '北',
      			remark: '路口方向编码',
      		},
      		{
      			id: '',
      			type: '0011001',
      			code: '0',
      			explain: '北',
      			remark: '路口方向编码',
      		},
      		{
      			id: '',
      			type: '0011001',
      			code: '0',
      			explain: '北',
      			remark: '路口方向编码',
      		},
      		{
      			id: '',
      			type: '0011001',
      			code: '0',
      			explain: '北',
      			remark: '路口方向编码',
      		},
      		{
      			id: '',
      			type: '0011001',
      			code: '0',
      			explain: '北',
      			remark: '路口方向编码',
      		},
      		{
      			id: '',
      			type: '0011001',
      			code: '0',
      			explain: '北',
      			remark: '路口方向编码',
      		},
      		{
      			id: '',
      			type: '0011001',
      			code: '0',
      			explain: '北',
      			remark: '路口方向编码',
      		},
      		{
      			id: '',
      			type: '0011001',
      			code: '0',
      			explain: '北',
      			remark: '路口方向编码',
      		}
      	]
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
  	modalAdd() {
  	  this.modal.title = '新增数据字典信息';
      this.modal.icon = 'plus-round';
      this.modal.visible.save = true;
  	},
  	modalDel(index) {
  	  this.modal.icon = 'trash-a';
      this.modal.title = '删除数据字典信息';
      const data = this.data.dictionary[index];
      for (let key in this.form.save) {
        if (['id','type'].includes(key)) {
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
</style>