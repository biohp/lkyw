<!-- 摄像头管理 [1.2]-->
<template>
  <div id="camera">
  	<Form ref="formQuery" inline :model="form.query" label-position="right" :label-width="90">
	    <FormItem label="选择机构：" prop="agency">
	      <Select v-model="form.query.agency" filterable placeholder="选择机构">
		      <Option v-for="item in list.agency" :value="item.value" :key="item.value">{{ item.label }}</Option>
		    </Select>
	    </FormItem>
	    <FormItem label="摄像头名称：" prop="camera">
	      <Input v-model.trim="form.query.camera" placeholder="输入摄像头名称"></Input>
	    </FormItem>
	    <Button type="primary" @click="query">查询</Button>
	  </Form>
    <Card :bordered="false" class="card">
      <p slot="title">
        <Icon type="camera"></Icon>
        &nbsp;摄像头信息
      </p>
      <div slot="extra">
        <Button type="primary" icon="plus-round" @click="modalAdd">新增</Button>
      </div>
      <Table highlight-row :stripe="true" border :columns="columns.camera" :data="data.camera" size="small"></Table>
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
    <Modal v-model="modal.visible.save" :width="910" :mask-closable="false" @on-cancel="modalCloseSave(modal.form)">
      <p slot="header">
        <Icon :type="modal.icon"></Icon>
        <span>&nbsp;{{ modal.title }}</span>
      </p>
      <div>
        <Form ref="formSave" :model="form.save" inline label-position="right" :label-width="100">
          <Card class="card" dis-hover>
            <FormItem label="摄像头名称：" prop="camera">
              <Input v-model.trim="form.save.camera" placeholder="输入摄像头名称"></Input>
            </FormItem>
            <FormItem label="摄像头描述：" prop="explain">
              <Input v-model="form.save.explain"  :autosize="true" placeholder="输入摄像头描述"></Input>
            </FormItem>
            <FormItem label="所属机构：" prop="agency">
              <Select v-model="form.save.agency" class="select" filterable placeholder="选择机构">
                <Option v-for="item in list.agency" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="厂家名称：" prop="factory">
              <Input v-model.trim="form.save.factory" placeholder="输入厂家名称"></Input>
            </FormItem>
            <FormItem label="设备状态：" prop="device">
              <Select v-model="form.save.device" class="select" filterable placeholder="选择设备状态">
                <Option v-for="item in list.device" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="所属辖区：" prop="region">
              <Input v-model.trim="form.save.region" placeholder="输入所属辖区"></Input>
            </FormItem>
            <FormItem label="作用：" prop="func">
              <Input v-model.trim="form.save.func" placeholder="输入作用"></Input>
            </FormItem>
            <FormItem label="所属道路：" prop="road">
              <Input v-model.trim="form.save.road" placeholder="输入所属道路"></Input>
            </FormItem>
            <FormItem label="地点描述：" prop="address">
              <Input v-model="form.save.address" type="textarea" style="width: 162px" :autosize="true" placeholder="输入地点描述"></Input>
            </FormItem>
            <FormItem label="设备编号：" prop="number">
              <Input v-model.trim="form.save.number" placeholder="输入厂商设备编号"></Input>
            </FormItem>
            <FormItem label="IP地址：" prop="ip">
              <Input v-model.trim="form.save.ip" placeholder="输入IP地址"></Input>
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
        <p>摄像头&nbsp;&nbsp;<strong style="color: #f60">{{ form.save.camera }}</strong>&nbsp;&nbsp;删除后，将无法恢复！</p>
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
  name: 'camera',
  data () {
    return {
      form: {
      	query: {
          agency: '',
          camera: '',
        },
        save: {
          id: '',
          camera: '',
          explain: '',
          agency: '',
          factory: '',
          device: '',
          region: '',
          func: '',
          road: '',
          address: '',
          number: '',
          ip: '',
        },
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
        device: [
          {
              value: '1',
              label: '好'
          },
          {
              value: '2',
              label: '坏'
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
        icon: 'camera',
        form: 'formSave',
      },
      columns: {
        camera: [
          {
              title: '摄像头名称',
              key: 'camera',
              width: 350,
              align: 'center',
          },
          {
              title: '长沙支队',
              key: 'agency',
              width: 250,
              align: 'center',
          },
          {
              title: '摄像头厂家',
              key: 'factory',
              align: 'center',
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
        camera: [
          {
            id: '111',
            camera: '摄像头名称',
            explain: '摄像头描述',
            agency: '长沙支队',
            factory: '摄像头厂家',
            device: '1',
            region: '所属辖区',
            func: '作用',
            road: '所属道路ID',
            address: '地点描述',
            number: '厂商设备编号',
            ip: 'IP地址',
          },
          {
            id: '111',
            camera: '摄像头名称',
            explain: '摄像头描述',
            agency: '长沙支队',
            factory: '摄像头厂家',
            device: '1',
            region: '所属辖区',
            func: '作用',
            road: '所属道路ID',
            address: '地点描述',
            number: '厂商设备编号',
            ip: 'IP地址',
          },
          {
            id: '111',
            camera: '摄像头名称',
            explain: '摄像头描述',
            agency: '长沙支队',
            factory: '摄像头厂家',
            device: '1',
            region: '所属辖区',
            func: '作用',
            road: '所属道路ID',
            address: '地点描述',
            number: '厂商设备编号',
            ip: 'IP地址',
          },
          {
            id: '111',
            camera: '摄像头名称',
            explain: '摄像头描述',
            agency: '长沙支队',
            factory: '摄像头厂家',
            device: '1',
            region: '所属辖区',
            func: '作用',
            road: '所属道路ID',
            address: '地点描述',
            number: '厂商设备编号',
            ip: 'IP地址',
          },
          {
            id: '111',
            camera: '摄像头名称',
            explain: '摄像头描述',
            agency: '长沙支队',
            factory: '摄像头厂家',
            device: '1',
            region: '所属辖区',
            func: '作用',
            road: '所属道路ID',
            address: '地点描述',
            number: '厂商设备编号',
            ip: 'IP地址',
          },
          {
            id: '111',
            camera: '摄像头名称',
            explain: '摄像头描述',
            agency: '长沙支队',
            factory: '摄像头厂家',
            device: '1',
            region: '所属辖区',
            func: '作用',
            road: '所属道路ID',
            address: '地点描述',
            number: '厂商设备编号',
            ip: 'IP地址',
          },
          {
            id: '111',
            camera: '摄像头名称',
            explain: '摄像头描述',
            agency: '长沙支队',
            factory: '摄像头厂家',
            device: '1',
            region: '所属辖区',
            func: '作用',
            road: '所属道路ID',
            address: '地点描述',
            number: '厂商设备编号',
            ip: 'IP地址',
          },
          {
            id: '111',
            camera: '摄像头名称',
            explain: '摄像头描述',
            agency: '长沙支队',
            factory: '摄像头厂家',
            device: '1',
            region: '所属辖区',
            func: '作用',
            road: '所属道路ID',
            address: '地点描述',
            number: '厂商设备编号',
            ip: 'IP地址',
          },
          {
            id: '111',
            camera: '摄像头名称',
            explain: '摄像头描述',
            agency: '长沙支队',
            factory: '摄像头厂家',
            device: '1',
            region: '所属辖区',
            func: '作用',
            road: '所属道路ID',
            address: '地点描述',
            number: '厂商设备编号',
            ip: 'IP地址',
          },
          {
            id: '111',
            camera: '摄像头名称',
            explain: '摄像头描述',
            agency: '长沙支队',
            factory: '摄像头厂家',
            device: '1',
            region: '所属辖区',
            func: '作用',
            road: '所属道路ID',
            address: '地点描述',
            number: '厂商设备编号',
            ip: 'IP地址',
          }
        ],
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
          //axios
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
      this.modal.title = '新增摄像头';
      this.modal.icon = 'plus-round';
      this.modal.visible.save = true;
    },
    modalEdit(index) {
      console.log(this.form.save);
      this.modal.title = '编辑摄像头口';
      this.modal.icon = 'edit';
      const data = this.data.camera[index];
      for (let key in this.form.save) {
        if (['agency'].includes(key)) {
          this.form.save[key] = getOptionValue(this.list[key], data[key]);
        } else {
          this.form.save[key] = data[key];
        }
      }
      this.modal.visible.save = true;
    },
    modalDel(index) {
      this.modal.title = '删除摄像头';
      this.modal.icon = 'trash-a';
      const data = this.data.camera[index];
      for (let key in this.form.save) {
        if (['id','camera'].includes(key)) {
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
</style>