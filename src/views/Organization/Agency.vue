<!-- 机构管理 [1.2]-->
<template>
  <div id="agency">
    <Form ref="formQuery" inline :model="form.query" label-position="right" :label-width="80">
      <FormItem label="机构：" prop="agency">
        <Cascader 
          :data="list.agency" 
          v-model="form.query.agency" 
          change-on-select
          :render-format="label => label.pop()"
          style="width: 200px"
          placeholder="选择机构"></Cascader>
      </FormItem>
      <Button type="primary" @click="query">查询</Button>
    </Form>
    <Card :bordered="false" class="card">
      <p slot="title">
        <Icon type="briefcase"></Icon>
        &nbsp;机构管理
      </p>
      <div slot="extra">
        <Button type="primary" icon="plus-round" @click="modalAdd">新增</Button>
      </div>
      <Table highlight-row :stripe="true" :columns="columns.agency" :data="data.agency" size="small"></Table>
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
            <FormItem label="机构编码：" prop="code">
              <Input v-model.trim="form.save.code" placeholder="输入机构编码"></Input>
            </FormItem>
            <FormItem label="机构名称：" prop="name">
              <Input v-model.trim="form.save.name" placeholder="输入机构名称"></Input>
            </FormItem>
            <FormItem label="行政级别：" prop="level">
              <Select v-model="form.save.level" class="select" placeholder="选择行政级别">
			    <Option v-for="item in list.level" :value="item.value" :key="item.value">{{ item.label }}</Option>
			  </Select>
            </FormItem>
            <FormItem label="机构职能：" prop="func">
              <Input v-model.trim="form.save.func" placeholder="输入机构职能"></Input>
            </FormItem>
            <FormItem label="业务描述：" prop="business">
              <Input v-model.trim="form.save.business" type="textarea" class="textarea" :autosize="true" placeholder="输入业务描述"></Input>
            </FormItem>
            <FormItem label="上级机构：" prop="father">
              <Cascader 
                :data="list.father" 
                v-model="form.save.father" 
                change-on-select
                :render-format="label => label.pop()"
                style="width: 162px"
                placeholder="选择上级机构"></Cascader>
            </FormItem>
            <FormItem label="机构类型：" prop="type">
              <Select v-model="form.save.type" class="select" placeholder="选择机构类型">
			    <Option v-for="item in list.type" :value="item.value" :key="item.value">{{ item.label }}</Option>
			  </Select>
            </FormItem>
            <FormItem label="所处地址：" prop="address">
              <Input v-model.trim="form.save.address" placeholder="输入所处地址"></Input>
            </FormItem>
            <FormItem label="邮政编码：" prop="zip">
              <Input v-model.trim="form.save.zip" placeholder="输入邮政编码"></Input>
            </FormItem>
            <FormItem label="编制人数：" prop="policeNumber">
              <Input v-model.trim="form.save.policeNumber" placeholder="输入编制人数"></Input>
            </FormItem>
            <FormItem label="在编民警：" prop="police">
              <Input v-model.trim="form.save.police" placeholder="输入在编民警"></Input>
            </FormItem>
            <FormItem label="在编职工：" prop="worker">
              <Input v-model.trim="form.save.worker" placeholder="输入在编职工"></Input>
            </FormItem>
            <FormItem label="其他人数：" prop="otherNumber">
              <Input v-model.trim="form.save.otherNumber" placeholder="输入其他人数"></Input>
            </FormItem>
            <FormItem label="负责人：" prop="principals">
              <Input v-model.trim="form.save.principals" placeholder="输入负责人"></Input>
            </FormItem>
            <FormItem label="负责人电话：" prop="principalsTel">
              <Input v-model.trim="form.save.principalsTel" placeholder="输入负责人电话"></Input>
            </FormItem>
            <FormItem label="负责人手机：" prop="principalsPhone">
              <Input v-model.trim="form.save.principalsPhone" placeholder="输入负责人手机"></Input>
            </FormItem>
            <FormItem label="值班电话1：" prop="officePhone1">
              <Input v-model.trim="form.save.officePhone1" placeholder="输入值班电话1"></Input>
            </FormItem>
            <FormItem label="值班电话2：" prop="officePhone2">
              <Input v-model.trim="form.save.officePhone2" placeholder="输入值班电话2"></Input>
            </FormItem>
            <FormItem label="值班电话3：" prop="officePhone3">
              <Input v-model.trim="form.save.officePhone3" placeholder="输入值班电话3"></Input>
            </FormItem>
            <FormItem label="传真：" prop="fax">
              <Input v-model.trim="form.save.fax" placeholder="输入传真"></Input>
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
        <p>机构&nbsp;&nbsp;<strong style="color: #f60">{{ form.save.name }}</strong>&nbsp;&nbsp;删除后，将无法恢复！</p>
        <p>是否继续删除？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long @click="del">删 除</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import agencyRow from '../../components/Table/TableAgency.vue';
import { getOptionValue, getCascaderValue } from '../../utils/component.js';
export default {
  name: 'agency',
  components: { agencyRow },
  data () {
    return {
        form: {
            query: {
                agency: [],
            },
            save: {
                id: '',
                code: '',
                name: '',
                level: '',
                func: '',
                business: '',
                father: [],
                type: '',
                address: '',
                zip: '',
                policeNumber: '',
                police: '',
                worker: '',
                otherNumber: '',
                principals: '',
                principalsTel: '',
                principalsPhone: '',
                officePhone1: '',
                officePhone2: '',
                officePhone3: '',
                fax: '',
            }
        },
        rule: {
            save: {
                code: [
                    { required: true, message: '机构编码不能为空', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '机构名称不能为空', trigger: 'blur' }
                ],
                father: [
                    { type: 'array', required: true, message: '请选择一个机构', trigger: 'change' }
                ],
                type: [
                    { required: true, message: '选择机构类型', trigger: 'blur' }
                ],
                officePhone1: [
                    { required: true, message: '值班电话1不能为空', trigger: 'blur' }
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
            father: [
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
            level: [
                { value: '1', label: '局级' },
                { value: '2', label: '副教导员' },
                { value: '3', label: '主任' },
                { value: '4', label: '副主任' },
                { value: '5', label: '科长' }
            ],
            type: [
                { value: '1', label: '总队' },
                { value: '2', label: '支队' },
                { value: '3', label: '大队' },
                { value: '4', label: '中队' },
                { value: '5', label: '其他' }
            ],
        },
        page: {
            current: 1,
            total: 0,
        },
        modal: {
            visible: {
                save: false,
                del: false
            },
            title: '',
            icon: 'briefcase',
            form: 'formSave',
        },
        columns: {
            agency: [
                {
                    type: 'expand',
                    width: 50,
                    render: (h, params) => {
                        return h(agencyRow, {
                            props: {
                                row: params.row
                            }
                        })
                    }
                },
                {
                    title: '机构编码',
                    key: 'code',
                    align: 'center',
                    sortable: true
                },
                {
                    title: '机构名称',
                    key: 'name',
                    align: 'center',
                    sortable: true                        
                },
                {
                    title: '行政级别',
                    key: 'level',
                    align: 'center',
                    sortable: true
                },
                {
                    title: '机构职能',
                    key: 'func',
                    align: 'center',
                    sortable: true
                },
                {
                    title: '业务描述',
                    key: 'business',
                    align: 'center',
                    sortable: true
                },
                {
                    title: '上级机构',
                    key: 'father',
                    align: 'center',
                    sortable: true
                },
                {
                    title: '机构类型',
                    key: 'type',
                    align: 'center',
                    sortable: true
                },
                {
                    title: '值班电话1',
                    key: 'officePhone1',
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
            agency: [
                {
                    id: '111',
                    code: '4310000',
                    name: '长沙支队',
                    level: '',
                    func: '',
                    business: '',
                    father: '长沙支队',
                    type: '支队',
                    officePhone1: '202',
                    address: '',
                    zip: '',
                    policeNumber: '',
                    police: '',
                    worker: '',
                    otherNumber: '',
                    principals: '',
                    principalsTel: '',
                    principalsPhone: '',
                    officePhone2: '',
                    officePhone3: '',
                    fax: '',
                },
                {
                    id: '111',
                    code: '4310000',
                    name: '长沙支队',
                    level: '',
                    func: '',
                    business: '',
                    father: '',
                    type: '支队',
                    officePhone1: '202',
                    address: '',
                    zip: '',
                    policeNumber: '',
                    police: '',
                    worker: '',
                    otherNumber: '',
                    principals: '',
                    principalsTel: '',
                    principalsPhone: '',
                    officePhone2: '',
                    officePhone3: '',
                    fax: '',
                },
                {
                    id: '111',
                    code: '4310000',
                    name: '长沙支队',
                    level: '',
                    func: '',
                    business: '',
                    father: '',
                    type: '支队',
                    officePhone1: '202',
                    address: '',
                    zip: '',
                    policeNumber: '',
                    police: '',
                    worker: '',
                    otherNumber: '',
                    principals: '',
                    principalsTel: '',
                    principalsPhone: '',
                    officePhone2: '',
                    officePhone3: '',
                    fax: '',
                },
                {
                    id: '111',
                    code: '4310000',
                    name: '长沙支队',
                    level: '',
                    func: '',
                    business: '',
                    father: '',
                    type: '支队',
                    officePhone1: '202',
                    address: '',
                    zip: '',
                    policeNumber: '',
                    police: '',
                    worker: '',
                    otherNumber: '',
                    principals: '',
                    principalsTel: '',
                    principalsPhone: '',
                    officePhone2: '',
                    officePhone3: '',
                    fax: '',
                },
                {
                    id: '111',
                    code: '4310000',
                    name: '长沙支队',
                    level: '',
                    func: '',
                    business: '',
                    father: '',
                    type: '支队',
                    officePhone1: '202',
                    address: '',
                    zip: '',
                    policeNumber: '',
                    police: '',
                    worker: '',
                    otherNumber: '',
                    principals: '',
                    principalsTel: '',
                    principalsPhone: '',
                    officePhone2: '',
                    officePhone3: '',
                    fax: '',
                },
                {
                    id: '111',
                    code: '4310000',
                    name: '长沙支队',
                    level: '',
                    func: '',
                    business: '',
                    father: '',
                    type: '支队',
                    officePhone1: '202',
                    address: '',
                    zip: '',
                    policeNumber: '',
                    police: '',
                    worker: '',
                    otherNumber: '',
                    principals: '',
                    principalsTel: '',
                    principalsPhone: '',
                    officePhone2: '',
                    officePhone3: '',
                    fax: '',
                },
                {
                    id: '111',
                    code: '4310000',
                    name: '长沙支队',
                    level: '',
                    func: '',
                    business: '',
                    father: '',
                    type: '支队',
                    officePhone1: '202',
                    address: '',
                    zip: '',
                    policeNumber: '',
                    police: '',
                    worker: '',
                    otherNumber: '',
                    principals: '',
                    principalsTel: '',
                    principalsPhone: '',
                    officePhone2: '',
                    officePhone3: '',
                    fax: '',
                },
                {
                    id: '111',
                    code: '4310000',
                    name: '长沙支队',
                    level: '',
                    func: '',
                    business: '',
                    father: '',
                    type: '支队',
                    officePhone1: '202',
                    address: '',
                    zip: '',
                    policeNumber: '',
                    police: '',
                    worker: '',
                    otherNumber: '',
                    principals: '',
                    principalsTel: '',
                    principalsPhone: '',
                    officePhone2: '',
                    officePhone3: '',
                    fax: '',
                },
                {
                    id: '111',
                    code: '4310000',
                    name: '长沙支队',
                    level: '',
                    func: '',
                    business: '',
                    father: '',
                    type: '支队',
                    officePhone1: '202',
                    address: '',
                    zip: '',
                    policeNumber: '',
                    police: '',
                    worker: '',
                    otherNumber: '',
                    principals: '',
                    principalsTel: '',
                    principalsPhone: '',
                    officePhone2: '',
                    officePhone3: '',
                    fax: '',
                },
                {
                    id: '111',
                    code: '4310000',
                    name: '长沙支队',
                    level: '',
                    func: '',
                    business: '',
                    father: '',
                    type: '支队',
                    officePhone1: '202',
                    address: '',
                    zip: '',
                    policeNumber: '',
                    police: '',
                    worker: '',
                    otherNumber: '',
                    principals: '',
                    principalsTel: '',
                    principalsPhone: '',
                    officePhone2: '',
                    officePhone3: '',
                    fax: '',
                }
            ],
        }
    }
  },
  created() {
    this.page.total = 120;  
  },
  methods:{
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
      this.modal.title = '新增机构';
      this.modal.icon = 'plus-round';
      this.modal.visible.save = true;
    },
    modalEdit(index) {
      this.modal.title = '编辑机构';
      this.modal.icon = 'edit';
      const data = this.data.agency[index];
      for (let key in this.form.save) {
        if (['level', 'type'].includes(key)) {
          this.form.save[key] = getOptionValue(this.list[key], data[key]);
        } else if (['father'].includes(key)){
          this.form.save[key] = getCascaderValue(this.list[key], data[key]);
        } else {
          this.form.save[key] = data[key];
        }
      }
      this.modal.visible.save = true;
    },
    modalDel(index) {
      this.modal.title = '删除机构';
      this.modal.icon = 'trash-a';
      const data = this.data.agency[index];
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
.select{
  width: 162px;
}
.textarea{
  width: 429px;
}
</style>