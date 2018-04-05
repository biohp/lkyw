<!-- 权限管理 [1.2]-->
<template>
  <div id="authority">
    <Form ref="formQuery" inline :model="form.query" label-position="right" :label-width="80">
      <FormItem label="权限名称：" prop="code">
        <Input v-model.trim="form.query.name" placeholder="输入权限名称"></Input>
      </FormItem>
      <Button type="primary" @click="query">查询</Button>
    </Form>
    <Card :bordered="false" class="card">
      <p slot="title">
        <Icon type="unlocked"></Icon>
        &nbsp;权限管理
      </p>
      <div slot="extra">
        <Button type="primary" icon="plus-round" @click="modalAdd">新增</Button>
      </div>
      <Table highlight-row :stripe="true" border :columns="columns.authority" :data="data.authority" size="small"></Table>
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
    <Modal v-model="modal.visible.save" :width="420" :mask-closable="false" @on-cancel="modalCloseSave(modal.form)">
      <p slot="header">
        <Icon :type="modal.icon"></Icon>
        <span>&nbsp;{{ modal.title }}</span>
      </p>
      <div>
        <Form ref="formSave" :model="form.save" :rules="rule.save" label-position="right" :label-width="100">
          <Card class="card" dis-hover>
            <FormItem label="权限名称：" prop="name">
              <Input v-model.trim="form.save.name" style="width: 250px" placeholder="输入权限名称"></Input>
            </FormItem>
            <FormItem label="权限编码：" prop="code">
              <Input v-model.trim="form.save.code"style="width: 250px" placeholder="输入权限编码"></Input>
            </FormItem>
            <FormItem label="权限类型：" prop="type">
              <Select v-model="form.save.type" style="width: 250px" placeholder="权限类型">
                <Option v-for="item in list.type" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="是否可见：" prop="see">
              <RadioGroup v-model="form.save.see">
                <Radio label="可见">可见</Radio>
                <Radio label="不可见">不可见</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="是否可用：" prop="use">
              <RadioGroup v-model="form.save.use">
                <Radio label="可用">可用</Radio>
                <Radio label="不可用">不可用</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="权限事件：" prop="event">
              <Input v-model="form.save.event" style="width: 250px" type="textarea" :autosize="{ minRows: 2,maxRows: 5 }" placeholder="输入权限事件"></Input>
            </FormItem>
            <FormItem label="备注信息：" prop="remark">
              <Input v-model="form.save.remark" style="width: 250px" type="textarea" :autosize="{ minRows: 2,maxRows: 5 }" placeholder="输入备注信息"></Input>
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
        <p>权限&nbsp;<strong style="color: #f60">{{ form.save.name }}</strong>&nbsp;删除后，将无法恢复！</p>
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
  name: 'authority',
  data () {
    return {
        form: {
            query: {
                name: '',
            },
            save: {
                id: '',
                name: '',
                code: '',
                type: '',
                see: '',
                use: '',
                event: '',
                remark: '',
            }
        },
        rule: {
            save: {
                name: [
                    { required: true, message: '权限名称不能为空', trigger: 'blur' }
                ],
                code: [
                    { required: true, message: '权限编码不能为空', trigger: 'blur' }
                ],
                type: [
                    { required: true, message: '权限类型不能为空', trigger: 'change' }
                ],
                see: [
                    { required: true, message: '选择是否可见', trigger: 'change' }
                ],
                use: [
                    { required: true, message: '选择是否可用', trigger: 'change' }
                ],
            } 
        },
        list: {
            type: [
                { value: '1', label: '菜单' },
                { value: '2', label: '按钮' }
            ],
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
            icon: 'unlocked',
            form: 'formSave',
        },
        columns: {
            authority: [
                {
                    title: '权限编码',
                    key: 'code',
                    align: 'center',
                    sortable: true
                },
                {
                    title: '权限名称',
                    key: 'name',
                    align: 'center',
                    sortable: true
                },
                {
                    title: '权限类型',
                    key: 'type',
                    align: 'center',
                    filters: [{
                            label: '菜单',
                            value: '菜单'
                        },{
                            label: '按钮',
                            value: '按钮'
                    }],
                    filterMultiple: false,
                    filterMethod (value, row) {
                        return row.type === value;
                    }
                },
                {
                    title: '是否可见',
                    key: 'see',
                    align: 'center',
                    filters: [{
                            label: '可见',
                            value: '可见'
                        },{
                            label: '不可见',
                            value: '不可见'
                    }],
                    filterMultiple: false,
                    filterMethod (value, row) {
                        return row.see === value;
                    }
                },
                {
                    title: '是否可用',
                    key: 'use',
                    align: 'center',
                    filters: [{
                            label: '可用',
                            value: '可用'
                        },{
                            label: '不可用',
                            value: '不可用'
                    }],
                    filterMultiple: false,
                    filterMethod (value, row) {
                        return row.use === value;
                    }
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
            authority: [
                {
                    id: '111',
                    code: '00311',
                    name: '系统管理中心',
                    type: '菜单',
                    see: '可见',
                    use: '不可用',
                    event: '点击事件',
                    remark: '',
                },
                {
                    id: '111',
                    code: '00311',
                    name: '系统管理中心',
                    type: '菜单',
                    see: '可见',
                    use: '不可用',
                    event: '点击事件',
                    remark: '',
                },
                {
                    id: '111',
                    code: '00311',
                    name: '系统管理中心',
                    type: '菜单',
                    see: '可见',
                    use: '不可用',
                    event: '点击事件',
                    remark: '',
                },
                {
                    id: '111',
                    code: '00311',
                    name: '系统管理中心',
                    type: '菜单',
                    see: '可见',
                    use: '不可用',
                    event: '点击事件',
                    remark: '',
                },
                {
                    id: '111',
                    code: '00311',
                    name: '系统管理中心',
                    type: '菜单',
                    see: '可见',
                    use: '不可用',
                    event: '点击事件',
                    remark: '',
                },
                {
                    id: '111',
                    code: '00311',
                    name: '系统管理中心',
                    type: '菜单',
                    see: '可见',
                    use: '不可用',
                    event: '点击事件',
                    remark: '',
                },
                {
                    id: '111',
                    code: '00311',
                    name: '系统管理中心',
                    type: '菜单',
                    see: '可见',
                    use: '不可用',
                    event: '点击事件',
                    remark: '',
                },
                {
                    id: '111',
                    code: '00311',
                    name: '系统管理中心',
                    type: '菜单',
                    see: '可见',
                    use: '不可用',
                    event: '点击事件',
                    remark: '',
                },
                {
                    id: '111',
                    code: '00311',
                    name: '系统管理中心',
                    type: '菜单',
                    see: '可见',
                    use: '不可用',
                    event: '点击事件',
                    remark: '',
                },
                {
                    id: '111',
                    code: '00311',
                    name: '系统管理中心',
                    type: '菜单',
                    see: '可见',
                    use: '不可用',
                    event: '点击事件',
                    remark: '',
                }
            ]
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
      this.modal.title = '新增权限';
      this.modal.icon = 'plus-round';
      this.modal.visible.save = true;
    },
    modalEdit(index) {
      this.modal.title = '编辑权限';
      this.modal.icon = 'edit';
      const data = this.data.authority[index];
      for (let key in this.form.save) {
        if (['type'].includes(key)) {
          this.form.save[key] = getOptionValue(this.list[key], data[key]);
        } else {
          this.form.save[key] = data[key];
        }
      }
      this.modal.visible.save = true;
    },
    modalDel(index) {
      this.modal.title = '删除权限';
      this.modal.icon = 'trash-a';
      const data = this.data.authority[index];
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