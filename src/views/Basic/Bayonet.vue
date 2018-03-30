<!-- 卡口管理 -->
<template>
  <div id="bayonet">
  	<Select v-model="form.agency" filterable style="width:300px" placeholder="选择机构">
        <Option v-for="item in list.agency" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    <Button type="primary" @click="queryBayonet">查询</Button>
    <Card :bordered="false" class="card-box">
    	<p slot="title">
            <Icon type="disc"></Icon>
            &nbsp;卡口信息
        </p>
        <div slot="extra" class="card-box-extra">
            <Tooltip content="新增卡口" placement="top">
                <Button type="primary" icon="plus-round" @click="modalAdd"></Button>
            </Tooltip>
        </div>
	    <Table highlight-row :stripe="true" :columns="columnsBayonet" :data="dataBayonet"></Table>
        <div class="card-box-page" v-if="dataBayonet.length===0?false:true">
            <div style="float: right;">
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
	<Modal v-model="modal.visible.save" width="900" :mask-closable="false" @on-cancel="modalCloseSave">
        <p slot="header" class="modal-header-info">
            <Icon type="disc"></Icon>
            <span>&nbsp;{{modal.title}}</span>
        </p>
        <div>
            <Form ref="formBayonet" inline :model="formBayonet" :rules="ruleBayonet" label-position="right" :label-width="100">
                <FormItem label="卡口名称：" prop="name">
                    <Input v-model.trim="formBayonet.name" placeholder="输入卡口名称"></Input>
                </FormItem>
                <FormItem label="所属机构：" prop="agency">
                    <Select v-model="formBayonet.agency" class="form-width" placeholder="选择所属机构">
				        <Option v-for="item in list.agency" :label="item.label" :value="item.value" :key="item.value">{{ item.label }}</Option>
				    </Select>
                </FormItem>
                <FormItem label="卡口图片：" prop="img">
                    <Input v-model.trim="formBayonet.img" placeholder="输入卡口图片地址"></Input>
                </FormItem>
                <FormItem label="设备类型：" prop="device">
                    <Select v-model="formBayonet.device" class="form-width" placeholder="选择设备类型">
				        <Option v-for="item in list.device" :value="item.value" :key="item.value">{{ item.label }}</Option>
				    </Select>
                </FormItem>
                <FormItem label="标注状态：" prop="callout">
                    <Select v-model="formBayonet.callout" class="form-width" placeholder="选择标注状态">
				        <Option v-for="item in list.callout" :value="item.value" :key="item.value">{{ item.label }}</Option>
				    </Select>
                </FormItem>
                <FormItem label="卡口厂家：" prop="factory">
                    <Select v-model="formBayonet.factory" class="form-width" placeholder="选择卡口厂家">
				        <Option v-for="item in list.factory" :value="item.value" :key="item.value">{{ item.label }}</Option>
				    </Select>
                </FormItem>
                <FormItem label="卡口类型：" prop="bayonet">
                    <Select v-model="formBayonet.bayonet" class="form-width" placeholder="选择卡口类型">
				        <Option v-for="item in list.bayonet" :value="item.value" :key="item.value">{{ item.label }}</Option>
				    </Select>
                </FormItem>
                <FormItem label="设备状态：" prop="status">
                    <Select v-model="formBayonet.status" class="form-width" placeholder="选择设备状态">
				        <Option v-for="item in list.status" :value="item.value" :key="item.value">{{ item.label }}</Option>
				    </Select>
                </FormItem>
                <FormItem label="布设范围：" prop="range">
                    <Select v-model="formBayonet.range" class="form-width" placeholder="选择布设范围">
				        <Option v-for="item in list.range" :value="item.value" :key="item.value">{{ item.label }}</Option>
				    </Select>
                </FormItem>
                <FormItem label="所属辖区：" prop="area">
                    <Input v-model.trim="formBayonet.area" placeholder="输入所属辖区"></Input>
                </FormItem>
                <FormItem label="卡口作用：" prop="effect">
                    <Input v-model="formBayonet.effect" placeholder="输入卡口作用"></Input>
                </FormItem>
                <FormItem label="所属道路：" prop="road">
                    <Input v-model.trim="formBayonet.road" placeholder="输入所属道路"></Input>
                </FormItem>
                <FormItem label="地点描述：" prop="remark">
                    <Input v-model="formBayonet.remark" :autosize="true" class="form-width" type="textarea" placeholder="输入地点描述"></Input>
                </FormItem>
                <FormItem label="交接地市：" prop="city">
                    <Input v-model.trim="formBayonet.city" placeholder="输入交接地市"></Input>
                </FormItem>
                <FormItem label="设备编号：" prop="deviceID">
                    <Input v-model.trim="formBayonet.deviceID" placeholder="输入设备编号"></Input>
                </FormItem>
            </Form> 
        </div> 
        <div slot="footer" style="text-align:center">
            <Button type="primary" @click="saveBayonet">保存</Button>
            <Button type="ghost" style="margin-left: 10px" @click="reset">重置</Button>
        </div>
    </Modal>
    <Modal v-model="modal.visible.del" width="360" :mask-closable="false">
        <p slot="header" class="modal-header-error">
            <Icon type="information-circled"></Icon>
            <span>&nbsp;{{modal.title}}</span>
        </p>
        <div style="text-align:center">
            <p>确认删除该卡口？</p>
        </div>
        <div slot="footer">
            <Button type="error" long @click="delBayonet">删 除</Button>
        </div>
    </Modal>
  </div>
</template>

<script>
import bayonetRow from '../../components/Table/TableBayonet.vue'
import { getOptionValue } from '../../utils/component.js'
export default {
  name: 'bayonet',
  components: { bayonetRow },
  data () {
    return {
        form: {
      		agency: ''
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
			//标注状态
			callout: [
				{
			        value: '1',
			        label: '已标注'
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
			//布设范围
			range: [
				{
			        value: '1',
			        label: '二环内'
			    }
			]
		},
		page: {
			total: 0,
			current: 1
		},
		modal: {
			title: '',
			visible: {
				save: false,
				del: false
			}
		},
		formBayonet: {
			name: '',//卡口名称
			agency: '',//所属机构
			img: '',//卡口图片
			device: '',//设备类型
			callout: '',//标注状态
			factory: '',//卡口厂家
			bayonet: '',//卡口类型
			status: '',//设备状态
			range: '',//布设范围
			area: '',//所属辖区
			effect: '',//卡口作用
			road: '',//所属道路
			remark: '',//地点描述
			city: '',//交接地市
			deviceID: ''//设备编号
		},
		ruleBayonet: {
			name: [
                { required: true, message: '卡口名称不能为空', trigger: 'blur' }
            ],
            agency: [
                { required: true, message: '请选择所属部门', trigger: 'change' }
            ],
            img: [
                { required: true, message: '图片地址不能为空', trigger: 'blur' }
            ],
            device: [
                { required: true, message: '请选择设备类型', trigger: 'change' }
            ],
            callout: [
                { required: true, message: '请选择标注状态', trigger: 'change' }
            ],
            factory: [
                { required: true, message: '请选择卡口厂家', trigger: 'change' }
            ],
            bayonet: [
                { required: true, message: '请选择卡口类型', trigger: 'change' }
            ],
            status: [
                { required: true, message: '请选择设备状态', trigger: 'change' }
            ],
            range: [
                { required: true, message: '请选择布设范围', trigger: 'change' }
            ]
		},
	    columnsBayonet: [
	        {
	            type: 'expand',
	            width: 50,
	            render: (h, params) => {
	                return h(bayonetRow, {
	                    props: {
	                        row: params.row
	                    }
	                })
	            }
	        },
	        {
	            title: '卡口名称',
	            key: 'name',
	            width: 280,
	            sortable: true
	        },
	        {
	            title: '所属机构',
	            key: 'agency'
	        },
	        {
	            title: '设备类型',
	            key: 'device'
	        },
	        {
	            title: '标注状态',
	            key: 'callout'
	        },
	        {
	            title: '卡口厂家',
	            key: 'factory'
	        },
	        {
	            title: '卡口类型',
	            key: 'bayonet'
	        },
	        {
	            title: '设备状态',
	            key: 'status'
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
		dataBayonet: [
		  	{
		  		name: '环李家塘收费站绕城高速40公里52米',
		  		agency: '长沙支队',
		  		device: '电子警察',
		  		callout: '已标注',
		  		factory: '全部',
		  		bayonet: '二类卡口',
		  		status: '通讯正常',
		  		range: '二环内',
		  		area: '长沙支队',
		  		effect: '记录过往车辆',
		  		road: '京港澳高速公路',
		  		city: '长沙市',
		  		deviceID: '431500100027'
		  	},{
		  		name: '长沙塘收费站绕城高速40公里52米',
		  		agency: '长沙支队',
		  		device: '电子警察',
		  		callout: '已标注',
		  		factory: '全部',
		  		bayonet: '二类卡口',
		  		status: '通讯正常',
		  		range: '二环内',
		  		area: '长沙支队',
		  		effect: '记录过往车辆',
		  		road: '京港澳高速公路',
		  		city: '长沙市',
		  		deviceID: '431500100027'
		  	},{
		  		name: '株洲家塘收费站绕城高速40公里52米',
		  		agency: '株洲支队',
		  		device: '电子警察',
		  		callout: '已标注',
		  		factory: '全部',
		  		bayonet: '二类卡口',
		  		status: '通讯正常',
		  		range: '二环内',
		  		area: '长沙支队',
		  		effect: '记录过往车辆',
		  		road: '京港澳高速公路',
		  		city: '长沙市',
		  		deviceID: '431500100027'
		  	},{
		  		name: '郴州收费站绕城高速40公里52米',
		  		agency: '郴州支队',
		  		device: '电子警察',
		  		callout: '已标注',
		  		factory: '全部',
		  		bayonet: '二类卡口',
		  		status: '通讯正常',
		  		range: '二环内',
		  		area: '长沙支队',
		  		effect: '记录过往车辆',
		  		road: '京港澳高速公路',
		  		city: '长沙市',
		  		deviceID: '431500100027'
		  	}
		]
    }
  },
  created() {
  	//axios
  	this.page.total = this.dataBayonet.length;
  },
  methods: {
  	//util方法 formBayonet赋值
  	setFormBayonet(index) {
  		const data = this.dataBayonet[index];
  		const list = ['agency','device','callout','factory','bayonet','status','range'];
  		for (let key in this.formBayonet) {
		  if (list.includes(key)) {
		    this.formBayonet[key] = getOptionValue(this.list[key], data[key]);
		  } else {
		  	this.formBayonet[key] = data[key];
		  }
		}
  	},
	queryBayonet() {
		//axios
	},
	modalAdd() {
		this.modal.title = "新增卡口";
		this.modal.visible.save = true;
	},
	modalEdit(index) {
		this.modal.title = "编辑卡口";
		this.setFormBayonet(index);
		this.modal.visible.save = true;
	},
	modalDel(index) {
		this.setFormBayonet(index);
		this.modal.title = this.formBayonet.name;
		this.modal.visible.del = true;
	},
	pageChange() {
		//axios
	},
	modalCloseSave() {
		this.$refs['formBayonet'].resetFields();
		this.modal.visible.save = false;
		this.$Message.warning('修改已撤销！');
	},
	saveBayonet() {
		this.$refs['formBayonet'].validate((valid) => {
            if (valid) {
            	//axios
                this.modal.visible.save = false;
		        this.$Message.success('保存成功！');
            } else {
                this.$Message.error('提交失败！');
            }
        })
	},
	reset() {
		this.$refs['formBayonet'].resetFields();
	},
	delBayonet() {
		//axios
		this.modal.visible.del = false;
		this.$refs['formBayonet'].resetFields();
		this.$Message.success('删除成功！');
	}
  } 
}
</script>

<style scoped>
.card-box{
    margin-top: 20px;
    background: #e8e8e8;
}
.card-box-extra{
    margin-top: -5px;
}
.card-box-page{
	margin: 10px;
	overflow: hidden;
	padding-bottom: 2px;
}
.modal-header-info{
	color: #1890ff;
    text-align: center;
}
.modal-header-error{
    color: #f60;
    text-align: center;
}
/*biao*/
.form-width{
	width: 160px;
}
</style>