<template>
  <div class="content_box">
    <Card>
      <div class="listHeader">
        <i></i>
        <span>用户信息</span>
      </div>
      <div class="personalBox">
					<div class="personalInfo"  style="width: 80%;">
              <div class="infoContent">
                <p>用户姓名：{{userName}}</p>
                <p>身份证号：{{userIdNumber}}</p>
                <p>电话号码：{{userPhone}}</p>
                <p>邮箱地址：{{email}}</p>
              </div>
			   	</div>

				</div>
    </Card>

    <Card class="table_card" >
      <div class="listHeader">
        <i></i>
        <span>密码修改</span>
      </div>
      <div class="personalBox">

				<div class="personalInfo">
           <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
              <FormItem label="原始密码" prop="oldPassword">
                  <Input v-model="formValidate.oldPassword" type="password" placeholder="请输入原始密码"></Input>
              </FormItem>
               <FormItem label="新密码" prop="newPassword">
                  <Input v-model="formValidate.newPassword"  type="password" placeholder="请输入新密码"></Input>
              </FormItem>
               <FormItem label="确认密码" prop="newPassword2">
                  <Input v-model="formValidate.newPassword2"  type="password" placeholder="请输入确认密码"></Input>
                  <div class="verCodeAlert" v-show="respCode=='02'" style="color: #ED3F14;">原始密码错误</div>
                  <div class="verCodeAlert" v-show="respCode=='03'" style="color: #ED3F14;">密码修改失败，请重试！</div>
              </FormItem>
              <FormItem>
                   <Button type="primary" long  @click="handleUpdatePass">保存</Button>
              </FormItem>
          </Form>

				</div>
				</div>
      </Card>
  </div>
</template>
<style lang="less">
  @import "../styleCss/callLog.less";
  @import "./userMgt.less";
</style>
<script>
import {change_passeord} from '@/api/user'
export default {
  data() {
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
            callback(new Error("8-16位的数字、大小写字母、特殊符号组合"));
        } else {
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
         callback(new Error("请输入确认密码"));
      }
    };
    return {
      canChange: false,
      userName:this.$store.state.user.userName,
      userPhone:this.$store.state.user.phone,
      userIdNumber:this.$store.state.user.idNumber,
      email:this.$store.state.user.email,
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
      respCode:0
    };
  },
  watch: {
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
                      this.$Message.success({
                      content:"密码修改成功",
                      duration: 3
                   });
                   this.respCode='';
                }else  if (res.respCode == "1003") {
                   this.$Message.info({
                      content:"原始密码错误",
                      duration: 3
                   });
                   this.respCode='02';
                }else{
                   this.$Message.info({
                      content:"密码修改失败",
                      duration: 3
                   });
                   this.respCode='03';
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
  mounted () {

    // this.setDefaultSearchKey();
  }
}
</script>

<style>
</style>
