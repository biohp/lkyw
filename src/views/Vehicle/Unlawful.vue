<!-- 违法闯禁查询 [1.0]-->
<template>
  <div id="unlawful">
    <Form ref="formQuery" :model="form.query" inline label-position="right" :label-width="80">
        <FormItem label="卡口名称：" prop="bayonet">
          <Poptip placement="right-start" width="350">
            <Button type="primary" icon="android-pin">{{ bus.bayonet }}</Button>
            <div slot="content">
              <Tree ref="treeBayonet" :data="list.bayonet" multiple show-checkbox @on-check-change="checkBayonet"></Tree>
            </div>
          </Poptip>    
        </FormItem>
        <FormItem label="时间段：" prop="date">
          <DatePicker type="datetimerange" placeholder="选择时间段" style="width: 275px" v-model="bus.date"></DatePicker>
        </FormItem>
        <FormItem label="检查点：" prop="check">
            <Input v-model.trim="form.query.check" placeholder="输入检查点名称" style="width:200px"></Input>
        </FormItem>
        <FormItem label="车牌号：" prop="license">
          <Input v-model="bus.license.number" placeholder="输入车牌号码">
            <Select v-model="bus.license.region" slot="prepend" style="width: 60px" placeholder="全部">
              <Option v-for="(item, key) in list.region" :value="item.value" :key="key">{{ item.label }}</Option>
            </Select>
          </Input>
        </FormItem>
        <Button type="primary" @click="query">查询</Button>
        <Button type="ghost" @click="reset('formQuery')">重置</Button>
    </Form>
    <Card :bordered="false" class="card">
      <Tabs>
        <TabPane label="数据列表" icon="navicon-round">
          <Table :border="true" stripe :columns="columns.unlawful" :data="data.unlawful" size="small"></Table>
        </TabPane>
        <TabPane label="数据缩略图" icon="image">
          <Row type="flex" :gutter="16" v-if="data.unlawful.length===0?false:true" >
            <Col span="4" class="tab-col" v-for="(item,key) in data.unlawful" :key="key">
              <Card class="tab-card" :padding="0" :bordered="false" @click.native="modalShow(key)">
                <img :src="item.img1" class="tab-img">
                <div class="tab-img-title">
                  <h5>{{ item.check }}</h5>
                </div>
                <div class="tab-img-content">
                  <Button type="primary" size="small">{{ item.license }}</Button>
                  <span class="tab-span">{{ item.date }}</span>
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
      <div class="page" v-if="page.total===0?false:true">
          <div style="float: right;">
              <Page 
                  :total="page.total" 
                  :current="page.current" 
                  @on-change="pageChange"
                  :page-size="12" 
                  show-total
                  size="small"
                  no-data-text 
                  show-elevator></Page>
          </div>
      </div>
    </Card>
    <Modal v-model="modal.visible.show" @on-cancel="cancel" :width="1200">
      <p slot="header" style="text-align:center">
        <Icon type="android-car"></Icon>
        <span>&nbsp;违法车辆信息详情</span>
      </p>
      <Row :gutter="16">
        <Col span="19">
          <Card :padding="0" :bordered="false">
            <img :src="bus.unlawful.img1" style="width:100%;height:500px;">
          </Card>
        </Col>
        <Col span="5">
          <Card class="card" :padding="10" >
            <p slot="title">基础信息</p>
            <div slot="extra" style="margin-top:-2px">
              <ButtonGroup shape="circle" size="small">
                <Button type="primary" @click="prev">
                  <Icon type="chevron-left"></Icon>
                  上一条
                </Button>
                <Button type="primary" @click="next">
                  下一条
                  <Icon type="chevron-right"></Icon>
                </Button>
              </ButtonGroup>
            </div>
              <ul>
                <li class="modal-li" v-for="(item, key) in bus.info" :key="key"> 
                  {{ item.label }}：&nbsp;
                  <span class="modal-span">{{ bus.unlawful[item.value] }}</span>
                </li>
              </ul>
            <img :src="bus.unlawful.img1" style="width:100%;height:125px;">
            <img :src="bus.unlawful.img1" style="width:100%;height:125px;">
          </Card>
        </Col>
      </Row>
      <div slot="footer">
        <Button type="primary" icon="arrow-down-a" @click="down">下载图片</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getTreeValue, resetTree } from '../../utils/component.js';
import { setDate, formatDate} from '../../utils/date.js'
export default {
  name: 'unlawful',
  data () {
    return {
      form: {
        query: {
          bayonet: [],
          date: [],
          check: '',
          license: '',
          current: 1,
          pageSize: 12,
        }
      },
      bus: {
        bayonet: '选择卡口',
        date: [],
        license: {
          region: '',
          number: ''
        },
        info: [
          {label: '车牌号码', value: 'license'},
          {label: '车辆类型', value: 'type'},
          {label: '车身颜色', value: 'color'},
          {label: '卡口名称', value: 'check'},
          {label: '车行方向', value: 'path'},
          {label: '通过时间', value: 'date'}
        ],
        unlawful: {
          date: '',
          check: '',
          license: '',
          type: '',
          path: '',
          color: '',
          img1: ''
        },
        index: -1
      },
      list: {
        bayonet: [
          {
            title: '全国稽查布控系统',
            value:'000',
          },
          {
            title: '长沙支队',
            value:'100',
            children: [
              {
                title: '环长沙西收费站长张高速15公里392米',
                value:'110',
              },
              {
                title: '环长沙西收费站长张高速15公里392米',
                value:'120',
              }
            ]
          },
          {
            title: '株洲支队',
            value:'200',
            children: [
              {
                title: '环长沙西收费站长张高速15公里392米',
                value:'210',
              },
              {
                title: '环长沙西收费站长张高速15公里392米',
                value:'220',
              }
            ]
          }
        ],
        region: [
          {value: '',label: '全部'},{value: '京',label: '京'},{value: '津',label: '津'},{value: '冀',label: '冀'},
          {value: '晋',label: '晋'},{value: '蒙',label: '蒙'},{value: '辽',label: '辽'},{value: '吉',label: '吉'},
          {value: '黑',label: '黑'},{value: '沪',label: '沪'},{value: '苏',label: '苏'},{value: '浙',label: '浙'},
          {value: '皖',label: '皖'},{value: '闽',label: '闽'},{value: '赣',label: '赣'},{value: '鲁',label: '鲁'},
          {value: '豫',label: '豫'},{value: '鄂',label: '鄂'},{value: '湘',label: '湘'},{value: '粤',label: '粤'},
          {value: '桂',label: '桂'},{value: '琼',label: '琼'},{value: '陕',label: '陕'},{value: '甘',label: '甘'},
          {value: '青',label: '青'},{value: '宁',label: '宁'},{value: '新',label: '新'},{value: '渝',label: '渝'},
          {value: '川',label: '川'},{value: '黔',label: '黔'},{value: '滇',label: '滇'},{value: '藏',label: '藏'},
        ]
      },
      page: {
        total: 0,
        current: 1
      },
      modal: {
        visible: {
          show: false,
        }
      },
      columns: {
        unlawful: [
          {
              title: '时间',
              key: 'date',
              align: 'center',
              width: 200
          },
          {
              title: '违法地点',
              key: 'check',
              align: 'center',
              width: 300
          },
          {
              title: '车牌号码',
              key: 'license',
              align: 'center',
              width: 200
          },
          {
              title: '车辆类型',
              key: 'type',
              align: 'center',
              width: 200
          },
          {
              title: '车行方向',
              key: 'path',
              align: 'center'
          },
          {
              title: '颜色',
              key: 'color',
              align: 'center'
          },
          {
              title: '图片',
              key: 'img1',
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
                        this.modalShow(params.index);
                      }
                    }
                  })
                ]);
              }
          }
        ]
      },
      data: {
        unlawful: [
          {
              date: '2018-04-02 11:25:19',
              check: '环长沙西收费站长张高速15公里392米',
              license: '湘B05846警',
              type: '小型汽车',
              path: '由南向北',
              color: '赤',
              img1: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1522649477841&di=3e2e12c80bcb10989f7ba1f5ad1c88b2&imgtype=0&src=http%3A%2F%2Fupload.cbg.cn%2F2016%2F0714%2F1468500838302.jpg'
          },
          {
              date: '2018-04-02 11:25:19',
              check: '环长沙西收费站长张高速15公里392米',
              license: '湘B05846警',
              type: '小型汽车',
              path: '由南向北',
              color: '橙',
              img1: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1522649477841&di=3e2e12c80bcb10989f7ba1f5ad1c88b2&imgtype=0&src=http%3A%2F%2Fupload.cbg.cn%2F2016%2F0714%2F1468500838302.jpg'
          },
          {
              date: '2018-04-02 11:25:19',
              check: '环长沙西收费站长张高速15公里392米',
              license: '湘B05846警',
              type: '小型汽车',
              path: '由南向北',
              color: '黄',
              img1: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1522649477841&di=3e2e12c80bcb10989f7ba1f5ad1c88b2&imgtype=0&src=http%3A%2F%2Fupload.cbg.cn%2F2016%2F0714%2F1468500838302.jpg'
          },
          {
              date: '2018-04-02 11:25:19',
              check: '环长沙西收费站长张高速15公里392米',
              license: '湘B05846警',
              type: '小型汽车',
              path: '由南向北',
              color: '绿',
              img1: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1522649477841&di=3e2e12c80bcb10989f7ba1f5ad1c88b2&imgtype=0&src=http%3A%2F%2Fupload.cbg.cn%2F2016%2F0714%2F1468500838302.jpg'
          },
          {
              date: '2018-04-02 11:25:19',
              check: '环长沙西收费站长张高速15公里392米',
              license: '湘B05846警',
              type: '小型汽车',
              path: '由南向北',
              color: '青',
              img1: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1522649477841&di=3e2e12c80bcb10989f7ba1f5ad1c88b2&imgtype=0&src=http%3A%2F%2Fupload.cbg.cn%2F2016%2F0714%2F1468500838302.jpg'
          },
          {
              date: '2018-04-02 11:25:19',
              check: '环长沙西收费站长张高速15公里392米',
              license: '湘B05846警',
              type: '小型汽车',
              path: '由南向北',
              color: '蓝',
              img1: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1522649477841&di=3e2e12c80bcb10989f7ba1f5ad1c88b2&imgtype=0&src=http%3A%2F%2Fupload.cbg.cn%2F2016%2F0714%2F1468500838302.jpg'
          },
          {
              date: '2018-04-02 11:25:19',
              check: '环长沙西收费站长张高速15公里392米',
              license: '湘B05846警',
              type: '小型汽车',
              path: '由南向北',
              color: '紫',
              img1: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1522649477841&di=3e2e12c80bcb10989f7ba1f5ad1c88b2&imgtype=0&src=http%3A%2F%2Fupload.cbg.cn%2F2016%2F0714%2F1468500838302.jpg'
          },
          {
              date: '2018-04-02 11:25:19',
              check: '环长沙西收费站长张高速15公里392米',
              license: '湘B05846警',
              type: '小型汽车',
              path: '由南向北',
              color: '白',
              img1: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1522649477841&di=3e2e12c80bcb10989f7ba1f5ad1c88b2&imgtype=0&src=http%3A%2F%2Fupload.cbg.cn%2F2016%2F0714%2F1468500838302.jpg'
          },
          {
              date: '2018-04-02 11:25:19',
              check: '环长沙西收费站长张高速15公里392米',
              license: '湘B05846警',
              type: '小型汽车',
              path: '由南向北',
              color: '黑',
              img1: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1522649477841&di=3e2e12c80bcb10989f7ba1f5ad1c88b2&imgtype=0&src=http%3A%2F%2Fupload.cbg.cn%2F2016%2F0714%2F1468500838302.jpg'
          },
          {
              date: '2018-04-02 11:25:19',
              check: '环长沙西收费站长张高速15公里392米',
              license: '湘B05846警',
              type: '小型汽车',
              path: '由南向北',
              color: '灰',
              img1: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1522649477841&di=3e2e12c80bcb10989f7ba1f5ad1c88b2&imgtype=0&src=http%3A%2F%2Fupload.cbg.cn%2F2016%2F0714%2F1468500838302.jpg'
          },
          {
              date: '2018-04-02 11:25:19',
              check: '环长沙西收费站长张高速15公里392米',
              license: '湘B05846警',
              type: '小型汽车',
              path: '由南向北',
              color: '粉色',
              img1: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1522649477841&di=3e2e12c80bcb10989f7ba1f5ad1c88b2&imgtype=0&src=http%3A%2F%2Fupload.cbg.cn%2F2016%2F0714%2F1468500838302.jpg'
          },
          {
              date: '2018-04-02 11:25:19',
              check: '环长沙西收费站长张高速15公里392米水府',
              license: '湘B05846警',
              type: '小型汽车',
              path: '由南向北',
              color: '银色',
              img1: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1522649477841&di=3e2e12c80bcb10989f7ba1f5ad1c88b2&imgtype=0&src=http%3A%2F%2Fupload.cbg.cn%2F2016%2F0714%2F1468500838302.jpg'
          }
        ]
      }
    }
  },
  created(){
    //axios
    this.page.total = 120;
    this.bus.date = setDate(3);
  },
  methods: {
    //数据接口
    query() {
      //数据待整合
      this.form.query.date = formatDate(this.bus.date);
      if (this.bus.license.region === '') {
        this.form.query.license = '';
      } else {
        this.form.query.license = this.bus.license.region + this.bus.license.number;
      }
      
      console.log(this.form.query);
      //axios
    },
    pageChange(val) {
      //数据待整合
      //axios
    },
    down() {
      //数据待整合
      //axios
    },
    //页面交互
    checkBayonet() {
      let bayonet = getTreeValue(this.$refs.treeBayonet.getCheckedNodes());
      if (bayonet.length !== 0) {
        this.bus.bayonet = `已选择${bayonet.length}个卡口`;
      } else {
        this.bus.bayonet = `选择卡口`;
      }
      this.form.query.bayonet = bayonet;
    },
    reset(name) {
      this.list.bayonet = resetTree(this.list.bayonet);
      this.bus.bayonet = '选择卡口';
      this.form.query.bayonet = [];
      this.$refs[name].resetFields();
      this.bus.license.region = '';
      this.bus.license.number = '';
      this.bus.date = setDate(3);
    },
    modalShow(index) {
      this.bus.index = index;
      this.bus.unlawful = this.data.unlawful[index];
      this.modal.visible.show = true;
    },
    cancel() {
      this.modal.visible.show = false;
    },
    prev() {
      if (this.bus.index <= 0) {
        this.$Message.info('没有上一个了！');
      } else {
        this.bus.index--;
        this.bus.unlawful = this.data.unlawful[this.bus.index];
      }
    },
    next() {
      if (this.bus.index >= this.data.unlawful.length) {
        this.$Message.info('没有下一个了！');
      } else {
        this.bus.index++;
        this.bus.unlawful = this.data.unlawful[this.bus.index];
      }
    }
  }
}
</script>

<style scoped>
  .card{
    background: #f0f5ff;
  }
  .page{
    margin-top: 10px;
    padding-bottom: 2px;
    overflow: hidden;
  }
  .tab-col{
    margin-top: 25px;
  }
  .tab-card{
    min-width: 206px;
  }
  .tab-img{
    width: 206px;
    height: 150px;
  }
  .tab-img-title{
    padding: 0 4px;
    text-align: center;
  }
  .tab-img-content{
    padding: 5px 5px;
  }
  .tab-span{
    font-size: 10px;
  }
  .modal-li{
    padding-bottom: 5px;
    color: #262626;
    font-weight: 700;
  }
  .modal-span{
    font-weight: normal;
  }
</style>