<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="register">
    <div class="register-header">
         <p> <img :src="logo" alt=""><i></i> <span>欢迎使用公证录音平台</span></p>
    </div>
    <div class="register-content">
        <div class="register-con">
             <Card>
               <div class="register-con-title">
                     <span v-bind:class="{onCurrent:formValidate.userType==1}" @click="changeUserType(1)">个人注册</span>
                     <!-- <span v-bind:class="{onCurrent:formValidate.userType==2}" @click="changeUserType(2)">企业注册</span> -->
                     <a>已有账号，<b @click="backPage">去登录></b></a>
               </div>

                <Form class="registerForm" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120"  v-show="current==0">
                      <FormItem label="企业名称:" prop="institutionName" v-if="formValidate.userType==2">
                        <Input v-model="formValidate.institutionName" clearable placeholder="企业名称"></Input>
                      </FormItem>
                      <FormItem  label="组织代码:" prop="licenseNumber" v-if="formValidate.userType==2">
                        <Input v-model="formValidate.licenseNumber" clearable placeholder="营业执照或组织代码" ></Input>
                      </FormItem>
                      <FormItem label="姓名:" prop="idName">
                        <Input v-model="formValidate.idName" clearable placeholder="真实姓名"></Input>
                      </FormItem>
                      <!-- <FormItem  label="身份证号:" prop="idNumber">
                        <Input v-model="formValidate.idNumber" clearable placeholder="身份证号码" ></Input>
                      </FormItem> -->
                      <FormItem label="邮箱地址:" >
                         <FormItem prop="email">
                              <Input v-model="formValidate.email" clearable placeholder="邮箱地址"></Input>
                          </FormItem>
                      </FormItem>
                      <FormItem  label="设置密码:" prop="passWord">
                        <Input v-model="formValidate.passWord" placeholder="设置密码" clearable type="password" ></Input>
                        <div class="passAlert" v-show="isAlert==true">
                          8-16位的数字、大小写字母、特殊符号组合
                        </div>
                      </FormItem>
                      <FormItem label="确认密码:" prop="passWord2">
                        <Input v-model="formValidate.passWord2" placeholder="确认密码" clearable type="password"></Input>
                      </FormItem>
                      <FormItem  label="手机号码:" prop="phone">
                        <Input v-model="formValidate.phone" clearable placeholder="手机号码" ></Input>
                        <div class="phoneNoAlert" v-show="respCode=='01'" style="color:#ED3F14">
                          该手机号码已经注册，可直接
                          <span style="color: #1781E0;text-decoration:underline" @click="backPage"> 登录</span>
                        </div>
                      </FormItem>
                      <FormItem  label="验证码:" prop="smsCode">
                        <input type="text" placeholder="验证码" v-model="formValidate.smsCode" class="ivu-input verificationCodeIpt" >
                        <span class="register-code sendCodeBtn" @click="sendCode">发送验证码</span>
                        <div class="verCodeAlert" v-show="respCode=='02'" style="color: #1781E0;">验证码发送成功，请注意查看！</div>
                        <div class="verCodeAlert" v-show="respCode=='03'" style="color: #ED3F14;">验证码错误！</div>
                        <div class="verCodeAlert" v-show="respCode=='04'" style="color: #ED3F14;">您的验证码已过期，请重新获取！</div>
                        <div class="verCodeAlert" v-show="respCode=='05'" style="color: #ED3F14;">企业/机构已被注册！</div>
                      </FormItem>

                      <Form-item style=" margin-bottom: 5px;">
                        <Button type="primary" long  @click="handleRegister  " id="registerBtn"  class="btnDisabled">完成</Button>
                      </Form-item>
                      <Form-item style="text-align:left">
                        <Checkbox v-model="isReader" style="color: #AAB2B7;">我已阅读并同意</Checkbox>
                        <router-link tag="a" target="_blank" :to="{name:'agreement'}" style="color:#1781E0">《公证录音服务协议》</router-link>
                        <!-- <a style="color:#1781E0" >《实时保服务协议》</a> -->
                      </Form-item>
                    </Form>
                <div v-show="current==2" class="successPage">
                     <Icon type="md-checkmark-circle" size="50" color="#2d8cf0"/>
                      <h4>注册成功！</h4>
                      <p><i style="color:#ED3F14">{{successTime}}</i>s后自动跳转至后自动跳转至登录页面，若未跳转，可点击<a style="color: #2d8cf0;text-decoration:underline" @click="backPage()"> 登录</a> 页面</p>
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
import { registerUser,sendCode } from '@/api/user'
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
          $(".register-code.sendCodeBtn").removeClass("canSendCode");
          callback(new Error("手机号码错误"));
        } else {
          this.canSendCode = true;
          $(".register-code.sendCodeBtn").addClass("canSendCode");
          callback();
        }
    };
    const validateIDCard = (rule, value, callback) => {
       //15位数身份证验证正则表达式：
      var isIDCard1 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
       //18位数身份证验证正则表达式 ：
      var isIDCard2 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
        if (isIDCard1.test(value.trim()) || isIDCard2.test(value.trim())) {
          callback();
        } else {
          callback(new Error("身份证号码格式错误"));
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
            callback(new Error("8-16位的数字、大小写字母、特殊符号组合"));

        } else {
            this.isAlert=true;
            callback();
        }

    };
    const validateConfirmPass = (rule, value, callback) => {
      if (value) {
        if (value != this.formValidate.passWord) {
          callback(new Error("两次密码输入不一致"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
   const validateEmail = (rule, value, callback) => {
      var isEmail = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
      if(value){
         if (isEmail.test(value.trim())) {
            callback();
          } else {
            callback(new Error("邮箱格式错误"));

        }
      }else{
         callback();
      }

    };
    return{
      logo,
      current:0,
      successTime: 3,
      spinShow:false,
      isReader:false,
      isAlert:true,
      formValidate: {
        idName: "", //真实姓名
        idNumber: "", //身份证号
        phone: "", //手机号码
        smsCode: "", //短信验证码
        passWord: "",
        email: "",
        passWord2: "",
        userType: 1, //用户类型：1:个人2：企业
        institutionName: "", //公司类型
        licenseNumber: "", //组织机构代码
        platform:this.$store.state.app.platform
      },
      ruleValidate: {
        idName: [{ required: true,  trigger: "blur" ,message: "请输入真实姓名"}],
        institutionName: [{ required: true,  trigger: "blur" ,message: "请输入企业名称"}],
        licenseNumber: [{ required: true,  trigger: "blur" ,message: "请输入组织代码"}],
        email:[{ required: true, trigger: "blur", validator: validateEmail}],
        idNumber: [
          { required: true, trigger: "blur", validator: validateIDCard }
        ],
        phone: [
          { required: true, trigger: "blur", validator: validatePhone }
        ],
        smsCode: [
          { required: true, message: "请输入短信验证码", trigger: "blur" }
        ],
        passWord: [{ required: true, trigger: "blur", validator: validatePass }],
        passWord2: [
          { required: true, trigger: "blur", validator: validateConfirmPass }
        ]
      },
      canSendCode:false,
      respCode:0,
      codeTime:''
    }
  },
  watch:{
     respCode(){
        if(this.respCode=='02'){
          var _this=this;
          setTimeout(function(){
            _this.respCode=""
          },3000)
        }
     },
     current(){
        if(this.current=='2'){
          var _this=this;
          this.successTime=3;
         var time=setInterval(function(){
            if(_this.successTime==0){
               clearInterval(time);
              _this.backPage();
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
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    changeUserType(type){
       this.formValidate.userType=type;
    },
    sendCode() {
      if (this.canSendCode) {
        var phone=this.formValidate.phone;
        var type=1;
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
            }else if (data.respCode == "1012") {
              this.$Message.info({
                    content:"该手机号已被注册！",
                    duration: 3
              });
               this.respCode = "01";
                clearInterval(this.codeTime);
                this.canSendCode = true;
                $(".register-code.sendCodeBtn").addClass("canSendCode").html("发送验证码");
            } else {
              this.$Message.error({
                content: data.respDesc,
                duration: 3
              });
               clearInterval(this.codeTime);
                this.canSendCode = true;
                $(".register-code.sendCodeBtn").addClass("canSendCode").html("重新发送");
            }

          }).catch(error => {
            console.log(error);
            clearInterval(this.codeTime);
            this.canSendCode = true;
            $(".register-code.sendCodeBtn").addClass("canSendCode").html("重新发送");
          });
        var i = 60;
        var _this=this;
        this.codeTime = setInterval(function() {
          i--;
          _this.canSendCode = false;
          $(".register-code.sendCodeBtn").removeClass("canSendCode").html(i + "s后重新发送");
          if (i == 0) {
            clearInterval(_this.codeTime);
            _this.canSendCode = true;
            $(".register-code.sendCodeBtn").addClass("canSendCode").html("重新发送");
          }
        }, 1000);
      }
    },
    handleRegister() {
      this.respCode=0;
      if (this.isReader) {
        this.$refs.formValidate.validate(valid => {
          if (valid) {
            this.spinShow = true;
            registerUser(this.formValidate)
              .then(response => {
                var res = response.data;
                this.spinShow = false;
                if (res.respCode==1000){
                  this.$Message.info({
                          content: "注册成功！",
                          duration: 3
                    });
                  this.current=2;
                } else if (res.respCode == "1011") {
                  this.$Message.info({
                        content: "验证码错误",
                        duration: 3
                  });
                  this.respCode = "03";
                }else if (res.respCode == "1014") {
                  this.$Message.info({
                        content: "您的账号已注册，无法再次注册",
                        duration: 3
                  });
                  this.respCode = "01";
                }else if (res.respCode == "1015"||res.respCode == "1016") {
                  this.$Message.info({
                        content: "企业/机构已被注册，无法再次注册",
                        duration: 3
                  });
                  this.respCode = "05";
                }else{
                  this.$Message.info({
                        content: "注册失败！",
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
      }
    },
    backPage(){
       this.$router.push({
           name:"login"
        });
    }
  }
}
</script>
