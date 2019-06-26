<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="register">
    <div class="register-header">
         <p> <img :src="logo" alt=""><i></i> <span>欢迎使用公证录音平台</span></p>
          <div class="enterBrn">
              <a @click="backPage('register')">注册</a>
              <a>|</a>
              <a @click="backPage('login')">登录</a>
          </div>
    </div>
    <div class="register-content">
        <div class="register-con">
             <Card>
               <div class="register-con-title">找回密码</div>
                <Steps :current="current" class="steps">
                    <Step title="身份验证"></Step>
                    <Step title="重置密码"></Step>
                    <Step title="设置成功"></Step>
                </Steps>
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120" v-show="current==0">
                    <FormItem label="电话号码：" prop="phone">
                        <Input v-model="formValidate.phone" clearable  placeholder="请输入电话号码"></Input>
                    </FormItem>
                     <FormItem  label="验证码：" prop="smsCode">
                        <!-- <Input v-model="formValidate.verCode"   placeholder="验证码" class="verificationCodeIpt"></Input> -->
                        <input type="text" placeholder="验证码" v-model="formValidate.smsCode" class="ivu-input verificationCodeIpt" >
                        <span class="pass-code sendCodeBtn" @click="sendCode">发送验证码</span>
                        <div class="verCodeAlert" v-show="respCode=='02'" style="color: #1781E0;">验证码发送成功，请注意查看！</div>
                        <div class="verCodeAlert" v-show="respCode=='03'" style="color: #ED3F14;">验证码错误！</div>
                        <div class="verCodeAlert" v-show="respCode=='04'" style="color: #ED3F14;">身份验证失败，请重试！</div>
                        <div class="verCodeAlert" v-show="respCode=='05'" style="color: #ED3F14;">{{respDesc}}</div>
                        <div class="verCodeAlert" v-show="respCode=='06'" style="color: #ED3F14;">该手机号不是该平台用户不能进行操作！</div>
                      </FormItem>
                    <FormItem>
                        <Button type="primary" long @click="validataFun">下一步</Button>
                    </FormItem>
                </Form>
                <Form ref="formPass" :model="formPass" :rules="ruleValidate" :label-width="120" v-show="current==1">
                    <FormItem label="新密码：" prop="newPass">
                        <Input v-model="formPass.newPass" type="password" clearable placeholder="请输入新密码"></Input>
                        <div class="passAlert" v-show="isAlert==true">
                          8-16位的数字、大小写字母、特殊符号组合
                        </div>
                    </FormItem>
                    <FormItem label="确认密码" prop="confirmPass">
                        <Input v-model="formPass.confirmPass" type="password" clearable  placeholder="请输入确认密码"></Input>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" long @click="resetPass">下一步</Button>
                    </FormItem>
                </Form>
                <div v-show="current==2" class="successPage">
                     <Icon type="md-checkmark-circle" size="50" color="#2d8cf0"/>
                      <h4>密码修改成功！</h4>
                      <p><i style="color:#ED3F14">{{successTime}}</i>s后自动跳转至后自动跳转至登录页面，若未跳转，可点击<a style="color: #2d8cf0;text-decoration:underline" @click="backPage('login')" > 登录</a> 页面</p>
                </div>

             </Card>
              <Footer></Footer>
        </div>
    </div>
      <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
import "@/assets/jquery-1.11.js";
import { mapActions } from 'vuex'
import { authentication,sendCode,reset_passeord} from '@/api/user'
import logo from '@/assets/images/login-logo.png';
import Footer from './footer.vue'
export default {
  components:{
      Footer
  },
  data(){
    const validatePhone = (rule, value, callback) => {
        var reg = /^((1[3456789]{1}[0-9]{1})+\d{8})$/g;
        if (!reg.test(value.trim())) {
            this.canSendCode = false;
          $(".pass-code.sendCodeBtn").removeClass("canSendCode");
          callback(new Error("手机号码错误"));
        } else {
          this.canSendCode = true;
          $(".pass-code.sendCodeBtn").addClass("canSendCode");
          callback();
        }
    };
    const validatePass = (rule, value, callback) => {
        var str=value;
        var regNum = /[0-9]/;
        var regUpper = /[A-Z]/;
        var regLower = /[a-z]/;
        var regStr = /[^A-Za-z0-9]/;
        var complex = 0;
        if (regNum.test(str)) {
            ++complex;
        }
        if (regLower.test(str)) {
            ++complex;
        }
        if (regUpper.test(str)) {
            ++complex;
        }
        if (regStr.test(str)) {
            ++complex;
        }
        if (complex < 4 || str.length < 8) {
            this.isAlert=false;
            callback(new Error("8-16位的数字、大小字母、特殊符号组合"));
        } else {
            this.isAlert=true;
            callback();
        }

    };
    const validateConfirmPass = (rule, value, callback) => {
      if (value) {
        if (value != this.formPass.newPass) {
          callback(new Error("两次密码输入不一致"));
        } else {
          callback();
        }
      } else {
        callback(new Error("请输入确认密码"));
      }
    };
    return{
      logo,
      current:0,
      successTime: 3,
      formValidate:{
         smsCode:"",
         phone:'',
         platform:this.$store.state.app.platform
      },
      formPass:{
          newPass:'',
          confirmPass:''
      },
      ruleValidate: {
        smsCode: [
            { required: true, message: '请输入验证码', trigger: 'change' }
        ],
        phone: [
            { required: true, trigger: "blur", validator: validatePhone},
        ],
        newPass: [{ required: true, trigger: "blur", validator: validatePass }],
        confirmPass: [{ required: true, trigger: "blur", validator: validateConfirmPass }]
      },
      canSendCode:false,
      isAlert:true,
      respCode:0,
      respDesc:'',
      spinShow:false,
      codeTime:''
    }
  },
   watch:{
     respCode(){
          var _this=this;
          setTimeout(function(){
            _this.respCode=""
          },3000)
     },
    current(){
        if(this.current=='2'){
          var _this=this;
          this.successTime=3;
         var time=setInterval(function(){
            if(_this.successTime==0){
               clearInterval(time);
              _this.backPage('login');
             }
             _this.successTime=_this.successTime-1;
          },1000)
        }
     },
  },
  beforeDestroy () {
    clearInterval(this.codeTime)
  },
  methods: {
    sendCode(){
      if(this.canSendCode){
        var phone=this.formValidate.phone;
        var type=2;
        var platform=this.$store.state.app.platform;
        sendCode({phone,type,platform})
          .then(response => {
            var data = response.data;
            if (data.respCode == "1000") {
               this.$Message.info({
                    content:"验证码已发送，请注意查收！",
                    duration: 3
              });
              this.respCode = "02";
            }else if(data.respCode == "1015"){
                this.$Modal.info({
                    title: "系统提醒",
                    content:"尊敬的用户：</br><span style='display:inline-block;width:25px'></span>为提升用户使用体验，自2019年4月1日起实时保公证录音管理平台网站迁移至新平台，启用新域名：<a href='https://189js.1010bao.com'>189js.1010bao.com</a>，敬请访问并收藏！<p style='text-align:right'>特此公告。</p><p style='text-align:right'>实时保公证录音</p><p style='text-align:right'>2019.4</p>",
                    okText: '我知道了',
                    onOk: () => {}
                });
               this.respCode = "06";
               clearInterval(this.codeTime);
               this.canSendCode = true;
               $(".pass-code.sendCodeBtn").addClass("canSendCode").html("重新发送");
            }else {
              this.$Message.info({
                    content:data.respDesc,
                    duration: 3
              });
               this.respCode = "05";
                this.respDesc=data.respDesc;
                 clearInterval(this.codeTime);
                this.canSendCode = true;
                $(".pass-code.sendCodeBtn").addClass("canSendCode").html("重新发送");
            }
          }).catch(error => {
            console.log(error);
            clearInterval(this.codeTime);
            this.canSendCode = true;
            $(".pass-code.sendCodeBtn").addClass("canSendCode").html("重新发送");
          });
          var i = 60;
          var _this=this;
          this.codeTime = setInterval(function() {
              i--;
              _this.canSendCode = false;
              $(".pass-code.sendCodeBtn").removeClass("canSendCode").html(i + "s后重新发送");
              if (i == 0) {
                  clearInterval(_this.codeTime);
                  _this.canSendCode = true;
                  $(".pass-code.sendCodeBtn").addClass("canSendCode").html("重新发送");
               }
        }, 1000);
      }

    },
    validataFun(){

         this.$refs.formValidate.validate(valid => {
          if (valid) {
            this.spinShow = true;
            authentication(this.formValidate)
              .then(response => {
                var res = response.data;
                this.spinShow = false;
                if (res.respCode == "1000") {
                    this.current=1;
                }else  if (res.respCode == "1003") {
                   this.$Message.info({
                      content:"验证码错误",
                      duration: 3
                   });
                   this.respCode='03';
                }else{
                   this.$Message.info({
                      content:"身份验证失败",
                      duration: 3
                   });
                   this.respCode='04';
                }
              })
              .catch(error => {
                console.log(error);
                this.spinShow = false;
              });
          } else {
            return false;
          }
        });
    },
    resetPass(){
      this.$refs.formPass.validate(valid => {
          if (valid) {
            var data={
               newPassword:this.formPass.newPass,
               newPassword2:this.formPass.confirmPass,
               phone:this.formValidate.phone,
               smsCode:this.formValidate.smsCode,
               platform:this.formValidate.platform
            }
            this.spinShow = true;
            reset_passeord(data).then(response => {
                var res = response.data;
                this.spinShow = false;
                if (res.respCode == "1000") {
                      this.current=2;
                }else {
                  this.$Message.error({
                    content:res.respDesc,
                    duration: 3
                  });
                }
              })
              .catch(error => {
                console.log(error);
                this.spinShow = false;
              });
          } else {
            return false;
          }
        });

    },
    backPage(path){
      this.$router.push({
          name:path
       })
      //  this.$router.push(path);
    }
  }
}
</script>
