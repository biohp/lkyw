<!-- 登录 [0.2]-->
<template>
  <div id="login">
    <img class="bk" src="../../assets/bk.png">
    <div class="head">
      <Row type="flex" justify="center" align="middle">
        <Col span="1">
          <img class="head-jh" src="../../assets/jh.png">
        </Col>
        <Col span="9">
          <img src="../../assets/jjj.png">
        </Col>
      </Row>
    </div>
    <div class="body">
      <div class="body-title">
        <div class="body-title-ch">两客一危管控平台</div>
        <div class="body-title-en">Liang Ke Yi Wei Management System</div>
      </div>
      <div class="body-login">
        <div class="body-login-form">
          <Form ref="formLogin" :model="formLogin" :rules="ruleLogin" >
            <FormItem prop="user">
              <Input type="text" v-model.trim="formLogin.user" placeholder="用户名" size="large">
                <Icon type="person" slot="prepend" size="15"></Icon>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="formLogin.password" placeholder="密码" size="large" @on-enter="login('formLogin')">
                <Icon type="locked" slot="prepend" size="14"></Icon>
              </Input>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="login('formLogin')" size="large" long>登 录</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
    <div class="foot">Copyright © 2018 湘江智慧科技股份有限公司 400-800-2285</div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      formLogin: {
        user: '',
        password: '',
      },
      ruleLogin: {
        user: [
          { required: true, message: '请填写用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请填写密码', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    login(name) {
      if("admin" === this.formLogin.user && "123456" === this.formLogin.password){
        this.$Message.success('登录成功！');
        this.$router.push({ path: '/vehicle/local' });
        this.$store.dispatch('initLayout', { active: 'local', open: 'vehicle' });
      } else {
        this.$Message.error('登录失败！');
      }
    }
  }
}
</script>

<style scoped>
#login{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 33%; 
}
.bk{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 37%;
}
.head{
  position: fixed;
  top: 15%;
  left: 2%;
  width: 100%;
}
.head-jh{
  width: 53px;
  height: 53px;
}
.body{
  position: fixed;
  top: 37%;
  width: 100%;
  height: 100%;
  background: #f0f5ff;
}
.body-title{
  width: 320px;
  margin: auto;
  margin-top: 35px;
}
.body-title-ch{
  color: #262626;
  text-align: center;
  font-size: 30px;
  font-weight: 700;
  font-family:  "Helvetica Neue", Helvetica, "PingFang SC";
}
.body-title-en{
  text-align: center;
  font-size: 14px;
}
.body-login{
}
.body-login-form{
  width: 310px;
  height: 250px;
  margin: 0 auto;
  padding-top: 40px;
}
.foot{
  position: fixed;
  top: 96%;
  width: 100%;
  text-align: center;
  color: #595959;
  font-size: 13px;
} 
</style>