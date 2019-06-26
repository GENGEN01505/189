<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-header">
         <p> <img :src="logo" alt=""><i></i> <span>欢迎使用公证录音平台</span></p>
    </div>
    <div class="login-content">
        <div class="login-con">
          <Card icon="log-in" title="欢迎登录" :bordered="false">
            <div class="form-con">
              <login-form @on-success-valid="handleSubmit" :respCode='respCode' :loading='loading'></login-form>
              <div class="login-tip">
                 <!-- <router-link tag="a" target="_blank" :to="{name:'helpWord'}"  class="clickSpan">《公证录音使用手册》</router-link> -->
                <a href="https://rdbao-common-resource.oss-cn-hangzhou.aliyuncs.com/189/V3%E4%B8%8A%E6%B5%B7%E5%BD%95%E9%9F%B3%E5%B9%B3%E5%8F%B0%E6%93%8D%E4%BD%9C%E6%89%8B%E5%86%8C-%E6%9B%B4%E6%96%B0.docx" download="公证录音使用手册">《公证录音使用手册》</a>
                 <!-- <a @click="routerChange('helpWord')">《公证录音使用手册》</a> -->
                 <span>
                     <a @click="routerChange('register')">注册账户</a>
                     <a>|</a>
                     <a @click="routerChange('passwordBack')">忘记密码?</a>
                 </span>
              </div>

            </div>
             <router-link tag="a" target="_blank" :to="{name:'pan'}" type="default"  class="search-day">天翼企业云盘</router-link>
             <!-- <Button @click="routerChange('pan')" class="search-day" type="default">天翼企业云盘</Button> -->
          </Card>
        </div>

    </div>
      <Footer></Footer>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
import { loginJS } from '@/api/user'
import Footer from './footer.vue'
import logo from '@/assets/images/login-logo.png';

export default {
  data(){
    return{
      logo,
      respCode:0,
      loading:false
    }
  },
  components: {
    LoginForm,
    Footer
  },
  watch:{
     respCode(){
        if(this.respCode!=0){
           setTimeout(()=>{
               this.respCode=0;
           },3000)
        }
    }
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo',
      'getUserMenu'
    ]),
    handleSubmit ({ userName, password, smsCode,loginType}) {
      this.loading=true;
      var platform=this.$store.state.app.platform;
      var phone=userName,passWord=password;
      this.respCode=0;
      this.handleLogin({phone,passWord,loginType,platform,smsCode}).then(res => {
         this.loading=false;
        if(res.respCode==1000){
            this.getUserInfo().then(response => {
                  var data=response.data;
                  if(data.respCode==1000){
                      if(data.activate=="8001"){
                          this.$router.push({
                              name: this.$config.homeName
                            })
                      }else if(data.activate=="8002"){
                          this.$router.push({
                              name:"updatePassword"
                            })
                      }else{
                          this.$router.push({
                              name: this.$config.homeName
                            })
                      }

                    }

                  }).catch(err => {
                      console.log(err)
                  })
        }else{
           this.respCode=res.respCode;
        }

      }).catch(err => {
          this.loading=false;
          console.log(err)
      })
    },
    routerChange(path){
       this.$router.push({
          name:path
        })
    }
  }
}
</script>
