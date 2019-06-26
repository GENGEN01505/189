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
               <div class="register-con-title">修改密码</div>
               <div class="pass_alert">首次登录成功！激活账户须修改初始密码！！！</div>
                 <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" style="left: -6px; margin-top: 80px;">
                      <FormItem label="原始密码" prop="oldPassword">
                          <Input v-model="formValidate.oldPassword" type="password" placeholder="请输入原始密码"></Input>
                      </FormItem>
                      <FormItem label="新密码" prop="newPassword">
                          <Input v-model="formValidate.newPassword"  type="password" placeholder="请输入新密码"></Input>
                          <div class="passAlert" v-show="isAlert==true">
                             8-16位的数字、大小写字母、特殊符号组合
                        </div>
                      </FormItem>
                      <FormItem label="确认密码" prop="newPassword2">
                          <Input v-model="formValidate.newPassword2"  type="password" placeholder="请输入确认密码"></Input>
                          <div class="verCodeAlert" v-show="respCode=='03'" style="color: #ED3F14;">{{respDesc}}</div>
                      </FormItem>
                      <FormItem>
                          <Button type="primary" long  @click="handleUpdatePass">保存</Button>
                      </FormItem>
                  </Form>
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
import { change_passeord} from '@/api/user'
import logo from '@/assets/images/login-logo.png';
import Footer from './footer.vue'
export default {
  components:{
      Footer
  },
  data(){
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
        if (value != this.formValidate.newPassword) {
          callback(new Error("两次密码输入不一致"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      canChange: false,
      spinShow: false,
      isAlert:true,
      logo,
      formValidate:{
        oldPassword:'',
        newPassword:'',
        newPassword2:''
      },
       ruleValidate: {
        oldPassword: [{ required: true,  trigger: "blur" ,message: "请输入原始密码"}],
        newPassword: [{ required: true, trigger: "blur", validator: validatePass }],
        newPassword2: [{ required: true, trigger: "blur", validator: validateConfirmPass }]
      },
      respCode:0,
      respDesc:''
    };
  },

  methods: {
       handleUpdatePass(){
      this.$refs.formValidate.validate(valid => {
          if (valid) {
            this.spinShow = true;
            change_passeord(this.formValidate)
              .then(response => {
                var res = response.data;
                this.spinShow = false;
                if (res.respCode == "1000") {
                     this.$router.push({
                          name:this.$config.homeName
                      })
                }else{
                   this.$Message.info({
                      content:"密码修改失败",
                      duration: 3
                   });
                   this.respDesc=res.respDesc;
                   this.respCode='03';
                }
              })
              .catch(error => {
                console.log(error);
                 this.$Message.info({
                      content:"请求出错了!",
                      duration: 3
                   });
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
    }
  }
}
</script>
