<!-- 外省过车查询 -->
<template>
  <div id="outland">
    <Form :model="formCarQuery" label-position="right" :label-width="80" inline>
      <Row>
        <Col span="7">
          <FormItem label="时间段：">
            <DatePicker type="datetimerange" placeholder="选择时间段" style="width: 300px" v-model="tgsj"></DatePicker>
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem label="车牌：">
            <Input v-model="cphm" placeholder="输入车牌号码">
              <Select v-model="cpdq" slot="prepend" style="width: 60px" placeholder="全部">
                  <Option v-for="(item, key) in cpdqList" :value="item.value" :key="key">{{ item.label }}</Option>
              </Select>
            </Input>
          </FormItem>
        </Col>
        
        <Col span="5">
          <FormItem label="车辆类型：">
              <Select v-model="formCarQuery.hpzl" clearable style="width:200px">
                  <Option v-for="(item, key) in cllxList" :value="item.DM" :key="key">{{ item.DMSM }}</Option>
              </Select>
          </FormItem>
        </Col>
        
        <Col span="5" offset="1" v-if="!showCondition">
          <FormItem label="选择卡口：" >
              <Poptip placement="left" width="400">
                <Button type="primary" icon="android-pin">{{xzkkLabel}}</Button>
                <div slot="content">
                  <Tree ref="xzkkTree" :data="xzkkTree" multiple show-checkbox @on-check-change="xzkkChecked"></Tree>
                </div>
              </Poptip>
          </FormItem>
        </Col>
        
        <Col span="9" v-if="!showCondition">
          <FormItem label="车道号：">
              <CheckboxGroup v-model="formCarQuery.cdbh">
                  <Checkbox label="1">&nbsp;1</Checkbox>&nbsp;
                  <Checkbox label="2">&nbsp;2</Checkbox>&nbsp;
                  <Checkbox label="3">&nbsp;3</Checkbox>&nbsp;
                  <Checkbox label="4">&nbsp;4</Checkbox>&nbsp;
                  <Checkbox label="5">&nbsp;5</Checkbox>&nbsp;
                  <Checkbox label="6">&nbsp;6</Checkbox>&nbsp;
                  <Checkbox label="7">&nbsp;7</Checkbox>&nbsp;
                  <Checkbox label="8">&nbsp;8</Checkbox>&nbsp;
              </CheckboxGroup>
          </FormItem>
        </Col>

        <Col span="9" v-if="!showCondition">
          <FormItem label="车行方向：">
              <CheckboxGroup v-model="formCarQuery.cxfx">
                  <Checkbox label="1">&nbsp;由东向西</Checkbox>&nbsp;
                  <Checkbox label="2">&nbsp;由西向东</Checkbox>&nbsp;
                  <Checkbox label="3">&nbsp;由南向北</Checkbox>&nbsp;
                  <Checkbox label="4">&nbsp;由北向南</Checkbox>&nbsp;
              </CheckboxGroup>
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem>
            <Button type="primary" @click="formCarQuerySubmit">查询</Button> 
            <Button type="ghost" @click="formCarQueryReset">重置</Button>
            <Button type="text" @click="openCondition" v-show="showCondition">展开&nbsp;&nbsp;<Icon type="ios-arrow-down"></Icon></Button>
            <Button type="text" @click="closeCondition" v-show="!showCondition">收起&nbsp;&nbsp;<Icon type="ios-arrow-up"></Icon></Button>
          </FormItem>
        </Col>
      </Row>   
  </Form>
    <Card :bordered="false" style="background:#f0f5ff">
        <Tabs>
            <TabPane label="数据列表" icon="navicon-round">
                <Table :border="true" stripe :columns="columnsCarQuery" :data="carQueryResult" size="small"></Table>
                <div style="margin: 10px;overflow: hidden">
                    <div style="float: right;padding-bottom:2px;">
                        <Page no-data-text show-elevator :total="total" :current="1" show-total @on-change="dataQueryChangePage" size="small"></Page>
                    </div>
                </div>
            </TabPane>
            <TabPane label="数据缩略图" icon="image">
                <Row type="flex" justify="center" :gutter="20" v-if="carQueryResult.length===0?false:true" >
                  <Col span="4" class="tab-col" v-for="(item,key) in carQueryResult" :key="key">
                      <Card class="tab-card" :padding="0" :bordered="false" @click.native="show(key)">
                        <img :src="item.TPLJ1" class="tab-img">
                        <div class="tab-img-title">
                            <h5>{{item.KKMC}}</h5>
                        </div>
                        <div class="tab-img-content">
                            <Button type="primary" size="small">{{item.HPHM}}</Button>
                            <span class="tab-span">{{item.TGSJ}}</span>
                        </div>
                      </Card>
                  </Col>
                </Row>
                <div style="margin: 10px;overflow: hidden">
                    <div style="float: right;padding-bottom:2px;">
                        <Page no-data-text show-elevator :total="total" :current="1" show-total @on-change="dataQueryChangePage" size="small"></Page>
                    </div>
                </div>
            </TabPane>
        </Tabs>
    </Card>
    <BackTop :height="100" :bottom="10" :right="50" size="small">
        <Icon type="chevron-up" :size="10" class="top"></Icon>
    </BackTop>
    <Modal
        v-model="modalCarQuery"
        @on-cancel="cancel"
        width="80%"
        >
        <p slot="header" style="text-align:center">
            <Icon type="android-car"></Icon>
            <span>&nbsp;车辆信息详情</span>
        </p>
        <Row :gutter="16">
          <Col span="19">
            <Card style="width:100%" :padding="0" :bordered="false">
                  <img :src="modalCarData.TPLJ1" style="width:100%;height:500px;">
            </Card>
          </Col>
          <Col span="5">
              <Card style="width:100%;background:#f0f5ff" :padding="10" >
                    <p slot="title" >基础信息</p>
                    <div slot="extra" style="margin-top:-2px">
                        <ButtonGroup shape="circle" size="small">
                    <Button type="primary" @click="prevModalCarData">
                        <Icon type="chevron-left"></Icon>
                        上一条
                    </Button>
                    <Button type="primary" @click="nextModalCarData">
                        下一条
                        <Icon type="chevron-right"></Icon>
                    </Button>
                </ButtonGroup>
                    </div>
                    <ul>
                      <li class="modal-li">车牌号码：&nbsp;&nbsp;<span class="modal-span">{{modalCarData.HPHM}}</span></li>
                      <li class="modal-li">车辆类型：&nbsp;&nbsp;<span class="modal-span">{{modalCarData.HPZL_NAME}}</span></li>
                      <li class="modal-li">车辆品牌：&nbsp;&nbsp;<span class="modal-span">{{modalCarData.CLPP}}</span></li>
                      <li class="modal-li">车身颜色：&nbsp;&nbsp;<span class="modal-span">{{modalCarData.CSYS_NAME}}</span></li>
                      <li class="modal-li">卡口名称：&nbsp;&nbsp;<span class="modal-span">{{modalCarData.KKMC}}</span></li>
                      <li class="modal-li">车行方向：&nbsp;&nbsp;<span class="modal-span">{{modalCarData.CXFX_NAME}}</span></li>
                      <li class="modal-li">通过时间：&nbsp;&nbsp;<span class="modal-span">{{modalCarData.TGSJ}}</span></li>
                    </ul>
                    <img :src="modalCarData.TPLJ1" style="width:100%;height:200px;">
                </Card>
          </Col>
      </Row>
      <div slot="footer">
            <Button type="primary" icon="arrow-down-a" @click="downCarDataImg">下载图片</Button>
        </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'outland',
  created(){
        this.tgsj=[];
        const end=new Date();
        const start=new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
        this.tgsj.push(start,end);
        /*this.$http.get('tgs/queryTgsTree.do')
        .then((res)=>{
            return res.data;
        }).then((res)=>{
            this.xzkkTree=res.DATA;
        }).catch((err)=>{
            console.log(error.message);
        })*/
        /*this.$http.get('queryItgsCode.do?dmlb=261006')
        .then((res)=>{
            return res.data;
        }).then((res)=>{
            this.cllxList=res.DATA;
        }).catch((err)=>{
            console.log(error.message);
        })*/
  },
  methods:{
    /*获取卡口*/
    xzkkChecked(){
        let arr = [];
        arr = this.$refs.xzkkTree.getCheckedNodes();
        this.formCarQuery.kkisd=[];
        for( let i = 0, len = arr.length; i < len; i++) {
            if(arr[i].children===undefined){
                this.formCarQuery.kkisd.push(arr[i].value);
            }
        } 
        if(arr.length===0){
            this.xzkkLabel="选择卡口";
        }else{
            this.xzkkLabel=`已选择${this.formCarQuery.kkisd.length}个卡口`;
        } 
    },
    /*提交表单*/
    formCarQuerySubmit(){
        this.formCarQuery.hphm=this.cpdq+this.cphm;
        this.formCarQuery.tgsj=[];
        const start=new Date(this.tgsj[0].getTime());
        const end=new Date(this.tgsj[1].getTime());
        const startDate=`${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()} ${start.getHours()}:${start.getMinutes()}:${start.getSeconds()}`;
        const endDate=`${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()} ${end.getHours()}:${end.getMinutes()}:${end.getSeconds()}`;
        this.formCarQuery.tgsj.push(startDate,endDate);
        /*this.$http.post('passcar/query.do', 
            this.formCarQuery
        ).then((res)=>{
            return res.data;
        }).then((res)=>{
            this.carQueryResult=res.DATA;
            this.total=res.TOTAL;
        }).catch((err)=>{
            console.log(error.message);
        })*/
    },
    /*重置表单*/
    formCarQueryReset(){
        this.cpdq='';
        this.cphm='';
        this.tgsj=[];
        const end=new Date();
        const start=new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
        this.tgsj.push(start,end);
        this.formCarQuery.hpzl='';
        this.formCarQuery.cdbh=[];
        this.formCarQuery.cxfx=[];
        let arr = [];
        arr = this.$refs.xzkkTree.getCheckedNodes();
        for( let i = 0, len=arr.length; i < len; i++) {
            arr[i].checked=false;
            this.xzkkLabel="选择卡口";
        } 
        this.formCarQuery.pageNo=1;
    },
    /*展开更多条件*/
    openCondition(){
        this.showCondition=false;
    },
    /*收起更多条件*/
    closeCondition(){
        this.showCondition=true;
    },
    /*记录详情*/
    show (index) {
      this.modalCarDataIndex=index
      this.modalCarQuery = true
      this.modalCarData = this.carQueryResult[this.modalCarDataIndex]
    },
    cancel () {
        this.$Message.info('详情页面已关闭');
    },
    prevModalCarData(){
      if(this.modalCarDataIndex===0){
        this.$Message.info('没有上一个了！');
      }else {
        this.modalCarDataIndex--
        this.modalCarData = this.carQueryResult[this.modalCarDataIndex]
      }
      
    },
    nextModalCarData(){
      if(this.modalCarDataIndex===this.carQueryResult.length-1){
        this.$Message.info('没有下一个了！');
      }else {
        this.modalCarDataIndex++
        this.modalCarData = this.carQueryResult[this.modalCarDataIndex]
      }
    },
    downCarDataImg(){

    },
    /*换页*/
    dataQueryChangePage(page){
        this.formCarQuery.pageNo=page;
        /*this.$http.post('passcar/query.do', 
             this.formCarQuery
        ).then((res)=>{
            return res.data;
        }).then((res)=>{
            this.carQueryResult=res.DATA;
            this.total=res.TOTAL;
        }).catch((err)=>{
            console.log(error.message);
        })*/
    },

  },
  data () {
    return {
      modalCarDataIndex:Number,
      modalCarData:{
        CDBH:'',
        CLPP:'',
        CSYS_NAME:'',
        CXFX_NAME:'',
        HPHM:'',
        HPZL_NAME:'',
        KKMC:'',
        TGSJ:'',
        TPLJ1:'',
        XSSD:Number
      },
      modalCarQuery: false,
      total:90,
      formCarQuery: {
          hphm: '',
          tgsj: [],
          hpzl: '',
          kkisd:[],
          cdbh:[],
          cxfx:[],
          pageNo:1,
          pageSize:12,
      },
      cpdq:'',
      cphm:'',
      cpdqList: [
          {value: '',label: '全部'},
          {value: '京',label: '京'},{value: '津',label: '津'},{value: '冀',label: '冀'},{value: '晋',label: '晋'},
          {value: '蒙',label: '蒙'},{value: '辽',label: '辽'},{value: '吉',label: '吉'},{value: '黑',label: '黑'},
          {value: '沪',label: '沪'},{value: '苏',label: '苏'},{value: '浙',label: '浙'},{value: '皖',label: '皖'},
          {value: '闽',label: '闽'},{value: '赣',label: '赣'},{value: '鲁',label: '鲁'},{value: '豫',label: '豫'},
          {value: '鄂',label: '鄂'},{value: '湘',label: '湘'},{value: '粤',label: '粤'},{value: '桂',label: '桂'},
          {value: '琼',label: '琼'},{value: '陕',label: '陕'},{value: '甘',label: '甘'},{value: '青',label: '青'},
          {value: '宁',label: '宁'},{value: '新',label: '新'},{value: '渝',label: '渝'},{value: '川',label: '川'},
          {value: '黔',label: '黔'},{value: '滇',label: '滇'},{value: '藏',label: '藏'}
      ],
      tgsj:[],
      cllxList: [
        {
            DM: '1',
            DMSM: '小型汽车'
        },
        {
            DM: '2',
            DMSM: '大型汽车'
        },
      ],
      xzkkLabel:'选择卡口',
      xzkkTree: [
          {
              title: 'parent 1',
              value:'一级',
              children: [
                  {
                      title: 'parent 1-1',
                      value:'二级1',
                      
                  },
                  {
                      title: 'parent 1-2',
                      value:'二级2',
                      children: [
                          {
                              title: 'leaf 1-2-1',
                              value:'三级3',
                          },
                          {
                              title: 'leaf 1-2-1',
                              value:'三级4',
                          }
                      ]
                  }
              ]
          }
      ],
      showCondition:true,
      columnsCarQuery: [
            {title: '通过时间',key: 'TGSJ',width: 170,align: 'center'},//TGSJ
            {title: '卡口名称',key: 'KKMC',width: 300,align: 'center'},//KKMC
            {title: '车牌',key: 'HPHM',width: 130,align: 'center'},//HPHM
            {title: '车辆类型',key: 'HPZL_NAME',width: 140,align: 'center'},//HPZL_NAME
            {title: '车行方向',key: 'CXFX_NAME',width: 90,align: 'center'},//CXFX_NAME
            {title: '车道号',key: 'CDBH',width: 75,align: 'center'},//CDBH
            {
              title: '行驶速度(km/h)',
                key: 'XSSD',//XSSD
                width: 125,
                align: 'center',
                render: (h, params) => {
                    const row = params.row;
                    const color = row.XSSD > 120 ? 'red' : row.XSSD < 60 ? 'blue' : 'green';
                    const text = row.XSSD;
                    return h('Tag', {
                        props: {
                            type: 'dot',
                            color: color
                        }
                    }, text);
                }
            },
            {title: '车辆品牌',key: 'CLPP',width: 130,align: 'center'},//CLPP
            {title: '车身颜色',key: 'CSYS_NAME',width:80,align: 'center'},//CSYS_NAME
            {
              title: '图片',
              key: 'TPLJ1',//TPLJ1
              align: 'center',
              render: (h, params) => {
                  return h('div', [
                      h('Button', {
                          props: {
                              type: 'primary',
                              size: 'small',
                              shape:'circle',
                              icon:'image'
                          },
                          on: {
                              click: () => {
                                  this.show(params.index);
                              }
                          }
                      })
                  ]);
              }
            }
      ],
      carQueryResult: [
        {
              TGSJ: '2018-01-29 11:32:00',
              KKMC: '环长沙西收费站长张高速15公里392米',
              HPHM: '湘A79389警',
              HPZL_NAME: '大型汽车',
              CXFX_NAME: '由西向东',
              CDBH: '2',
              XSSD: 130,
              CLPP: '奔驰',
              CSYS_NAME: '白',
              TPLJ1: 'http://pic.58pic.com/58pic/13/71/22/35T58PICrEk_1024.jpg',
              TPLJ3:''},{
              TGSJ: '2018-01-29 11:32:00',
              KKMC: '环长沙西收费站长392米',
              HPHM: '湘A79389',
              HPZL_NAME: '小型汽车',
              CXFX_NAME: '由西向东',
              CDBH: '2',
              XSSD: 120,
              CLPP: '奔驰',
              CSYS_NAME: '红',
              TPLJ1: 'http://img.taopic.com/uploads/allimg/130316/235102-13031616344950.jpg',},{
              TGSJ: '2018-01-29 11:32:00',
              KKMC: '环长沙西收费站长张高速15公里',
              HPHM: '湘A79389',
              HPZL_NAME: '小型汽车',
              CXFX_NAME: '由西向东',
              CDBH: '2',
              XSSD: 99,
              CLPP: '奔驰',
              CSYS_NAME: '黑',
              TPLJ1: 'http://pic1.16pic.com/00/07/66/16pic_766152_b.jpg',},{
              TGSJ: '2018-01-29 11:32:00',
              KKMC: '环长沙西收费站长张高速15公里392米',
              HPHM: '湘A79389',
              HPZL_NAME: '小型汽车',
              CXFX_NAME: '由西向东',
              CDBH: '2',
              XSSD: 59,
              CLPP: '奔驰',
              CSYS_NAME: '黑',
              TPLJ1: 'http://pic.58pic.com/58pic/15/48/60/17y58PICUk7_1024.jpg',},{
              TGSJ: '2018-01-29 11:32:00',
              KKMC: '环长沙西收费站长张高速15公里392米',
              HPHM: '湘A79389警',
              HPZL_NAME: '小型汽车',
              CXFX_NAME: '由西向东',
              CDBH: '2',
              XSSD: 120,
              CLPP: '奔驰',
              CSYS_NAME: '红',
              TPLJ1: 'http://img.taopic.com/uploads/allimg/130316/235102-13031616344950.jpg',},{
              TGSJ: '2018-01-29 11:32:00',
              KKMC: '环长沙西收费站长张高速15公里392米',
              HPHM: '湘A79389',
              HPZL_NAME: '小型汽车',
              CXFX_NAME: '由西向东',
              CDBH: '2',
              XSSD: 99,
              CLPP: '奔驰',
              CSYS_NAME: '黑',
              TPLJ1: 'http://pic1.16pic.com/00/07/66/16pic_766152_b.jpg',},{
              TGSJ: '2018-01-29 11:32:00',
              KKMC: '环长沙西收费站长张高速15公里392米',
              HPHM: '湘A79389',
              HPZL_NAME: '小型汽车',
              CXFX_NAME: '由西向东',
              CDBH: '2',
              XSSD: 59,
              CLPP: '奔驰',
              CSYS_NAME: '黑',
              TPLJ1: 'http://pic.58pic.com/58pic/15/48/60/17y58PICUk7_1024.jpg',},{
              TGSJ: '2018-01-29 11:32:00',
              KKMC: '环长沙西收费站长张高速15公里392米',
              HPHM: '湘A79389',
              HPZL_NAME: '小型汽车',
              CXFX_NAME: '由西向东',
              CDBH: '2',
              XSSD: 99,
              CLPP: '奔驰',
              CSYS_NAME: '黑',
              TPLJ1: 'http://pic1.16pic.com/00/07/66/16pic_766152_b.jpg',},{
              TGSJ: '2018-01-29 11:32:00',
              KKMC: '环长沙西收费站长张高速15公里392米',
              HPHM: '湘A79389',
              HPZL_NAME: '小型汽车',
              CXFX_NAME: '由西向东',
              CDBH: '2',
              XSSD: 59,
              CLPP: '奔驰',
              CSYS_NAME: '黑',
              TPLJ1: 'http://pic.58pic.com/58pic/15/48/60/17y58PICUk7_1024.jpg',},{
              TGSJ: '2018-01-29 11:32:00',
              KKMC: '环长沙西收费站长张高速15公里392米',
              HPHM: '湘A79389',
              HPZL_NAME: '小型汽车',
              CXFX_NAME: '由西向东',
              CDBH: '2',
              XSSD: 120,
              CLPP: '奔驰',
              CSYS_NAME: '红',
              TPLJ1: 'http://img.taopic.com/uploads/allimg/130316/235102-13031616344950.jpg',},{
              TGSJ: '2018-01-29 11:32:00',
              KKMC: '环长沙西收费站长张高速15公里392米',
              HPHM: '湘A79389',
              HPZL_NAME: '小型汽车',
              CXFX_NAME: '由西向东',
              CDBH: '2',
              XSSD: 99,
              CLPP: '奔驰',
              CSYS_NAME: '黑',
              TPLJ1: 'http://pic1.16pic.com/00/07/66/16pic_766152_b.jpg',},{
              TGSJ: '2018-01-29 11:32:00',
              KKMC: '环长沙西收费站长张高速15公里392米',
              HPHM: '湘A79389',
              HPZL_NAME: '小型汽车',
              CXFX_NAME: '由西向东',
              CDBH: '2',
              XSSD: 59,
              CLPP: '奔驰',
              CSYS_NAME: '黑',
              TPLJ1: 'http://pic.58pic.com/58pic/15/48/60/17y58PICUk7_1024.jpg',}
      ]

    }
  }
}
</script>

<style scoped>
  .tab-col{
    margin-bottom:22px;
  }
  .tab-card{
    min-width:206px;
  }
  .tab-img{
    width:206px;
    height:140px;
  }
  .tab-img-title{
    height: 36px;
    text-align:center;
    padding:0 10px;
  }
  .tab-img-content{
    padding:0 5px 6px 5px;
  }
  .tab-span{
    font-size: 5px;
  }
  .modal-li{
    padding-bottom: 10px;
    color: #262626;
    font-weight: 700;
  }
  .modal-span{
    font-weight: normal;
  }
</style>