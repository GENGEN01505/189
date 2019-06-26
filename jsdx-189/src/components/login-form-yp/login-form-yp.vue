<template>
  <Form ref="loginForm" :model="form" :rules="ruleValidate" @keydown.enter.native="handleSubmit"  class="login-form">
    <FormItem prop="authKey">
      <Input v-model="form.authKey" clearable placeholder="请输入用户名">
        <span slot="prepend">
          <Icon :size="18" type="md-person" color="#A1ADB8"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="authSecret">
      <Input type="password" v-model="form.authSecret" clearable placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="18" type="md-lock" color="#A1ADB8"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="phone">
      <Input v-model="form.phone" clearable placeholder="请输入云盘号码">
        <span slot="prepend">
          <Icon :size="18" type="md-phone-portrait" color="#A1ADB8"></Icon>
        </span>
      </Input>
    </FormItem>
      <FormItem  prop="smsCode" v-show="isPhone==true">
        <input type="text" placeholder="验证码" v-model="form.smsCode" class="ivu-input verificationCodeIpt" >
        <span class="sendCodeBtn" @click="sendCode">发送验证码</span>
        <div class="verCodeAlert" v-show="verifyBox=='01'&&respCode==0" style="color: #ED3F14;">请输入验证码</div>
        <div class="verCodeAlert" v-show="verifyBox=='03'&&respCode==0" style="color: #ED3F14;">{{respDesc}}</div>
        <div class="verCodeAlert" v-show="verifyBox=='02'" style="color: #1781E0;">验证码发送成功，请注意查看！</div>
        <div class="verCodeAlert" v-show="respCode==1009||respCode==1008" style="color: #ED3F14;">验证码错误！</div>
        <div class="verCodeAlert" v-show="respCode==1005" style="color: #ED3F14;">云盘登录失败！</div>
        <div class="verCodeAlert" v-show="respCode==1001" style="color: #ED3F14;">云盘号码未开通云盘功能！</div>
        <div class="verCodeAlert" v-show="respCode==1003" style="color: #ED3F14;">云盘号码不存在！</div>
        <div class="verCodeAlert" v-show="respCode==1010" style="color: #ED3F14;">用户名或云密码错误！</div>
        <div class="verCodeAlert" v-show="respCode==1011" style="color: #ED3F14;">用户名或云盘号码错误！</div>
    </FormItem>
    <FormItem prop="yz"  v-show="isPhone==false">
      <div id="verify_box">
        <div id="verify_xbox" v-if="isTG==false">
          <div id="btn" >
             <img :src="left" style="width: 16px;">
          </div>
         </div>
         <div id="verify_xbox"  v-else-if="isTG==true">
            验证通过
           <div id="btn">
             <img :src="right" style="margin-top: 5px;">
          </div>
         </div>
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;按住滑块，拖动到最右边
       </div>
       <p class="loginAlert" v-show="verifyBox==2">验证不通过</p>
       <p class="loginAlert" v-show="respCode==1005">云盘登录失败</p>
       <p class="loginAlert" v-show="respCode==1001">云盘号码未开通云盘功能</p>
       <p class="loginAlert" v-show="respCode==1003">云盘号码不存在</p>
       <p class="loginAlert" v-show="respCode==1010">用户名或密码错误</p>
       <p class="loginAlert" v-show="respCode==1011">用户名或云盘号码错误</p>
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" type="primary" long style="line-height:1.9;font-size:14px" :loading='loading'>登录</Button>
    </FormItem>
  </Form>
</template>
<script>
import "@/assets/jquery-1.11.js";
import left from '@/assets/images/left.png';
import right from '@/assets/images/right.png';
import {sendCode } from '@/api/user'
export default {
  data () {
    const validatePhone = (rule, value, callback) => {
        var reg = /^((1[3456789]{1}[0-9]{1})+\d{8})$/g;
        if(value){
          if (!reg.test(value.trim())) {
              this.isPhone=false;
              this.canSendCode = false;
              $(".sendCodeBtn").removeClass("canSendCode");
              callback();
            } else {
              this.isPhone=true;
              this.canSendCode = true;
              $(".sendCodeBtn").addClass("canSendCode");
              callback();
            }
        }else{
            this.isPhone=true;
            this.canSendCode = false;
            $(".sendCodeBtn").removeClass("canSendCode");
            callback(new Error("用户名不能为空"));
        }

    };
    return {
      form: {
        authKey:'',
        authSecret:'',
        phone:'',
        smsCode:''
      },
      isPhone:false,
      left,
      right,
      isTG:false,
      verifyBox:'',
      respDesc:'',
      codeTime:'',
      ruleValidate: {
          authKey: [
              { required: true, trigger: "blur", validator: validatePhone  }
          ],
          authSecret: [
              { required: true, trigger: "blur",message: '密码不能为空',},
          ],
          phone: [
            { required: true, message: '云盘号码不能为空', trigger: 'blur' }
           ],
      },
    }
  },
  props:{
    respCode: {
      type: Number,
      default: 0
    },
    loading: {
      type: Boolean,
      default: false
    },
  },
  watch:{
    respCode(code){
        if(code==1010){
           this.verifyBox=1;
           setTimeout(()=>{
               this.verifyBox=0;
           },3000)
        }
    },
    verifyBox(){
      if(this.verifyBox){
        setTimeout(()=>{
               this.verifyBox='';
           },3000)
      }
    }
  },
   mounted: function() {
    this.$nextTick(() => {
         this.init();
         this.isPhone=true;

    });
  },
  beforeDestroy () {
      clearInterval(this.codeTime)
  },
  methods: {
      init(){
       var _this=this;
      var box=document.getElementById('verify_box');
      var xbox=document.getElementById('verify_xbox');
      var element=document.getElementById('btn');
      var b=box.offsetWidth;var o=element.offsetWidth;
      element.ondragstart=function(){return false;};
      element.onselectstart=function(){return false;};
      element.onmousedown=function(e){
        var disX=e.clientX-element.offsetLeft;
        document.onmousemove=function(e){
          var l=e.clientX-disX+o;if(l<o){l=o}
          if(l>b){l=b}
          xbox.style.width=l+'px';
        };
         document.onmouseup=function(e){
           var l=e.clientX-disX+o;
           if(l<b){l=o;_this.isTG = false;}else{l=b;_this.isTG = true;_this.verifyBox='';}
          xbox.style.width=l+'px';
          document.onmousemove=null;
          document.onmouseup=null;
        };
      }
    },
     sendCode() {
      if (this.canSendCode) {
        var phone=this.form.authKey;
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
              this.verifyBox = "02";
            }else{
              this.$Message.info({
                    content:"该手机号不存在！",
                    duration: 3
              });
               this.respDesc=data.respDesc;
               this.verifyBox = "03";
                 clearInterval(this.codeTime);
                this.canSendCode = true;
                $(".sendCodeBtn").addClass("canSendCode").html("重新发送");
            }
          }).catch(error => {
            console.log(error);
            clearInterval(this.codeTime);
            this.canSendCode = true;
            $(".sendCodeBtn").addClass("canSendCode").html("重新发送");
          });
        var i = 60;
        var _this=this;
        this.codeTime = setInterval(function() {
          i--;
          _this.canSendCode = false;
          $(".sendCodeBtn").removeClass("canSendCode").html(i + "s后重新发送");
          if (i == 0) {
            clearInterval(_this.codeTime);
            _this.canSendCode = true;
            $(".sendCodeBtn").addClass("canSendCode").html("重新发送");
          }
        }, 1000);
      }
    },
    handleSubmit () {
      if(this.isPhone){
         if(this.form.smsCode){
              this.verifyBox='';
          this.$refs.loginForm.validate((valid) => {
            if (valid) {
              this.$emit('on-success-valid', {
                 authKey: this.form.authKey,
                 authSecret: this.form.authSecret,
                 phone: this.form.phone,
                 smsCode:this.form.smsCode
              })
            }else {
               return false;
             }
          })
         }else{
            this.verifyBox='01';
         }

      }else{
        if(this.isTG){
          this.verifyBox='';
          this.$refs.loginForm.validate((valid) => {
            if (valid) {
              this.$emit('on-success-valid', {
                  authKey: this.form.authKey,
                  authSecret: this.form.authSecret,
                  phone: this.form.phone,
                  smsCode:''
                })
                }
              })
          }else{
            this.verifyBox=2;
          }
      }
    }
  }
}
</script>
