<!-- 执勤管理 [1.2]-->
<template>
  <div id="attendance">
  	<Form ref="formQuery" inline :model="form.query" label-position="right" :label-width="80">
      <FormItem label="所在机构：">
        <Cascader 
    	  :data="list.agency" 
    	  v-model="form.query.agency" 
    	  change-on-select
    	  :render-format="label => label.pop()"
    	  style="width: 200px"
    	  placeholder="选择机构"></Cascader>
      </FormItem>
      <Button type="primary" @click="queryWork">查询</Button>
	</Form>
    <Card :bordered="false" class="card-out">
      <Tabs>
        <TabPane label="执勤管理" icon="eye">
          <Table :stripe="true" border :columns="columns.work" :data="data.work"></Table>
	      <div class="page" v-if="page.total.work===0?false:true">
            <div style="float: right">
              <Page 
                :total="page.total.work" 
                :current="page.current.work" 
                @on-change="workChange" 
                size="small"
                show-total
                no-data-text 
                show-elevator></Page>
            </div>
	      </div>
        </TabPane>
        <TabPane label="执勤记录" icon="search">
		  <Form inline label-position="right" :label-width="80">
		    <FormItem label="时间段：">
		      <DatePicker type="datetimerange" placeholder="选择时间段" style="width: 300px" v-model="form.query.date"></DatePicker>
		    </FormItem>
		    <Button type="primary" @click="queryRecord">查询</Button>
		  </Form>
          <Table :stripe="true" border :columns="columns.record" :data="data.record" size="small"></Table>
	      <div class="page" v-if="page.total.record===0?false:true">
            <div style="float: right">
              <Page 
                :total="page.total.record" 
                :current="page.current.record" 
                @on-change="recordChange" 
                size="small"
                show-total
                no-data-text 
                show-elevator></Page>
            </div>
	      </div>
        </TabPane>
      </Tabs>
	</Card>
	<Modal v-model="modal.visible.start" :width="1200" :mask-closable="false" @on-cancel="modalCloseStart">
      <p slot="header" class="modal-start">
        <Icon :type="modal.icon"></Icon>
        <span>&nbsp;{{ modal.title }}</span>
      </p>
      <div style="text-align: center">
        <Card class="card" :padding="0" dis-hover :bordered="false">
	      <div>
            <img :src="info.camera.img" style="width: 50%;height: 200px">
            <Form inline label-position="right" :label-width="90">
			  <FormItem label="摄像头编码：">{{ info.camera.number }}</FormItem>
			  <FormItem label="拍摄时间：">{{ info.camera.date }}</FormItem>
			</Form>
	      </div>
	      <Table class="table" border :columns="columns.bayonet" :data="data.bayonet" size="small"></Table>
	      <Table class="table" border :columns="columns.led" :data="data.led" size="small"></Table>
	    </Card>
      </div> 
      <div slot="footer" style="text-align: center">
        <Button type="primary" long @click="start">开始检查</Button>
      </div>
    </Modal>
    <Modal v-model="modal.visible.end" :width="1200" :mask-closable="false">
      <p slot="header" class="modal-end">
        <Icon type="eye"></Icon>
        <span>&nbsp;{{ modal.title }}</span>
      </p>
      <div style="text-align: center">
	    <Card class="card" :padding="0" dis-hover :bordered="false">
	      <div>
            <img :src="info.camera.img" style="width: 50%;height: 200px">
            <Form inline label-position="right" :label-width="90">
			  <FormItem label="摄像头编码：">{{ info.camera.number }}</FormItem>
			  <FormItem label="拍摄时间：">{{ info.camera.date }}</FormItem>
			</Form>
	      </div>
	      <Table class="table" border :columns="columns.bayonet" :data="data.bayonet" size="small"></Table>
	   	  <Table class="table" border :columns="columns.led" :data="data.led" size="small"></Table>
	    </Card>
      </div>
      <div slot="footer" style="text-align: center">
        <Button type="error" long @click="end">结束检查</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { formatDate } from '../../utils/date.js';
export default {
  name: 'attendance',
  data () {
    return {
    	form: {
    		query: {
    			agency: [],
    			date: [],
    		},
    	},
    	list: {
    		agency: [{
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
            }],
    	},
    	page: {
    		total: {
    			work: 0,
    			record: 0,
    		},
    		current: {
    			work: 1,
    			record: 1,
    		}
    	},
    	modal: {
    	  visible: {
    	  	start: false,
    	  	end: false,
    	  },
    	  title: '',
    	  icon: 'eye',
    	},
    	//检查点执勤对象
    	info: {
    		camera: {
    			img: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1199303746,2317860517&fm=27&gp=0.jpg',
    			date: '2018-04-04 16:37:25',
    			number: '075214',
    		}
    	},
        columns: {
        	work: [
		        {
		            title: '检查点名称',
		            key: 'check',
		            align: 'center',
		            sortable: true
		        },
		        {
		            title: '执勤人',
		            key: 'name',
		            align: 'center',
		            sortable: true
		        },
		        {
	                title: '状态',
	                key: 'status',
	                align: 'center',
	                render: (h, params) => {
	                    const row = params.row;
	                    const color = row.status === 1 ? 'green' : row.status === 2 ? 'gray' : 'red';
	                    const text = row.status === 1 ? '正在检查' : row.status === 2 ? '检查结束' : '异常';
	                    return h('Tag', {
	                        props: {
	                            type: 'dot',
	                            color: color
	                        }
	                    }, text);
	                }
	            },
		        {
		            title: '操作',
		            key: 'handle',
		            align: 'center',
		            width: 200,
		            render: (h, params) => {
		                return h('div', [
		                    h('Button', {
		                        props: {
		                            type: 'primary',
		                            size: 'small'
		                        },
		                        style: {
		                            marginRight: '10px'
		                        },
		                        on: {
		                            click: () => {
		                                this.modalStart(params.index)
		                            }
		                        }
		                    }, '准备检查'),
		                    h('Button', {
		                        props: {
		                            type: 'warning',
		                            size: 'small'
		                        },
		                        on: {
		                            click: () => {
		                                this.modalEnd(params.index)
		                            }
		                        }
		                    }, '结束检查')
		                ]);
		            }
		        }
		    ],
		    record: [
		        {
		            title: '检查点名称',
		            key: 'check',
		            align: 'center',
		        },
		        {
		            title: '所属机构',
		            key: 'agency',
		            align: 'center',
		        },
		        {
		            title: '执勤人',
		            key: 'name',
		            align: 'center',
		        },
		        {
		            title: '开始时间',
		            key: 'start',
		            align: 'center',
		        },
		        {
		            title: '结束时间',
		            key: 'end',
		            align: 'center',
		        },
		        {
		            title: '检查时长(h)',
		            key: 'time',
		            align: 'center',
		        }
		    ],
		    bayonet: [
		    	{
		            title: '卡口编号',
		            key: 'number',
		            align: 'center',
		        },
		        {
		            title: '卡口名称',
		            key: 'name',
		            align: 'center',
		            width: 300,
		        },
		        {
		            title: '作用类型',
		            key: 'type',
		            align: 'center',
		        },
		        {
		            title: '车道号',
		            key: 'road',
		            align: 'center',
		        },
		        {
		            title: '方向',
		            key: 'path',
		            align: 'center',
		        },
		        {
		            title: 'IP地址',
		            key: 'ip',
		            align: 'center',
		        },
		        {
		            title: 'IP是否在线',
		            key: 'online',
		            align: 'center',
		        }
		    ],
		    led: [
		    	{
		            title: '设备编号',
		            key: 'number',
		            align: 'center',
		        },
		        {
		            title: 'LED名称',
		            key: 'led',
		            align: 'center',
		            width: 300,
		        },
		        {
		            title: '作用类型',
		            key: 'type',
		            align: 'center',
		        },
		        {
		            title: '显示屏内容',
		            key: 'content',
		            align: 'center',
		            width: 350,
		        },
		        {
		            title: 'IP地址',
		            key: 'ip',
		            align: 'center',
		        },
		        {
		            title: 'IP是否在线',
		            key: 'online',
		            align: 'center',
		        }
		    ],
        },
	    data: {
	    	work: [
		        {
		        	id: '111',
		        	check: '水府检查点',
		            name: '李冰',
		            status: 1,
		            img: 'http://pic1.16pic.com/00/07/66/16pic_766152_b.jpg',
		        },
		        {
		        	id: '111',
		        	check: '水庙检查点',
		            name: '张冰',
		            status: 2,
		            img: 'http://pic1.16pic.com/00/07/66/16pic_766152_b.jpg',
		        },
		        {
		        	id: '111',
		        	check: '水府庙检查点',
		            name: '邓冰',
		            status: -1,
		            img: 'http://pic1.16pic.com/00/07/66/16pic_766152_b.jpg',
		        },
		        {
		        	id: '111',
		        	check: '庙检查点',
		            name: '胡冰',
		            status: 2,
		            img: 'http://pic1.16pic.com/00/07/66/16pic_766152_b.jpg',
		        }
		    ],
		    record: [
		        {
		        	id: '111',
		        	check: '水府庙检查点',
		        	agency: '湘潭支队',
		            name: '李冰',
		            start: '2018-3-29 16:27:00',
		            end: '2018-3-29 17:27:00',
		            time: '1'
		        },{
		        	id: '111',
		        	check: '水府庙检查点',
		        	agency: '湘潭支队',
		            name: '李冰',
		            start: '2018-3-29 16:27:00',
		            end: '2018-3-29 17:27:00',
		            time: '1'
		        },{
		        	id: '111',
		        	check: '水府庙检查点',
		        	agency: '湘潭支队',
		            name: '李冰',
		            start: '2018-3-29 16:27:00',
		            end: '2018-3-29 17:27:00',
		            time: '1'
		        },{
		        	id: '111',
		        	check: '水府庙检查点',
		        	agency: '湘潭支队',
		            name: '李冰',
		            start: '2018-3-29 16:27:00',
		            end: '2018-3-29 17:27:00',
		            time: '1'
		        }
		    ],
		    bayonet: [
		    	{
		    		number: '401274',
	    			name: '环长沙西高速公路39公里150米',
	    			type: '其他',
	    			road: '京珠高速',
	    			path: '上行',
	    			ip: '127.1.11',
	    			online: '在线',
		    	},
		    	{
		    		number: '401274',
	    			name: '环长沙西高速公路39公里150米',
	    			type: '其他',
	    			road: '京珠高速',
	    			path: '上行',
	    			ip: '127.1.11',
	    			online: '在线',
		    	}
		    ],
		    led: [
		    	{
	    			number: '4350623',
	    			led: '长沙西',
	    			type: '动态提醒',
	    			content: '两客一危车辆进站检查',
	    			ip: '127.1.1',
	    			online: '在线',
	    		},
	    		{
	    			number: '4350623',
	    			led: '长沙西',
	    			type: '动态提醒',
	    			content: '两客一危车辆进站检查',
	    			ip: '127.1.1',
	    			online: '在线',
	    		}
		    ],
	    }
    }
  },
  created() {
  	this.page.total.work = 90; 
  	this.page.total.record = 110; 
  },
  methods: {
  	//接口调用
  	queryWork() {
      this.agency.visible = false;
  	},
  	queryRecord() {
      this.form.date = formatDate(this.form.date);
  	},
  	start() {
      this.modal.visible.start = false;
  	},
  	end() {
  	  this.modal.visible.end = false;
  	},
  	workChange(val) {
  		
  	},
  	recordChange(val) {
  		
  	},
  	modalStart(index) {
  	  this.modal.title = '检查点数据信息';
  	  this.modal.visible.start = true;
  	},
  	modalEnd(index) {
  	  this.modal.title = '检查点数据信息';
  	  this.modal.visible.end = true;
  	},
  	//页面交互
  	modalCloseStart() {
  	  this.modal.visible.start = false;
  	}
  }
}
</script>

<style scoped>
.card-out{
  background: #f0f5ff;
}
.card{
  background: #f0f5ff;
  width: 1168px;
}
.page{
  margin: 10px;
  overflow: hidden;
  padding-bottom: 2px;
}
.modal-start{
  text-align: center;
  color: #1890ff;
}
.modal-end{
  text-align: center;
  color: #f60;
}
.table{
  margin-bottom: 20px;
}
</style>