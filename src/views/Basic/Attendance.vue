<!-- 执勤管理 -->
<template>
  <div id="attendance">
  	<Poptip v-model="agency.visible" placement="bottom-start" width="300">
  		<Button type="primary" shape="circle" icon="flag">{{ agency.label }}</Button>
	    <div slot="content">
	      <div style="float:right">
	        <Button type="primary" shape="circle" size="small" @click="queryWork">确定</Button>
	      </div>
	      <Tree 
	        ref="agencyTree" 
	        :data="agency.list"  
	        @on-select-change="agencySelect"></Tree>
	    </div>
	</Poptip>
    <Card :bordered="false" class="card-box">
	    <Tabs>
	        <TabPane label="执勤管理" icon="eye">
	        	<Table :stripe="true" border :columns="columnsWork" :data="dataWork"></Table>
		        <div class="card-box-page" v-if="dataWork.length===0?false:true">
		            <div style="float: right;">
		                <Page 
		                    :total="page.work.total" 
		                    :current="page.work.current" 
		                    @on-change="workChange" 
		                    size="small"
		                    show-total
		                    no-data-text 
		                    show-elevator></Page>
		            </div>
		        </div>
	        </TabPane>
	        <TabPane label="执勤记录" icon="search">
	        	<div class="input-first">
			        <DatePicker format="yyyy/MM/dd HH:mm:ss" type="datetimerange" placeholder="选择时间段" style="width: 300px" v-model="form.date"></DatePicker> 
			        <Button style="margin-left:10px" type="primary" shape="circle" icon="search" @click="queryRecord">查询</Button>
			    </div>
	        	<Table :stripe="true" border :columns="columnsRecord" :data="dataRecord"></Table>
		        <div class="card-box-page" v-if="dataRecord.length===0?false:true">
		            <div style="float: right;">
		                <Page 
		                    :total="page.record.total" 
		                    :current="page.record.current" 
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
	<Modal v-model="modal.visible.start" width="700" :mask-closable="false" @on-cancel="modalCloseStart">
        <p slot="header" class="modal-header-info">
            <Icon type="eye"></Icon>
            <span>&nbsp;{{modal.title}}</span>
        </p>
        <div class="modal-content">
            <Card style="width:630px" :padding="0">
		        <div style="text-align:center">
		            <img :src="work.img" style="width: 630px">
		            <h3 style="padding-bottom:10px">{{ work.check }}</h3>
		        </div>
		    </Card>
        </div> 
        <div slot="footer" style="text-align:center">
            <Button type="primary" shape="circle" @click="startAttendance">开始检查</Button>
        </div>
    </Modal>
    <Modal v-model="modal.visible.end" width="360" :mask-closable="false">
        <p slot="header" class="modal-header-error">
            <Icon type="information-circled"></Icon>
            <span>&nbsp;{{modal.title}}</span>
        </p>
        <div style="text-align:center">
            <p>是否结束检查？</p>
        </div>
        <div slot="footer">
            <Button type="error" size="large" long @click="endAttendance">结束</Button>
        </div>
    </Modal>
  </div>
</template>

<script>
import { formatDate } from '../../utils/date.js'
export default {
  name: 'attendance',
  data () {
    return {
    	form: {
    		agency: '',
    		date: []
    	},
    	agency: {
    		visible: false,
    		label: '请选择所在机构',
    		list: [{
	                title: '湖南省高速公路交通管理局',
	                value: '001',
	                expand: true
	            },{
	                title: '长沙支队',
	                value: '002',
	                expand: true,
	                children: [{
	                    title: '星沙支队',
	                    value: '003'
	                },{
	                    title: '浏阳支队',
	                    value: '004',
	                    
	                },{
	                    title: '道林支队',
	                    value: '005'
	                }]
	            },{
	                title: '株洲支队',
	                value: '006',
	                expand: true,
	                children: [{
	                    title: '天元支队',
	                    value: '007'
	                },{
	                    title: '荷塘支队',
	                    value: '008'
	                }]
            }]
    	},
    	page: {
    		work: {
    			total: 0,
    			current: 1
    		},
    		record: {
    			total: 0,
    			current: 1
    		}
    	},
    	modal: {
    	  visible: {
    	  	start: false,
    	  	end: false,
    	  },
    	  title: ''
    	},
    	work: {
    		check: '',
    		name: '',
    		status: '',
    		img: ''
    	},
        columnsWork: [
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
	                    }, '开始检查'),
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
	    dataWork: [
	        {
	        	check: '水府检查点',
	            name: '李冰',
	            status: 1,
	            img: 'http://pic1.16pic.com/00/07/66/16pic_766152_b.jpg'
	        },
	        {
	        	check: '水庙检查点',
	            name: '张冰',
	            status: 2,
	            img: 'http://pic1.16pic.com/00/07/66/16pic_766152_b.jpg'
	        },
	        {
	        	check: '水府庙检查点',
	            name: '邓冰',
	            status: -1,
	            img: 'http://pic1.16pic.com/00/07/66/16pic_766152_b.jpg'
	        },
	        {
	        	check: '庙检查点',
	            name: '胡冰',
	            status: 2,
	            img: 'http://pic1.16pic.com/00/07/66/16pic_766152_b.jpg'
	        }
	    ],
	    columnsRecord: [
	        {
	            title: '检查点名称',
	            key: 'check',
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
	            title: '执勤人',
	            key: 'name',
	            align: 'center',
	            sortable: true
	        },
	        {
	            title: '开始时间',
	            key: 'start',
	            align: 'center',
	            sortable: true
	        },
	        {
	            title: '结束时间',
	            key: 'end',
	            align: 'center',
	            sortable: true
	        },
	        {
	            title: '检查时长(h)',
	            key: 'time',
	            align: 'center',
	            sortable: true
	        }
	    ],
	    dataRecord: [
	        {
	        	check: '水府庙检查点',
	        	agency: '湘潭支队',
	            name: '李冰',
	            start: '2018-3-29 16:27:00',
	            end: '2018-3-29 17:27:00',
	            time: '1'
	        },{
	        	check: '水府庙检查点',
	        	agency: '湘潭支队',
	            name: '李冰',
	            start: '2018-3-29 16:27:00',
	            end: '2018-3-29 17:27:00',
	            time: '1'
	        },{
	        	check: '水府庙检查点',
	        	agency: '湘潭支队',
	            name: '李冰',
	            start: '2018-3-29 16:27:00',
	            end: '2018-3-29 17:27:00',
	            time: '1'
	        },{
	        	check: '水府庙检查点',
	        	agency: '湘潭支队',
	            name: '李冰',
	            start: '2018-3-29 16:27:00',
	            end: '2018-3-29 17:27:00',
	            time: '1'
	        }
	    ],
    }
  },
  created() {
  	this.page.work.total = this.dataWork.length; 
  	this.page.record.total = this.dataRecord.length; 
  },
  methods: {
  	queryWork() {
  		this.agency.visible = false;
  		console.log(this.$refs.agencyTree.getSelectedNodes());
  		//axios
  	},
  	queryRecord() {
  		//axios
  		
        this.form.date = formatDate(this.form.date);
        console.log(this.form.date);

  	},
  	agencySelect() {
  		let select = this.$refs.agencyTree.getSelectedNodes();
  		if (select.length !== 0) {
  			this.agency.label = select[0].title;
  		} else {
  			this.agency.label = '请选择所在机构';
  		}
  	},
  	modalStart(index) {
  		this.modal.title = '检查点数据信息';
  		this.work = this.dataWork[index];
  		this.modal.visible.start = true;
  	},
  	modalEnd(index) {
  		this.modal.title = '检查点数据信息';
  		this.modal.visible.end = true;
  	},
  	modalCloseStart() {
  		this.modal.visible.start = false;
  	},
  	startAttendance() {
  		this.modal.visible.start = false;
  	},
  	endAttendance() {
  		this.modal.visible.end = false;
  	},
  	workChange(val) {

  	},
  	recordChange(val) {

  	}
  }
}
</script>

<style scoped>
.card-box{
    margin-top: 20px;
    background: #e8e8e8;
}
.card-box-page{
	margin: 10px;
	overflow: hidden;
	padding-bottom: 2px;
}
.input-first{
	margin-bottom: 16px;
}
.modal-header-info{
	color: #1890ff;
	text-align: center;
}
.modal-header-error{
	color: #f60;
	text-align: center;
}
.modal-content{
	padding-left: 20px;
	padding-right: 40px;
} 
</style>