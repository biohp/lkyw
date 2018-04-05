<!-- LED管理 [1.2] -->
<template>
  <div id="led">
  	<Form ref="formQuery" inline :model="form.query" label-position="right" :label-width="80">
	    <FormItem label="选择机构：" prop="agency">
	      <Select v-model="form.query.agency" filterable placeholder="选择机构">
		      <Option v-for="item in list.agency" :value="item.value" :key="item.value">{{ item.label }}</Option>
		    </Select>
	    </FormItem>
	    <FormItem label="LED名称：" prop="name">
	      <Input v-model.trim="form.query.led" placeholder="输入LED名称"></Input>
	    </FormItem>
	    <Button type="primary" @click="query">查询</Button>
	  </Form>
    <Card :bordered="false" class="card">
    	<p slot="title">
        <Icon type="easel"></Icon>
        &nbsp;LED信息
      </p>
      <div slot="extra">
        <Button type="primary" icon="plus-round" @click="modalAdd">新增</Button>
      </div>
	    <Table highlight-row :stripe="true" border :columns="columns.led" :data="data.led" size="small"></Table>
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
    <Modal v-model="modal.visible.save" :width="1150" :mask-closable="false" @on-cancel="modalCloseSave(modal.form)">
      <p slot="header">
        <Icon :type="modal.icon"></Icon>
        <span>&nbsp;{{ modal.title }}</span>
      </p>
      <div>
        <Form ref="formSave" :model="form.save" inline label-position="right" :label-width="90">
          <Card class="card" dis-hover>
            <p slot="title">基本信息</p>
            <FormItem label="名称：" prop="led">
              <Input v-model.trim="form.save.led" placeholder="输入LED名称"></Input>
            </FormItem>
            <FormItem label="厂家：" prop="factory">
              <Select v-model="form.save.factory" class="select" filterable placeholder="选择厂家">
                <Option v-for="item in list.factory" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="设备状态：" prop="device">
              <Select v-model="form.save.device" class="select" filterable placeholder="选择设备状态">
                <Option v-for="item in list.device" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="作用类型：" prop="func">
              <Select v-model="form.save.func" class="select" filterable placeholder="选择作用类型">
                <Option v-for="item in list.func" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="设备编号：" prop="number">
              <Input v-model.trim="form.save.number" placeholder="输入设备编号"></Input>
            </FormItem>
            <FormItem label="高度（m）：" prop="height">
              <Input v-model.trim="form.save.height" placeholder="输入LED高度"></Input>
            </FormItem>
            <FormItem label="宽度（m）：" prop="width">
              <Input v-model.trim="form.save.width" placeholder="输入LED宽度"></Input>
            </FormItem>
            <FormItem label="LED屏颜色：" prop="color">
              <Select v-model="form.save.color" class="select" filterable placeholder="选择颜色">
                <Option v-for="item in list.color" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="描述：" prop="describe">
              <Input v-model="form.save.describe" type="textarea" class="textarea" :autosize="true" placeholder="输入描述"></Input>
            </FormItem>
          </Card>
          <Card class="card-check" dis-hover>
            <p slot="title">检查点信息</p>
            <FormItem label="显示屏内容：" prop="content">
              <Input v-model="form.save.content" type="textarea" class="textarea" :autosize="true" placeholder="输入显示屏内容"></Input>
            </FormItem>
            <FormItem label="所属机构：" prop="agency">
              <Select v-model="form.save.agency" class="select" filterable placeholder="选择所属机构">
                <Option v-for="item in list.agency" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="所属辖区：" prop="region">
              <Input v-model.trim="form.save.region" placeholder="输入所属辖区"></Input>
            </FormItem>
            <FormItem label="所属道路：" prop="road">
              <Input v-model.trim="form.save.road" placeholder="输入所属道路"></Input>
            </FormItem>
            <FormItem label="交接地市：" prop="city">
              <Input v-model.trim="form.save.city" placeholder="输入交接地市"></Input>
            </FormItem>
            <FormItem label="IP地址：" prop="ip">
              <Input v-model.trim="form.save.ip" placeholder="输入IP地址"></Input>
            </FormItem>
            <FormItem label="地点描述：" prop="remark">
              <Input v-model="form.save.remark" type="textarea" style="width: 162px" :autosize="true" placeholder="输入地点描述"></Input>
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
        <p>LED&nbsp;&nbsp;<strong style="color: #f60">{{ form.save.led }}</strong>&nbsp;&nbsp;删除后，将无法恢复！</p>
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
  name: 'led',
  data () {
    return {
      form: {
        query: {
          agency: '',
          led: '',
          current: 1,
          pageSize: 10,
        },
        save: {
          id: '',
          led: '',
          factory: '',
          device: '',
          func: '',
          number: '',
          height: '',
          width: '',
          color: '',
          describe: '',
          content: '',
          agency: '',
          region: '',
          road: '',
          city: '',
          ip: '',
          remark: '',
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
        factory: [
          {
              value: '1',
              label: '华为'
          },
          {
              value: '2',
              label: '惠普'
          }
        ],
        device: [
          {
              value: '1',
              label: '良好'
          },
          {
              value: '2',
              label: '故障'
          }
        ],
        func: [
          {
              value: '1',
              label: '提醒'
          },
          {
              value: '2',
              label: '警告'
          }
        ],
        color: [
          {
              value: '1',
              label: '红'
          },
          {
              value: '2',
              label: '黄'
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
          del: false
        },
        title: '',
        icon: 'easel',
        form: 'formSave'
      },
      columns: {
        led: [
          {
              title: 'LED名称',
              key: 'led',
              width: 250,
              sortable: true,
              align: 'center'
          },
          {
              title: '所属机构',
              key: 'agency',
              width: 120,
              align: 'center'
          },
          {
              title: '作用类型',
              key: 'func',
              width: 120,
              align: 'center'
          },
          {
              title: 'LED内容',
              key: 'content',
              align: 'center'
          },
          {
              title: 'LED厂家',
              key: 'factory',
              width: 250,
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
        ]
      },
      data: {
        led: [
          {
            id: '00001XDS',
            led: '水府庙',
            factory: '华为',
            device: '1',
            func: '提醒',
            number: '123456',
            height: '1',
            width: '10',
            color: '1',
            describe: '水府庙两客一危',
            content: '两客一危车辆进服务区检查',
            agency: '湘潭支队',
            region: '湘潭支队',
            road: '京珠高速',
            city: '湘潭',
            ip: '127.1.1.1',
            remark: '无',
          },
          {
            id: '00001XDS',
            led: '水府庙',
            factory: '华为',
            device: '1',
            func: '提醒',
            number: '123456',
            height: '1',
            width: '10',
            color: '1',
            describe: '水府庙两客一危',
            content: '两客一危车辆进服务区检查',
            agency: '湘潭支队',
            region: '湘潭支队',
            road: '京珠高速',
            city: '湘潭',
            ip: '127.1.1.1',
            remark: '无',
          },
          {
            id: '00001XDS',
            led: '水府庙',
            factory: '华为',
            device: '1',
            func: '提醒',
            number: '123456',
            height: '1',
            width: '10',
            color: '1',
            describe: '水府庙两客一危',
            content: '两客一危车辆进服务区检查',
            agency: '湘潭支队',
            region: '湘潭支队',
            road: '京珠高速',
            city: '湘潭',
            ip: '127.1.1.1',
            remark: '无',
          },
          {
            id: '00001XDS',
            led: '水府庙',
            factory: '华为',
            device: '1',
            func: '提醒',
            number: '123456',
            height: '1',
            width: '10',
            color: '1',
            describe: '水府庙两客一危',
            content: '两客一危车辆进服务区检查',
            agency: '湘潭支队',
            region: '湘潭支队',
            road: '京珠高速',
            city: '湘潭',
            ip: '127.1.1.1',
            remark: '无',
          },
          {
            id: '00001XDS',
            led: '水府庙',
            factory: '华为',
            device: '1',
            func: '提醒',
            number: '123456',
            height: '1',
            width: '10',
            color: '1',
            describe: '水府庙两客一危',
            content: '两客一危车辆进服务区检查',
            agency: '湘潭支队',
            region: '湘潭支队',
            road: '京珠高速',
            city: '湘潭',
            ip: '127.1.1.1',
            remark: '无',
          },
          {
            id: '00001XDS',
            led: '水府庙',
            factory: '华为',
            device: '1',
            func: '提醒',
            number: '123456',
            height: '1',
            width: '10',
            color: '1',
            describe: '水府庙两客一危',
            content: '两客一危车辆进服务区检查',
            agency: '湘潭支队',
            region: '湘潭支队',
            road: '京珠高速',
            city: '湘潭',
            ip: '127.1.1.1',
            remark: '无',
          },
          {
            id: '00001XDS',
            led: '水府庙',
            factory: '华为',
            device: '1',
            func: '提醒',
            number: '123456',
            height: '1',
            width: '10',
            color: '1',
            describe: '水府庙两客一危',
            content: '两客一危车辆进服务区检查',
            agency: '湘潭支队',
            region: '湘潭支队',
            road: '京珠高速',
            city: '湘潭',
            ip: '127.1.1.1',
            remark: '无',
          },
          {
            id: '00001XDS',
            led: '水府庙',
            factory: '华为',
            device: '1',
            func: '提醒',
            number: '123456',
            height: '1',
            width: '10',
            color: '1',
            describe: '水府庙两客一危',
            content: '两客一危车辆进服务区检查',
            agency: '湘潭支队',
            region: '湘潭支队',
            road: '京珠高速',
            city: '湘潭',
            ip: '127.1.1.1',
            remark: '无',
          },
          {
            id: '00001XDS',
            led: '水府庙',
            factory: '华为',
            device: '1',
            func: '提醒',
            number: '123456',
            height: '1',
            width: '10',
            color: '1',
            describe: '水府庙两客一危',
            content: '两客一危车辆进服务区检查',
            agency: '湘潭支队',
            region: '湘潭支队',
            road: '京珠高速',
            city: '湘潭',
            ip: '127.1.1.1',
            remark: '无',
          },
          {
            id: '00001XDS',
            led: '水府庙',
            factory: '华为',
            device: '1',
            func: '提醒',
            number: '123456',
            height: '1',
            width: '10',
            color: '1',
            describe: '水府庙两客一危',
            content: '两客一危车辆进服务区检查',
            agency: '湘潭支队',
            region: '湘潭支队',
            road: '京珠高速',
            city: '湘潭',
            ip: '127.1.1.1',
            remark: '无',
          }
        ]
      }
    }
  },
  created() {
    //axios
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
      this.modal.title = '新增LED';
      this.modal.icon = 'plus-round';
      this.modal.visible.save = true;
    },
    modalEdit(index) {
      this.modal.title = '编辑LED';
      this.modal.icon = 'edit';
      const data = this.data.led[index];
      for (let key in this.form.save) {
        if (['factory','func','agency'].includes(key)) {
          this.form.save[key] = getOptionValue(this.list[key], data[key]);
        } else {
          this.form.save[key] = data[key];
        }
      }
      this.modal.visible.save = true;
    },
    modalDel(index) {
      this.modal.icon = 'trash-a';
      this.modal.title = '删除LED';
      const data = this.data.led[index];
      for (let key in this.form.save) {
        if (['id','led'].includes(key)) {
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
.card-check{
  background: #f0f5ff;
  margin-top: 16px;
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