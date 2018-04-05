<!-- 角色管理 [1.2]-->
<template>
  <div id="role">
    <Form ref="formQuery" inline :model="form.query" label-position="right" :label-width="80">
      <FormItem label="角色：" prop="name">
        <Input v-model.trim="form.query.name" placeholder="输入角色名称"></Input>
      </FormItem>
      <Button type="primary" @click="query">查询</Button>
    </Form>
    <Card :bordered="false" class="card">
      <p slot="title">
        <Icon type="android-contact"></Icon>
        &nbsp;角色信息
      </p>
      <div slot="extra">
        <Button type="primary" icon="plus-round" @click="modalAdd">新增</Button>
      </div>
      <Table highlight-row :stripe="true" border :columns="columns.role" :data="data.role" size="small"></Table>
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
    <Modal v-model="modal.visible.save" :width="450" :mask-closable="false" @on-cancel="modalCloseSave(modal.form)">
      <p slot="header">
        <Icon :type="modal.icon"></Icon>
        <span>&nbsp;{{modal.title}}</span>
      </p>
      <div>
        <Form ref="formSave" :model="form.save" :rules="rule.save" label-position="right" :label-width="100">
          <Card class="card" dis-hover>
            <FormItem label="角色名称：" prop="name">
              <Input v-model.trim="form.save.name" placeholder="输入角色名"></Input>
            </FormItem>
            <FormItem label="角色描述：" prop="remark">
              <Input v-model="form.save.remark" type="textarea" placeholder="输入描述信息"></Input>
            </FormItem>
            <FormItem label="角色权限：">
              <Poptip placement="right-start" :width="300">
                <Button type="primary" icon="unlocked">添加权限</Button>
                <div slot="content">
                  <Tree ref="treeAuthority" :data="list.authority" multiple show-checkbox @on-check-change="checkAuthority"></Tree>
                </div>
              </Poptip>
            </FormItem>
          </Card>
        </Form> 
      </div> 
      <div slot="footer">
        <Button type="primary" @click="save(modal.form)">保存并分配权限</Button>
        <Button type="ghost" @click="reset(modal.form)">重置</Button>
      </div>
    </Modal>
    <Modal v-model="modal.visible.del" :width="360" :mask-closable="false">
      <p slot="header" class="modal-del-title">
        <Icon :type="modal.icon"></Icon>
        <span>&nbsp;{{ modal.title }}</span>
      </p>
      <div style="text-align: center">
        <p>角色&nbsp;&nbsp;<strong style="color: #f60">{{ form.save.name }}</strong>&nbsp;&nbsp;删除后，将无法恢复！</p>
        <p>是否继续删除？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long @click="del">删 除</Button>
      </div>
    </Modal>
    <Modal v-model="modal.visible.show" :width="300" :closable="false">
      <p slot="header">
        <Icon type="person"></Icon>
        <span>&nbsp;{{ modal.title }}</span>
      </p>
      <div style="text-align: center">
        <Table :height="250" :columns="columns.user" :data="data.user" size="small" :show-header="false"></Table>
      </div>
      <div slot="footer">
        <Button type="primary" long @click="modalCloseShow">关 闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getTreeValue, resetTree, setTree } from '../../utils/component.js';
export default {
  name: 'role',
  data () {
    return {
        form: {
            query: {
                name: '',
            },
            save: {
                id: '',
                name: '',
                remark: '',
                authority: [],
            }
        },
        rule: {
            save: {
                name: [
                    { required: true, message: '角色名不能为空', trigger: 'blur' }
                ],
            },
        },
        list: {
            authority: [
                {
                    title: '用户管理',
                    children: [
                        {
                            title: '新增按钮',
                            value: '002'
                        },{
                            title: '删除按钮',
                            value: '003',  
                        },{
                            title: '编辑按钮',
                            value: '004',
                        } 
                    ],
                },{
                    title: '权限管理',
                    children: [
                        {
                            title: '新增按钮',
                            value: '006',
                        },{
                            title: '删除按钮',
                            value: '007',  
                        },{
                            title: '编辑按钮',
                            value: '008',
                        } 
                    ],
                }
            ]
        },
        page: {
            current: 1,
            total: 0
        },
        modal: {
            visible: {
                save: false,
                del: false,
                show: false
            },
            title: '',
            icon: 'android-contact',
            form: 'formSave',
        },
        columns: {
            role: [
                {
                    title: '角色名称',
                    key: 'name',
                    align: 'center',
                    sortable: true
                },
                {
                    title: '角色描述',
                    key: 'remark',
                    align: 'center'
                },
                {
                    title: '角色用户',
                    key: 'user',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'success',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.modalShow(params.index)
                                    }
                                }
                            }, '查看用户')
                        ]);
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
            user: [
                {
                    title: '用户',
                    key: 'name',
                    align: 'center'
                }
            ],
        },
        data: {
            role: [
                {
                    id: '111',
                    name: '超级管理员',
                    remark: 18,
                    authority: ['002','003'],
                },
                {
                    id: '111',
                    name: '集成平台用户',
                    remark: 24,
                    authority: ['002','006'],
                },
                {
                    id: '111',
                    name: '总队用户',
                    remark: 30,
                    authority: ['002','003','005','006'],
                },
                {
                    id: '111',
                    name: '支队用户',
                    remark: 26,
                    authority: ['002','003','004'],
                }
            ],
            user: [
                {name: '彭万里'},
                {name: '高大山'},
                {name: '谢大海'},
                {name: '马宏宇'},
                {name: '林莽'},
                {name: '黄强辉'},
                {name: '章汉夫'},
                {name: '范长江'},
                {name: '林君雄'},
                {name: '谭平山'}
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
    modalShow(index) {
      this.modal.title = '角色用户';
      this.modal.visible.show = true;
    },
    //页面交互
    checkAuthority() {
      this.form.save.authority = getTreeValue(this.$refs.treeAuthority.getCheckedNodes());
    },
    modalAdd(index) {
      this.modal.title = '新增角色';
      this.modal.icon = 'plus-round';
      this.modal.visible.save = true;
    },
    modalEdit(index) {
      this.modal.title = '编辑角色';
      this.modal.icon = 'edit';
      const data = this.data.role[index];
      for (let key in this.form.save) {
        if (['authority'].includes(key)) {
          this.form.save[key] = setTree(this.list[key], data[key]);
        } else {
          this.form.save[key] = data[key];
        }
      }
      this.modal.visible.save = true;
    },
    modalDel(index) {
      this.modal.title = '删除角色';
      this.modal.icon = 'trash-a';
      const data = this.data.role[index];
      for (let key in this.form.save) {
        if (['id','name'].includes(key)) {
          this.form.save[key] = data[key];
        }
      }
      this.modal.visible.del = true;
    },
    modalCloseSave(name) {
      this.$refs[name].resetFields();
      this.list.authority = resetTree(this.list.authority);
      this.form.save.authority = [];
      this.form.save.id = '';
      this.$Message.warning('本次操作已取消！');
    },
    modalCloseShow() {
      this.modal.visible.show = false;
    },
    reset(name) {
      this.$refs[name].resetFields();
      this.list.authority = resetTree(this.list.authority);
      this.form.save.authority = [];
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