<template>
  <Form ref="loginForm" :model="form" :rules="ruleValidate" @keydown.enter.native="handleSubmit" class="login-form">
    <FormItem prop="userName">
      <Input v-model="form.userName" placeholder="请输入用户名">
        <span slot="prepend">
          <Icon :size="18" type="md-person" color="#A1ADB8"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input type="password" v-model="form.password" placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="18" type="md-lock" color="#A1ADB8"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem  prop="smsCode" v-show="isPhone==true" >
        <input type="text" placeholder="验证码" v-model="form.smsCode" class="ivu-input verificationCodeIpt" >
        <span class="login-code sendCodeBtn" @click="sendCode">发送验证码</span>
         <div class="verCodeAlert" v-show="verifyBox=='01'&&respCode==0" style="color: #ED3F14;">请输入验证码</div>
         <div class="verCodeAlert" v-show="verifyBox=='03'&&respCode==0" style="color: #ED3F14;">手机号不存在</div>
         <div class="verCodeAlert" v-show="verifyBox=='04'&&respCode==0" style="color: #ED3F14;">{{respDesc}}</div>
         <div class="verCodeAlert" v-show="verifyBox=='05'&&respCode==0" style="color: #ED3F14;">登录用户不是该平台用户不能登录!</div>
        <div class="verCodeAlert" v-show="verifyBox=='02'" style="color: #1781E0;">验证码发送成功，请注意查看！</div>
        <div class="verCodeAlert" v-show="respCode==1010" style="color: #ED3F14;">用户名或密码错误！</div>
        <div class="verCodeAlert" v-show="respCode==1011" style="color: #ED3F14;">验证码错误！</div>
        <div class="verCodeAlert" v-show="respCode==1017" style="color: #ED3F14;">登录用户不是该平台用户不能登录！</div>
    </FormItem>
    <FormItem prop="yz" v-show="isPhone==false">
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
       <p class="loginAlert" v-show="respCode==1010">用户名或密码错误</p>
       <p class="loginAlert" v-show="respCode==1011">验证码错误</p>
       <p class="loginAlert" v-show="respCode==1017">登录用户不是该平台用户不能登录</p>
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" type="primary" long style="line-height:1.9;font-size:14px" :loading="loading">登录</Button>
    </FormItem>
  </Form>
</template>
<script>
import "@/assets/jquery-1.11.js";
import left from '@/assets/images/left.png';
import right from '@/assets/images/right.png';
import {sendCode,getJSEuser } from '@/api/user'
export default {
  data () {
      const validatePhone = (rule, value, callback) => {
        var reg = /^((1[3456789]{1}[0-9]{1})+\d{8})$/g;
        var zuoNum = /^0[0-9]{2,3}[0-9]{8}$/;
        if(value){
          if (!reg.test(value.trim())) {
              if(!zuoNum.test(value.trim())){
                 this.loginType="nameCode";
              }else{
                 this.loginType="phoneCode";
              }
              this.isPhone=false;
              this.canSendCode = false;
              $(".login-code.sendCodeBtn").removeClass("canSendCode");
              callback();
            } else {
              this.loginType="phoneCode";
              this.isPhone=true;
              this.canSendCode = true;
              $(".login-code.sendCodeBtn").addClass("canSendCode");
              callback();
            }
        }else{
            this.isPhone=true;
            this.canSendCode = false;
            $(".login-code.sendCodeBtn").removeClass("canSendCode");
            callback(new Error("用户名不能为空"));
        }

    };
    return {
      isPhone:false,
      form: {
        userName: '',
        password: '',
        smsCode:''
      },
     ruleValidate: {
          userName:[ { required: true, trigger: "blur", validator: validatePhone }],
          password: [
              { required: true, trigger: "blur",message: '密码不能为空',},
          ],
      },
      left,
      right,
      isTG:false,
      verifyBox:'',
      canSendCode:false,
      codeTime:"",
      loginType:'',
      respDesc:''
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
        var phone=this.form.userName;
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
            }else if(data.respCode == "1015"){
                this.$Modal.info({
                    title: "系统提醒",
                    content:"尊敬的用户：</br><span style='display:inline-block;width:25px'></span>为提升用户使用体验，自2019年4月1日起实时保公证录音管理平台网站迁移至新平台，启用新域名：<a href='https://189js.1010bao.com'>189js.1010bao.com</a>，敬请访问并收藏！<p style='text-align:right'>特此公告。</p><p style='text-align:right'>实时保公证录音</p><p style='text-align:right'>2019.4</p>",
                    okText: '我知道了',
                    onOk: () => {}
                });
               this.verifyBox = "05";
               clearInterval(this.codeTime);
               this.canSendCode = true;
               $(".login-code.sendCodeBtn").addClass("canSendCode").html("重新发送");
            }else{
              this.$Message.error({
                content: data.respDesc,
                duration: 3
              });
              this.respDesc= data.respDesc;
               this.verifyBox = "04";
               clearInterval(this.codeTime);
                this.canSendCode = true;
                $(".login-code.sendCodeBtn").addClass("canSendCode").html("重新发送");
            }
          }).catch(error => {
            console.log(error);
            clearInterval(this.codeTime);
            this.canSendCode = true;
            $(".login-code.sendCodeBtn").addClass("canSendCode").html("重新发送");
          });
        var i = 60;
        var _this=this;
        this.codeTime= setInterval(function() {
          i--;
          _this.canSendCode = false;
          $(".login-code.sendCodeBtn").removeClass("canSendCode").html(i + "s后重新发送");
          if (i == 0) {
            clearInterval(_this.codeTime);
            _this.canSendCode = true;
            $(".login-code.sendCodeBtn").addClass("canSendCode").html("重新发送");
          }
        }, 1000);
      }
    },
    getPlatform(){
          // this.$Modal.info({
          //                   title: "系统提醒",
          //                   content:"尊敬的用户：</br><span style='display:inline-block;width:25px'></span> 因平台升级，历史数据迁移中！目前通话记录暂只支持查看2019年2月28日之后的数据，给您带来的不便深表歉意！如有疑问请拨打400-821-9388进行咨询。</br><span style='display:inline-block;width:25px'></span>感谢您的支持！<p style='text-align:right'>2019年3月31日</p>",
          //                   okText: '我知道了',
          //                   onOk: () => {
          if(this.isPhone){
                if(this.form.smsCode){
                      this.verifyBox='';
                      this.$refs.loginForm.validate((valid) => {
                        if (valid) {
                          this.$emit('on-success-valid', {
                            userName: this.form.userName,
                            password: this.form.password,
                            smsCode: this.form.smsCode,
                            loginType:this.loginType,
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
                            userName: this.form.userName,
                            password: this.form.password,
                            loginType:this.loginType,
                            smsCode:''
                          })
                        }
                      })
                  }else{
                    this.verifyBox=2;
                  }
              }
                          //  }
                        // });
    },
    handleSubmit () {
      var jsonData={
        "phone":this.form.userName
      }
      getJSEuser(jsonData).then(response => {
          var data=response.data;
            if(data.respCode==1015){
                this.$Modal.info({
                    title: "系统提醒",
                    content:"尊敬的用户：</br><span style='display:inline-block;width:25px'></span>为提升用户使用体验，自2019年4月1日起实时保公证录音管理平台网站迁移至新平台，启用新域名：<a href='https://189js.1010bao.com'>189js.1010bao.com</a>，敬请访问并收藏！<p style='text-align:right'>特此公告。</p><p style='text-align:right'>实时保公证录音</p><p style='text-align:right'>2019.4</p>",
                    okText: '我知道了',
                    onOk: () => {}
                });
            }else{
                this.getPlatform();
            }
          }).catch(err => {
              this.getPlatform();
              console.log(err);
          })
    }
  }
}
</script>
