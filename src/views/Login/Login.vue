<!-- 登录 -->
<template>
  <div id="login">
      <div class="login-head">
        <Row type="flex" align="middle">
            <Col span="1">
                <img class="login-head-img" src="../../assets/jh.png">
            </Col>
            <Col span="9">
                <div class="login-head-title">
                  湖南省高速公路郴州支队交通警察局
                </div>
            </Col>
        </Row>
      </div>
      <div class="login-title">
        <img class="login-title-img" src="../../assets/title.png">
      </div>
      <div class="login-content">
        <div class="login-box">
          <div class="login-box-form">
            <Form ref="formLogin" :model="formLogin" :rules="ruleLogin" >
                <FormItem prop="user">
                    <Input type="text" v-model.trim="formLogin.user" placeholder="用户名" size="large">
                        <Icon type="person" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem prop="password">
                    <Input type="password" v-model="formLogin.password" placeholder="密码" size="large" @on-enter="login('formLogin')">
                        <Icon type="locked" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="login('formLogin')" size="large" long>登 录</Button>
                </FormItem>
            </Form>
          </div>
        </div>
      </div>
      <div class="login-foot">Copyright © 2018 湘江智慧科技股份有限公司 400-800-2285</div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
      return {
        formLogin: {
            user: '',
            password: ''
        },
        ruleLogin: {
            user: [
                { required: true, message: '请填写用户名', trigger: 'blur' }
            ],
            password: [
                { required: true, message: '请填写密码', trigger: 'blur' }
            ]
        }
      }
  },
  methods: {
    login(name) {
        //axios()
          if("admin"===this.formLogin.user&&"123456"===this.formLogin.password){
              this.$Message.success('登录成功!');
              this.$router.push({ path: '/vehicle/all'});
              this.$store.dispatch('initLayout', {active: 'all', open: 'vehicle'});
          } else {
              this.$Message.error('登录失败!');
          }
    }
  }
}
</script>

<style scoped>
  #login{
    position:fixed;
    top: 0;
    left: 0;
    width:100%;
    height:100%;
    background-image: linear-gradient(143deg,#2945cb 20%,#2b83f9 81%,#3a9dff); 
  }
  .login-bk{
    height: 1330px;
    margin-left: 420px;
  }
  .login-head{
    position:fixed;
    top: 2%;
    left: 2%;
    width: 100%;
  }
  .login-head-img{
    width: 53px;
    height: 53px;
  }
  .login-head-title{
    width: 100%;
    color: #f0f5ff;
    font-size: 28px;
    font-weight: 600;
    font-family: "Microsoft JhengHei","Helvetica Neue",Helvetica,"PingFang SC";
  }
  .login-title{
    position:fixed;
    top: 22%;
    width: 100%;
    text-align: center;
  }
  .login-content{
    position:fixed;
    top: 43%;
    width: 100%;
    height: 100%;
  }
  .login-box{
    margin: auto;
    width: 350px;
    height: 240px;
    background: rgba(255,255,255,0.9);
    border-radius: 8px;
  }
  .login-box-form{
    width: 270px;
    height: 250px;
    margin: 0 auto;
    padding-top: 40px;
  }
  .login-foot{
    position:fixed;
    top: 96%;
    width: 100%;
    text-align: center;
    color: #d9d9d9;
    font-size: 13px;
  } 
</style>