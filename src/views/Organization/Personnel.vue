<!-- 人员管理 [1.2]-->
<template>
  <div id="personnel">
    <Form ref="formQuery" inline :model="form.query" label-position="right" :label-width="80">
      <FormItem label="姓名：" prop="name">
        <Input v-model.trim="form.query.name" placeholder="输入人员姓名"></Input>
      </FormItem>
      <Button type="primary" @click="query">查询</Button>
    </Form>
    <Card :bordered="false" class="card">
      <p slot="title">
        <Icon type="person-stalker"></Icon>
        &nbsp;机构人员
      </p>
      <div slot="extra">
        <Button type="primary" icon="plus-round" @click="modalAdd">新增</Button>
      </div>
      <Table highlight-row :stripe="true" border :columns="columns.personnel" :data="data.personnel" size="small"></Table>
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
        <Form ref="formSave" :model="form.save" :rules="rule.save" label-position="right" inline :label-width="90">
          <Card class="card" dis-hover>
            <FormItem label="姓名：" prop="name">
              <Input v-model.trim="form.save.name" placeholder="输入姓名"></Input>
            </FormItem>
            <FormItem label="警号：" prop="alarm">
              <Input v-model.trim="form.save.alarm" placeholder="输入警号"></Input>
            </FormItem>
            <FormItem label="所属机构：" prop="agency">
              <Cascader 
                :data="list.agency" 
                v-model="form.save.agency" 
                change-on-select
                :render-format="label => label.pop()"
                style="width: 162px"
                placeholder="选择机构"></Cascader>
            </FormItem>
            <FormItem label="手机：" prop="phone">
              <Input v-model.trim="form.save.phone" placeholder="输入手机号码"></Input>
            </FormItem>
            <FormItem label="身份证号：" prop="IDnumber">
              <Input v-model.trim="form.save.IDnumber" placeholder="输入身份证号码"></Input>
            </FormItem>
            <FormItem label="性别：" prop="sex">
              <RadioGroup v-model="form.save.sex">
                <Radio label="1">
                  <Icon type="male" color="blue" size="12px"></Icon>
                  <span>男</span>
                </Radio>
                <Radio label="0">
                  <Icon type="female" color="pink" size="14px"></Icon>
                  <span>女</span>
                </Radio>
              </RadioGroup>
            </FormItem>  
            <FormItem label="出生日期：" prop="birth">
              <DatePicker v-model="form.save.birth" type="date" placeholder="选择出生日期" style="width: 162px"></DatePicker>
            </FormItem>
            <FormItem label="警衔：" prop="rank">
              <Select v-model="form.save.rank" class="select" placeholder="选择警衔">
                <Option v-for="item in list.rank" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="现任职务：" prop="post">
              <Select v-model="form.save.post" class="select" placeholder="选择现任职务">
                <Option v-for="item in list.post" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="编制类型：" prop="type">
              <Select v-model="form.save.type" class="select" placeholder="选择编制类型">
                <Option v-for="item in list.type" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="所在岗位：" prop="station">
              <Select v-model="form.save.station" class="select" placeholder="选择所在岗位">
                <Option v-for="item in list.station" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="办公电话：" prop="officePhone">
              <Input v-model.trim="form.save.officePhone" placeholder="输入身份证号码"></Input>
            </FormItem>
            <FormItem label="家庭电话：" prop="homePhone">
              <Input v-model.trim="form.save.homePhone" placeholder="输入家庭电话"></Input>
            </FormItem>
            <FormItem label="手台：" prop="hand">
              <Input v-model.trim="form.save.hand" placeholder="输入手台"></Input>
            </FormItem>
            <FormItem label="手台呼号：" prop="handSign">
              <Input v-model.trim="form.save.handSign" placeholder="输入手台呼号"></Input>
            </FormItem>
            <FormItem label="手台呼组：" prop="handGroup">
              <Input v-model.trim="form.save.handGroup" placeholder="输入手台呼组"></Input>
            </FormItem>
          </Card>
        </Form> 
      </div> 
      <div slot="footer" style="text-align: center">
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
        <p>人员&nbsp;&nbsp;<strong style="color: #f60">{{ form.save.name }}</strong>&nbsp;&nbsp;删除后，将无法恢复！</p>
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
  name: 'personnel',
  data () {
    return {
        form: {
            query: {
                name: '',
            },
            save: {
                id: '',
                name: '',
                sex: '',
                IDnumber: '',
                birth: '',
                alarm: '',
                rank: '',
                agency: [],
                post: '',
                type: '',
                station: '',
                phone: '',
                officePhone: '',
                homePhone: '',
                hand: '',
                handSign: '',
                handGroup: '',
            }
        },
        rule: {
            save: {
                name: [
                    { required: true, message: '姓名不能为空', trigger: 'blur' }
                ],
                alarm: [
                    { required: true, message: '警号不能为空', trigger: 'blur' }
                ],
                agency: [
                    { type: 'array', required: true, message: '请选择一个机构', trigger: 'change' }
                ],
                phone: [
                    { required: true, message: '电话号码不能为空', trigger: 'blur' }
                ],
            }
        },
        list: {
            agency: [
                {
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
                        value: '005',
                    }],
                },{
                    label: '株洲支队',
                    value: '006',
                    children: [{
                        label: '天元支队',
                        value: '007',
                    },{
                        label: '荷塘支队',
                        value: '008',
                    }],
                }
            ],
            rank: [
                { value: '1', label: '一级警监' },
                { value: '2', label: '二级警监' },
                { value: '3', label: '三级警监' },
                { value: '4', label: '一级警督' },
                { value: '5', label: '二级警督' },
                { value: '6', label: '三级警督' },
                { value: '7', label: '一级警司' },
                { value: '8', label: '二级警司' },
                { value: '9', label: '三级警司' },
                { value: '10', label: '一级警员' },
                { value: '11', label: '二级警员' },
                { value: '12', label: '三级警员' },
                { value: '13', label: '见习' },
                { value: '14', label: '学员' }
            ],
            post: [
                { value: '1', label: '局级' },
                { value: '2', label: '副教导员' },
                { value: '3', label: '主任' },
                { value: '4', label: '副主任' },
                { value: '5', label: '科长' }
            ],
            type: [
                { value: '1', label: '行政' },
                { value: '2', label: '文职' },
                { value: '3', label: '事业' }
            ],
            station: [
                { value: '1', label: '指挥调度岗' },
                { value: '2', label: '信息发布岗' },
                { value: '3', label: '视频巡检岗' },
                { value: '4', label: '违法审核岗' },
                { value: '5', label: '研判信息岗' }
            ], 
        },
        page: {
            current: 1,
            total: 0
        },
        modal: {
            
            visible: {
                save: false,
                del: false
            },
            title: '',
            icon: 'person',
            form: 'formSave',
        },
        columns: {
            personnel: [
                {
                    title: '姓名',
                    key: 'name',
                    align: 'center',
                    sortable: true 
                },
                {
                    title: '现任职务',
                    key: 'post',
                    align: 'center',
                    sortable: true 
                },
                {
                    title: '手台',
                    key: 'hand',
                    align: 'center',
                    sortable: true 
                },
                {
                    title: '手机',
                    key: 'phone',
                    align: 'center',
                    sortable: true 
                },
                {
                    title: '警号',
                    key: 'alarm',
                    align: 'center',
                    sortable: true 
                },
                {
                    title: '性别',
                    key: 'sex',
                    align: 'center',
                    filters: [{
                            label: '男',
                            value: '男'
                        },{
                            label: '女',
                            value: '女'
                    }],
                    filterMultiple: false,
                    filterMethod (value, row) {
                        return row.sex === value;
                    }
                },
                {
                    title: '所属机构',
                    key: 'agency',
                    align: 'center',
                    sortable: true 
                },
                {
                    title: '办公电话',
                    key: 'officePhone',
                    align: 'center',
                    sortable: true 
                },
                {
                    title: '手台呼号',
                    key: 'handSign',
                    align: 'center',
                    sortable: true 
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
            personnel: [
                {
                    id: '111',
                    name: '李建',
                    sex: '1',
                    IDnumber: '123',
                    birth: '2018-04-04',
                    alarm: '170339',
                    rank: '见习',
                    agency: '长沙支队',
                    post: '科长',
                    type: '事业',
                    station: '指挥调度岗',
                    phone: '18175693004',
                    officePhone: '11',
                    homePhone: '11',
                    hand: '11',
                    handSign: '11',
                    handGroup: '11'
                },
                {
                    id: '111',
                    name: '李建',
                    sex: '男',
                    IDnumber: '',
                    birth: '',
                    alarm: '170339',
                    rank: '',
                    agency: '岳阳支队',
                    post: '',
                    type: '',
                    station: '',
                    phone: '18175693004',
                    officePhone: '',
                    homePhone: '',
                    hand: '',
                    handSign: '',
                    handGroup: ''
                },
                {
                    id: '111',
                    name: '李建',
                    sex: '男',
                    IDnumber: '',
                    birth: '',
                    alarm: '170339',
                    rank: '',
                    agency: '岳阳支队',
                    post: '',
                    type: '',
                    station: '',
                    phone: '18175693004',
                    officePhone: '',
                    homePhone: '',
                    hand: '',
                    handSign: '',
                    handGroup: ''
                },
                {
                    id: '111',
                    name: '李建',
                    sex: '男',
                    IDnumber: '',
                    birth: '',
                    alarm: '170339',
                    rank: '',
                    agency: '岳阳支队',
                    post: '',
                    type: '',
                    station: '',
                    phone: '18175693004',
                    officePhone: '',
                    homePhone: '',
                    hand: '',
                    handSign: '',
                    handGroup: ''
                },
                {
                    id: '111',
                    name: '李建',
                    sex: '男',
                    IDnumber: '',
                    birth: '',
                    alarm: '170339',
                    rank: '',
                    agency: '岳阳支队',
                    post: '',
                    type: '',
                    station: '',
                    phone: '18175693004',
                    officePhone: '',
                    homePhone: '',
                    hand: '',
                    handSign: '',
                    handGroup: ''
                },
                {
                    id: '111',
                    name: '李建',
                    sex: '男',
                    IDnumber: '',
                    birth: '',
                    alarm: '170339',
                    rank: '',
                    agency: '岳阳支队',
                    post: '',
                    type: '',
                    station: '',
                    phone: '18175693004',
                    officePhone: '',
                    homePhone: '',
                    hand: '',
                    handSign: '',
                    handGroup: ''
                },
                {
                    id: '111',
                    name: '李建',
                    sex: '男',
                    IDnumber: '',
                    birth: '',
                    alarm: '170339',
                    rank: '',
                    agency: '岳阳支队',
                    post: '',
                    type: '',
                    station: '',
                    phone: '18175693004',
                    officePhone: '',
                    homePhone: '',
                    hand: '',
                    handSign: '',
                    handGroup: ''
                },
                {
                    id: '111',
                    name: '李建',
                    sex: '男',
                    IDnumber: '',
                    birth: '',
                    alarm: '170339',
                    rank: '',
                    agency: '岳阳支队',
                    post: '',
                    type: '',
                    station: '',
                    phone: '18175693004',
                    officePhone: '',
                    homePhone: '',
                    hand: '',
                    handSign: '',
                    handGroup: ''
                },
                {
                    id: '111',
                    name: '李建',
                    sex: '男',
                    IDnumber: '',
                    birth: '',
                    alarm: '170339',
                    rank: '',
                    agency: '岳阳支队',
                    post: '',
                    type: '',
                    station: '',
                    phone: '18175693004',
                    officePhone: '',
                    homePhone: '',
                    hand: '',
                    handSign: '',
                    handGroup: ''
                },
                {
                    id: '111',
                    name: '李建',
                    sex: '男',
                    IDnumber: '',
                    birth: '',
                    alarm: '170339',
                    rank: '',
                    agency: '岳阳支队',
                    post: '',
                    type: '',
                    station: '',
                    phone: '18175693004',
                    officePhone: '',
                    homePhone: '',
                    hand: '',
                    handSign: '',
                    handGroup: ''
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
      this.modal.title = '新增人员';
      this.modal.icon = 'plus-round';
      this.modal.visible.save = true;
    },
    modalEdit(index) {
      this.modal.title = '编辑人员';
      this.modal.icon = 'edit';
      const data = this.data.personnel[index];
      for (let key in this.form.save) {
        if (['rank','post','type','station'].includes(key)) {
          this.form.save[key] = getOptionValue(this.list[key], data[key]);
        } else if (['agency'].includes(key)) {
          this.form.save[key] = getCascaderValue(this.list[key], data[key]);
        } else {
          this.form.save[key] = data[key];
        }
      }
      this.modal.visible.save = true;
    },
    modalDel(index) {
      this.modal.title = '删除人员';
      this.modal.icon = 'trash-a';
      const data = this.data.personnel[index];
      for (let key in this.form.save) {
        if (['id','name'].includes(key)) {
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