<!-- 检查点管理 [1.2]-->
<template>
  <div id="checkpoint">
  	<Form ref="formQuery" inline :model="form.query" label-position="right" :label-width="90">
	    <FormItem label="选择机构：" prop="agency">
	      <Select v-model="form.query.agency" filterable placeholder="选择机构">
		      <Option v-for="item in list.agency" :value="item.value" :key="item.value">{{ item.label }}</Option>
		    </Select>
	    </FormItem>
	    <FormItem label="检查点名称：" prop="check">
	      <Input v-model.trim="form.query.check" placeholder="输入检查点名称"></Input>
	    </FormItem>
	    <Button type="primary" @click="query">查询</Button>
  	</Form>
    <Card :bordered="false" class="card">
      <p slot="title">
        <Icon type="flag"></Icon>
        &nbsp;检查点信息
      </p>
      <div slot="extra">
        <Button type="primary" icon="plus-round" @click="modalAdd">新增</Button>
      </div>
  	  <Table highlight-row :stripe="true" border :columns="columns.checkpoint" :data="data.checkpoint" size="small"></Table>
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
            <FormItem label="检查点名称：" prop="check">
              <Input v-model.trim="form.save.check" placeholder="输入检查点名称"></Input>
            </FormItem>
            <FormItem label="地点：" prop="address">
              <Input v-model.trim="form.save.address" placeholder="输入地点名称"></Input>
            </FormItem>
            <FormItem label="所属机构：" prop="agency">
              <Select v-model="form.save.agency" class="select" filterable placeholder="选择机构" @on-change="selectChange">
                <Option v-for="item in list.agency" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="选择卡口：" prop="bayonet">
              <Select v-model="form.save.bayonet" class="selects" multiple placeholder="选择卡口">
                <Option v-for="item in list.bayonet" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="选择LED：" prop="led">
              <Select v-model="form.save.led" class="selects" multiple placeholder="选择LED">
                <Option v-for="item in list.led" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="选择摄像头：" prop="camera">
              <Select v-model="form.save.camera" class="selects" multiple placeholder="选择摄像头">
                <Option v-for="item in list.camera" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="检查点描述：" prop="remark">
              <Input v-model="form.save.remark" type="textarea" class="textarea" :autosize="true" placeholder="输入描述"></Input>
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
        <p>检查点&nbsp;&nbsp;<strong style="color: #f60">{{ form.save.check }}</strong>&nbsp;&nbsp;删除后，将无法恢复！</p>
        <p>是否继续删除？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long @click="del">删 除</Button> 
      </div>
    </Modal>
  </div>
</template>

<script>
import { getOptionValue, getCascaderValue } from '../../utils/component.js';
export default {
  name: 'checkpoint',
  data () {
    return {
      form: {
        query: {
          agency: '',
          check: ''
        },
        save: {
          id: '',
          check: '',
          remark: '',
          address: '',
          agency: '',
          bayonet: [],
          led: [],
          camera: [],
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
        bayonet: [
          {
            label: '全国稽查布控系统',
            value:'000',
          },
          {
            label: '长沙支队',
            value:'100',
          },
          {
            label: '株洲支队',
            value:'200',
          }
        ],
        led: [
          {
            label: '全国稽查布控系统',
            value:'000',
          },
          {
            label: '长沙支队',
            value:'100',
          },
          {
            label: '株洲支队',
            value:'200',
          }
        ],
        camera: [
          {
            label: '全国稽查布控系统',
            value:'000',
          },
          {
            label: '长沙支队',
            value:'100',
          },
          {
            label: '株洲支队',
            value:'200',
          }
        ]
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
        icon: 'flag',
        form: 'formSave',
      },
      columns: {
        checkpoint: [
          {
              title: '检查点名称',
              key: 'check',
              sortable: true,
              align: 'center'
          },
          {
              title: '地点描述',
              key: 'address',
              width: 400,
              align: 'center'
          },
          {
              title: '所属机构',
              key: 'agency',
              align: 'center'
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
        checkpoint: [
          {
            id: '111',
            status: '正在检查',
            check: '检查点名称',
            remark: '检查点描述',
            address: '地点描述',
            agency: '株洲支队',
            bayonet: '环长沙西收费站长张高速15公里392米',
            led: '环长沙西收费站长张高速15公里392米LED',
            camera: '环沙西收费站长摄像头',
          },
          {
            id: '111',
            status: '正在检查',
            check: '检查点名称',
            remark: '检查点描述',
            address: '地点描述',
            agency: '株洲支队',
            bayonet: '环长沙西收费站长张高速15公里392米',
            led: '环长沙西收费站长张高速15公里392米LED',
            camera: '环沙西收费站长摄像头',
          },
          {
            id: '111',
            status: '正在检查',
            check: '检查点名称',
            remark: '检查点描述',
            address: '地点描述',
            agency: '株洲支队',
            bayonet: '环长沙西收费站长张高速15公里392米',
            led: '环长沙西收费站长张高速15公里392米LED',
            camera: '环沙西收费站长摄像头',
          },
          {
            id: '111',
            status: '正在检查',
            check: '检查点名称',
            remark: '检查点描述',
            address: '地点描述',
            agency: '株洲支队',
            bayonet: '环长沙西收费站长张高速15公里392米',
            led: '环长沙西收费站长张高速15公里392米LED',
            camera: '环沙西收费站长摄像头',
          },
          {
            id: '111',
            status: '正在检查',
            check: '检查点名称',
            remark: '检查点描述',
            address: '地点描述',
            agency: '株洲支队',
            bayonet: '环长沙西收费站长张高速15公里392米',
            led: '环长沙西收费站长张高速15公里392米LED',
            camera: '环沙西收费站长摄像头',
          },
          {
            id: '111',
            status: '正在检查',
            check: '检查点名称',
            remark: '检查点描述',
            address: '地点描述',
            agency: '株洲支队',
            bayonet: '环长沙西收费站长张高速15公里392米',
            led: '环长沙西收费站长张高速15公里392米LED',
            camera: '环沙西收费站长摄像头',
          },
          {
            id: '111',
            status: '正在检查',
            check: '检查点名称',
            remark: '检查点描述',
            address: '地点描述',
            agency: '株洲支队',
            bayonet: '环长沙西收费站长张高速15公里392米',
            led: '环长沙西收费站长张高速15公里392米LED',
            camera: '环沙西收费站长摄像头',
          },
          {
            id: '111',
            status: '正在检查',
            check: '检查点名称',
            remark: '检查点描述',
            address: '地点描述',
            agency: '株洲支队',
            bayonet: '环长沙西收费站长张高速15公里392米',
            led: '环长沙西收费站长张高速15公里392米LED',
            camera: '环沙西收费站长摄像头',
          },
          {
            id: '111',
            status: '正在检查',
            check: '检查点名称',
            remark: '检查点描述',
            address: '地点描述',
            agency: '株洲支队',
            bayonet: '环长沙西收费站长张高速15公里392米',
            led: '环长沙西收费站长张高速15公里392米LED',
            camera: '环沙西收费站长摄像头',
          },
          {
            id: '111',
            status: '正在检查',
            check: '检查点名称',
            remark: '检查点描述',
            address: '地点描述',
            agency: '株洲支队',
            bayonet: '环长沙西收费站长张高速15公里392米',
            led: '环长沙西收费站长张高速15公里392米LED',
            camera: '环沙西收费站长摄像头',
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
    selectChange(name) {
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
    //组件交互
    modalAdd() {
      this.modal.title = '新增检查点';
      this.modal.icon = 'plus-round';
      this.modal.visible.save = true;
    },
    modalEdit(index) {
      this.modal.title = '编辑检查点';
      this.modal.icon = 'edit';
      const data = this.data.checkpoint[index];
      for (let key in this.form.save) {
        if (['agency'].includes(key)) {
          this.form.save[key] = getOptionValue(this.list[key], data[key]);
        } else if (['bayonet','led','camera'].includes(key)){
          this.form.save[key] = getCascaderValue(this.list[key], data[key]);
        } else {
          this.form.save[key] = data[key];
        }
      }
      this.modal.visible.save = true;
    },
    modalDel(index) {
      this.modal.icon = 'trash-a';
      this.modal.title = '删除检查点';
      const data = this.data.checkpoint[index];
      for (let key in this.form.save) {
        if (['id','check'].includes(key)) {
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
.selects{
  width: 695px;
}
.textarea{
  width: 429px;
}
</style>