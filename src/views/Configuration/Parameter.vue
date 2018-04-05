<!-- 系统参数配置 [1.2]-->
<template>
  <div id="parameter">
    <Card :bordered="false" class="card">
      <p slot="title">
        <Icon type="help-circled"></Icon>
        &nbsp;系统参数
      </p>
      <div slot="extra">
        <Button type="primary" icon="plus-round" @click="modalAdd">新增</Button>
      </div>
      <Table highlight-row :stripe="true" border :columns="columns.parameter" :data="data.parameter" size="small"></Table>
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
    <Modal v-model="modal.visible.save" :width="350" :mask-closable="false" @on-cancel="modalCloseSave(modal.form)">
      <p slot="header">
        <Icon :type="modal.icon"></Icon>
        <span>&nbsp;{{ modal.title }}</span>
      </p>
      <div>
        <Form ref="formSave" :model="form.save" inline label-position="right" :label-width="90">
          <Card class="card" dis-hover>
            <FormItem label="参数类型：" prop="type">
              <Input v-model.trim="form.save.type" placeholder="输入参数类型"></Input>
            </FormItem>
            <FormItem label="参数描述：" prop="remark">
              <Input v-model="form.save.remark" type="textarea" style="width: 162px" :autosize="true" placeholder="输入描述"></Input>
            </FormItem>
            <FormItem label="参数值：" prop="value">
              <Input v-model="form.save.value" type="textarea" style="width: 162px" :autosize="true" placeholder="输入参数值"></Input>
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
        <p>参数&nbsp;&nbsp;<strong style="color: #f60">{{ form.save.type }}</strong>&nbsp;&nbsp;删除后，将无法恢复！</p>
        <p>是否继续删除？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long @click="del">删 除</Button> 
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'parameter',
  data () {
    return {
      form: {
        save: {
            id: '',
            type: '',
            remark: '',
            value: '',
        }
      },
      page: {
        total: 0,
        current: 1,
      },
      modal: {
        visible: {
          save: false,
          del: false,
        },
        title: '',
        icon: 'help-circled',
        form: 'formSave',
      },
      columns: {
        parameter: [
          {
              title: '参数类型',
              key: 'type',
              width: 200,
              align: 'center',
          },
          {
              title: '参数描述',
              key: 'remark',
              align: 'center',
          },
          {
              title: '参数值',
              key: 'value',
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
      },
      data: {
        parameter: [
            {
                id: '111',
                type: '101',
                remark: 'basecomponent.privilege.endpointUrl',
                value: 'tcp -h 10.142.127.20 -p 10000',
            },
            {
                id: '111',
                type: '101',
                remark: 'basecomponent.privilege.endpointUrl',
                value: 'tcp -h 10.142.127.20 -p 10000',
            },
            {
                id: '111',
                type: '101',
                remark: 'basecomponent.privilege.endpointUrl',
                value: 'tcp -h 10.142.127.20 -p 10000',
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
    modalAdd() {
      this.modal.title = '新增参数';
      this.modal.icon = 'plus-round';
      this.modal.visible.save = true;
    },
    modalEdit(index) {
      this.modal.title = '编辑参数';
      this.modal.icon = 'edit';
      const data = this.data.parameter[index];
      for (let key in this.form.save) {
        this.form.save[key] = data[key];
      }
      this.modal.visible.save = true;
    },
    modalDel(index) {
      this.modal.icon = 'trash-a';
      this.modal.title = '删除参数';
      const data = this.data.parameter[index];
      for (let key in this.form.save) {
        if (['id','type'].includes(key)) {
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