<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-header">
         <p> <img :src="logo" alt=""><i></i> <span>欢迎使用云录音</span></p>
    </div>
    <div class="login-content-yp">
        <div class="login-con">
          <Card icon="log-in" title="登录" :bordered="false">
            <div class="form-con">
              <login-form @on-success-valid="handleSubmit" :respCode='respCode' :loading='loading'></login-form>
            </div>
          </Card>
        </div>

    </div>
      <Footer></Footer>
  </div>
</template>

<script>
import LoginForm from '_c/login-form-yp'
import Footer from './footer.vue'
import logo from '@/assets/images/yp-logo.png';
import {loginYun} from '@/api/user'

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
    handleSubmit ({authKey, authSecret,phone,smsCode}) {
      this.loading=true;
      this.respCode=0;
      loginYun({authKey, authSecret,phone,smsCode}).then(res => {
           var data=res.data.bizData;
            this.loading=false;
          if(data.code=="1000"){
            window.location.href=data.data;

          }else{
            this.respCode=data.code*1;
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
