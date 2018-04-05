<!-- 卡口管理 [1.2]-->
<template>
  <div id="bayonet">
  	<Form ref="formQuery" inline :model="form.query" label-position="right" :label-width="80">
      <FormItem label="机构名称：" prop="code">
        <Select v-model="form.query.agency" filterable placeholder="选择机构">
	      <Option v-for="item in list.agency" :value="item.value" :key="item.value">{{ item.label }}</Option>
	    </Select>
      </FormItem>
	  <FormItem label="卡口名称：" prop="name">
	    <Input v-model.trim="form.query.name" placeholder="输入卡口名称"></Input>
	  </FormItem>
	  <FormItem label="卡口编码：" prop="code">
	    <Input v-model.trim="form.query.code" placeholder="输入卡口编码"></Input>
	  </FormItem>
	 <Button type="primary" @click="query">查询</Button>
  	</Form>
  	<Card :bordered="false" class="card">
      <p slot="title">
        <Icon type="disc"></Icon>
        &nbsp;卡口信息
      </p>
      <div slot="extra">
        <Button type="primary" icon="plus-round" @click="modalAdd">新增</Button>
      </div>
      <Table highlight-row border :stripe="true" :columns="columns.bayonet" :data="data.bayonet" size="small"></Table>
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
	<Modal v-model="modal.visible.save" :width="1200" :mask-closable="false" @on-cancel="modalCloseSave(modal.form)">
      <p slot="header">
        <Icon :type="modal.icon"></Icon>
        <span>&nbsp;{{modal.title}}</span>
      </p>
      <div>
        <Card :bordered="false" class="card" dis-hover>
          <p slot="title">&nbsp;卡口信息</p>
		  <Form ref="formSave" inline :model="form.save" label-position="right" :label-width="100">
		    <FormItem label="卡口名称：" prop="name">
		      <Input v-model.trim="form.save.name" placeholder="输入卡口名称"></Input>
		    </FormItem>
		    <FormItem label="卡口编码：" prop="code">
		      <Input v-model.trim="form.save.code" placeholder="输入卡口编码"></Input>
		    </FormItem>
		    <FormItem label="所属机构：" prop="agency">
		      <Select v-model="form.save.agency" class="select" placeholder="选择所属机构">
				<Option v-for="item in list.agency" :value="item.value" :key="item.value">{{ item.label }}</Option>
			  </Select>
		    </FormItem>
		    <FormItem label="设备类型：" prop="device">
		      <Select v-model="form.save.device" class="select" placeholder="选择设备类型">
				<Option v-for="item in list.device" :value="item.value" :key="item.value">{{ item.label }}</Option>
			  </Select>
		    </FormItem>
		    <FormItem label="卡口厂家：" prop="factory">
		      <Select v-model="form.save.factory" class="select" placeholder="选择卡口厂家">
				<Option v-for="item in list.factory" :value="item.value" :key="item.value">{{ item.label }}</Option>
			  </Select>
		    </FormItem>
		    <FormItem label="卡口类型：" prop="bayonet">
		      <Select v-model="form.save.bayonet" class="select" placeholder="选择卡口类型">
				<Option v-for="item in list.bayonet" :value="item.value" :key="item.value">{{ item.label }}</Option>
			  </Select>
		    </FormItem>
		    <FormItem label="设备状态：" prop="status">
		      <Select v-model="form.save.status" class="select" placeholder="选择设备状态">
				<Option v-for="item in list.status" :value="item.value" :key="item.value">{{ item.label }}</Option>
			  </Select>
		    </FormItem>
		    <FormItem label="所属辖区：" prop="area">
		      <Input v-model.trim="form.save.area" placeholder="输入所属辖区"></Input>
		    </FormItem>
		    <FormItem label="卡口作用：" prop="effect">
		      <Input v-model="form.save.effect" placeholder="输入卡口作用"></Input>
		    </FormItem>
		    <FormItem label="作用类型：" prop="type">
		      <Select v-model="form.save.type" class="select" placeholder="选择卡口作用类型">
				<Option v-for="item in list.type" :value="item.value" :key="item.value">{{ item.label }}</Option>
			  </Select>
		    </FormItem>
		    <FormItem label="所属道路：" prop="road">
              <Input v-model.trim="form.save.road" placeholder="输入所属道路"></Input>
		    </FormItem>
		    <FormItem label="交接地市：" prop="city">
              <Input v-model.trim="form.save.city" placeholder="输入交接地市"></Input>
		    </FormItem>
		    <FormItem label="设备编号：" prop="deviceID">
              <Input v-model.trim="form.save.deviceID" placeholder="输入设备编号"></Input>
		    </FormItem>
		    <FormItem label="地点描述：" prop="remark">
              <Input v-model="form.save.remark" type="textarea" class="textarea" :autosize="true"  placeholder="输入地点描述"></Input>
		    </FormItem>
		  </Form> 
		</Card>
		<Card :bordered="false" class="card-lane" dis-hover>
	      <p slot="title">&nbsp;车道信息</p>
	      <Table highlight-row :stripe="true" :columns="columns.lane" :data="data.lane" size="small"></Table>
	      <br>
	      <Form ref="formLane" inline :model="form.lane" label-position="right" :label-width="80">
			<FormItem label="车道号：" prop="lane">
			  <Input v-model.trim="form.lane.lane" placeholder="输入车道号"></Input>
			</FormItem>
			<FormItem label="集指方向：" prop="path">
			  <Input v-model.trim="form.lane.path" placeholder="输入集指方向类型"></Input>
			</FormItem>
			<FormItem label="IP地址：" prop="ip">
			  <Input v-model.trim="form.lane.ip" placeholder="输入IP地址"></Input>
			</FormItem>
			<FormItem label="卡口方向：" prop="type">
			  <Input v-model.trim="form.lane.type" placeholder="输入卡口方向类型"></Input>
			</FormItem>
			<Button type="primary" icon="plus-round" @click="laneSave">增加</Button>
		  </Form>
		</Card>
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
        <p>卡口&nbsp;&nbsp;<strong style="color: #f60">{{ form.save.name }}</strong>&nbsp;&nbsp;删除后，将无法恢复！</p>
        <p>是否继续删除？</p>
      </div>
      <div slot="footer">
        <Button type="error" long @click="del">删 除</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getOptionValue } from '../../utils/component.js';
export default {
  name: 'bayonet',
  data () {
    return {
        form: {
        	//卡口查询
      		query: {
      			agency: '',//卡口value
      			name: '',//卡口名称
      			code: '',//卡口编码
      		},
      		//卡口增加，编辑
      		save: {
      			id: '',
      			name: '',//卡口名称
      			code: '',//卡口编码
				agency: '',//所属机构
				device: '',//设备类型
				factory: '',//卡口厂家
				bayonet: '',//卡口类型
				status: '',//设备状态
				area: '',//所属辖区
				effect: '',//卡口作用
				type: '',//卡口作用类型
				road: '',//所属道路
				remark: '',//地点描述
				city: '',//交接地市
				deviceID: '',//设备编号
				lane: [],//车道号数组
      		},
      		//车道信息
      		lane: {
      			id: '',
      			lane: '',//车道号
      			path: '',//集指方向类型
      			ip: '',//IP地址
      			type: '',//道路方向类型
      		}
      	},
		list: {
			//机构
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
			//设备类型
			device: [
				{
			        value: '1',
			        label: '电子警察'
			    }
			],
			//卡口厂家
			factory: [
				{
			        value: '1',
			        label: '全部'
			    }
			],
			//卡口类型
			bayonet: [
				{
			        value: '1',
			        label: '二类卡口'
			    }
			],
			//设备状态
			status: [
				{
			        value: '1',
			        label: '通讯正常'
			    }
			],
			//卡口作用类型
			type: [
				{
			        value: '1',
			        label: '检测'
			    }
			]
		},
		page: {
			total: 0,
			current: 1
		},
		modal: {
			visible: {
				save: false,
				del: false,
			},
			title: '',
			icon: '',
			form: 'formSave',
		},
	    columns: {
	    	bayonet: [
		        {
		            title: '卡口名称',
		            key: 'name',
		            width: 280,
		            sortable: true,
		            align: 'center',
		        },
		        {
		            title: '所属机构',
		            key: 'agency',
		            align: 'center',
		        },
		        {
		            title: '设备类型',
		            key: 'device',
		            align: 'center',
		        },
		        {
		            title: '卡口厂家',
		            key: 'factory',
		            align: 'center',
		        },
		        {
		            title: '卡口类型',
		            key: 'bayonet',
		            align: 'center',
		        },
		        {
		            title: '设备状态',
		            key: 'status',
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
		    lane: [
		        {
		            title: '车道号',
		            key: 'lane',
		            align: 'center',
		        },
		        {
		            title: '集指方向类型类型',
		            key: 'path',
		            align: 'center',
		        },
		        {
		            title: 'IP地址',
		            key: 'ip',
		            align: 'center',
		        },
		        {
		            title: '卡口方向类型',
		            key: 'type',
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
		                            type: 'warning',
		                            size: 'small'
		                        },
		                        on: {
		                            click: () => {
		                                this.laneDel(params.index)
		                            }
		                        }
		                    }, '删除')
		                ]);
		            }
		        }
		    ],
	    },
		data: {
			bayonet: [
				{
					id: '111',
	      			name: '环李家塘收费站绕城高速40公里52米',
	      			code: '123321',
					agency: '长沙支队',
					device: '电子警察',
					factory: '全部',
					bayonet: '二类卡口',
					status: '通讯正常',
					area: '长沙支队',
					effect: '记录过往车辆',
					type: '1',
					road: '京港澳高速公路',
					remark: '长沙市的地方噶',
					city: '长沙市',
					deviceID: '431500100027',
					lane: [],
				},
			  	{
					id: '111',
	      			name: '环李家塘收费站绕城高速40公里52米',
	      			code: '123321',
					agency: '长沙支队',
					device: '电子警察',
					factory: '全部',
					bayonet: '二类卡口',
					status: '通讯正常',
					area: '长沙支队',
					effect: '记录过往车辆',
					type: '1',
					road: '京港澳高速公路',
					remark: '长沙市的地方噶',
					city: '长沙市',
					deviceID: '431500100027',
					lane: [],
				},
			  	{
					id: '111',
	      			name: '环李家塘收费站绕城高速40公里52米',
	      			code: '123321',
					agency: '长沙支队',
					device: '电子警察',
					factory: '全部',
					bayonet: '二类卡口',
					status: '通讯正常',
					area: '长沙支队',
					effect: '记录过往车辆',
					type: '1',
					road: '京港澳高速公路',
					remark: '长沙市的地方噶',
					city: '长沙市',
					deviceID: '431500100027',
					lane: [],
				},
			  	{
					id: '111',
	      			name: '环李家塘收费站绕城高速40公里52米',
	      			code: '123321',
					agency: '长沙支队',
					device: '电子警察',
					factory: '全部',
					bayonet: '二类卡口',
					status: '通讯正常',
					area: '长沙支队',
					effect: '记录过往车辆',
					type: '1',
					road: '京港澳高速公路',
					remark: '长沙市的地方噶',
					city: '长沙市',
					deviceID: '431500100027',
					lane: [],
				},
			  	{
					id: '111',
	      			name: '环李家塘收费站绕城高速40公里52米',
	      			code: '123321',
					agency: '长沙支队',
					device: '电子警察',
					factory: '全部',
					bayonet: '二类卡口',
					status: '通讯正常',
					area: '长沙支队',
					effect: '记录过往车辆',
					type: '1',
					road: '京港澳高速公路',
					remark: '长沙市的地方噶',
					city: '长沙市',
					deviceID: '431500100027',
					lane: [],
				},
			  	{
					id: '111',
	      			name: '环李家塘收费站绕城高速40公里52米',
	      			code: '123321',
					agency: '长沙支队',
					device: '电子警察',
					factory: '全部',
					bayonet: '二类卡口',
					status: '通讯正常',
					area: '长沙支队',
					effect: '记录过往车辆',
					type: '1',
					road: '京港澳高速公路',
					remark: '长沙市的地方噶',
					city: '长沙市',
					deviceID: '431500100027',
					lane: [],
				},
			  	{
					id: '111',
	      			name: '环李家塘收费站绕城高速40公里52米',
	      			code: '123321',
					agency: '长沙支队',
					device: '电子警察',
					factory: '全部',
					bayonet: '二类卡口',
					status: '通讯正常',
					area: '长沙支队',
					effect: '记录过往车辆',
					type: '1',
					road: '京港澳高速公路',
					remark: '长沙市的地方噶',
					city: '长沙市',
					deviceID: '431500100027',
					lane: [],
				},
			  	{
					id: '111',
	      			name: '环李家塘收费站绕城高速40公里52米',
	      			code: '123321',
					agency: '长沙支队',
					device: '电子警察',
					factory: '全部',
					bayonet: '二类卡口',
					status: '通讯正常',
					area: '长沙支队',
					effect: '记录过往车辆',
					type: '1',
					road: '京港澳高速公路',
					remark: '长沙市的地方噶',
					city: '长沙市',
					deviceID: '431500100027',
					lane: [],
				},
			  	{
					id: '111',
	      			name: '环李家塘收费站绕城高速40公里52米',
	      			code: '123321',
					agency: '长沙支队',
					device: '电子警察',
					factory: '全部',
					bayonet: '二类卡口',
					status: '通讯正常',
					area: '长沙支队',
					effect: '记录过往车辆',
					type: '1',
					road: '京港澳高速公路',
					remark: '长沙市的地方噶',
					city: '长沙市',
					deviceID: '431500100027',
					lane: [],
				},
			  	{
					id: '111',
	      			name: '环李家塘收费站绕城高速40公里52米',
	      			code: '123321',
					agency: '长沙支队',
					device: '电子警察',
					factory: '全部',
					bayonet: '二类卡口',
					status: '通讯正常',
					area: '长沙支队',
					effect: '记录过往车辆',
					type: '1',
					road: '京港澳高速公路',
					remark: '长沙市的地方噶',
					city: '长沙市',
					deviceID: '431500100027',
					lane: [],
				}
			],
			lane: [
				{
					id: '111',
					lane: '8',
					path: '上行',
					ip: '127.1.1',
					type: '由南向北',
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
	pageChange() {

	},
	save(name) {
	  this.form.save.lane = this.data.lane;
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
		this.modal.visible.del = false;
		this.$Message.success('删除成功！');
	},
    modalEdit(index) {
	  this.modal.title = "编辑卡口";
	  this.modal.icon = "edit";
	  const data = this.data.bayonet[index];
      for (let key in this.form.save) {
        if (['agency','device','factory','bayonet','status'].includes(key)) {
          this.form.save[key] = getOptionValue(this.list[key], data[key]);
        } else {
          this.form.save[key] = data[key];
        }
      }
	  this.modal.visible.save = true;
	},
	//页面交互
	modalAdd() {
	  this.modal.title = "新增卡口";
	  this.modal.icon = "plus-round";
	  this.data.lane = [];
	  this.modal.visible.save = true;
	},
	modalDel(index) {
	  this.modal.title = '删除卡口';
	  this.modal.icon = 'trash-a';
      const data = this.data.bayonet[index];
      for (let key in this.form.save) {
        if (['id','name'].includes(key)) {
          this.form.save[key] = data[key];
        }
      }
	  this.modal.visible.del = true;
	},
	modalCloseSave(name) {
	  this.$refs[name].resetFields();
	  this.$refs['formLane'].resetFields();
	  this.data.lane = [];
	  this.modal.visible.save = false;
	  this.$Message.warning('修改已撤销！');
	},
	reset(name) {
	  this.$refs[name].resetFields();
	  this.$refs['formLane'].resetFields();
	  this.data.lane = [];
	},
	laneDel(index) {
	  this.data.lane.splice(index);
	},
	laneSave() {
	  let data = {
		id: '',
		lane: this.form.lane.lane,
		path: this.form.lane.path,
		ip: this.form.lane.ip,
		type: this.form.lane.type,
	  }
	  this.data.lane.push(data);
	  this.form.lane = {
		id: '',
		lane: '',
		path: '',
		ip: '',
		type: '',
	  }
	}
  } 
}
</script>

<style scoped>
.card{
  background: #f0f5ff;
}
.card-lane{
  background: #f0f5ff;
  margin-top: 5px;
}
.page{
  margin: 10px;
  overflow: hidden;
  padding-bottom: 2px;
}
.modal-del-title{
  color: #f60;
}
/*表单*/
.select{
  width: 162px;
}
.textarea{
  width: 439px;
}
</style>