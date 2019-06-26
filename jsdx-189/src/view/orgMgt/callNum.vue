<template>
  <div class="content_box">
    <Card>
      <div v-if="searchable && searchPlace === 'top'" class="search-con search-con-top" style=" padding-top: 10px ">
       <div class="search_div" v-show="userType!=1">
         <span class="search-span">部门：</span>
          <div class="select_dept_box select_dept_tree" style=" top: 0;width:200px" >
                <span class="select_dept_span" @click.stop="search_tree=!search_tree">{{orgName}}
                  <Icon type="ios-arrow-down" size="16" style="position:absolute;right:10px" v-show="orgId==''"/>
                </span>
                 <Icon type="ios-close-circle-outline" size="16" style="position:absolute;right:10px; cursor: pointer;" v-show="orgId" @click="initSearch_tree"/>
                <Tree :data="orgArray" v-show="search_tree==true" @on-select-change="getOrgInfo"></Tree>
          </div>
         </div>
         <div class="search_div">
          <span class="search-span">业务号码：</span>
           <Input  clearable placeholder="请输入业务号码" class="search-input" v-model="searchData.phone" />
         </div>
         <Button @click="handleSearch" class="search-btn" type="primary"><Icon type="md-search" size="16"/>搜索</Button>
      </div>
      <a id="hrefToExportTable" style="display: none;width: 0px;height: 0px;"></a>
    </Card>
    <Card class="table_card" v-if="userType==1">
      <div class="listHeader">
        <i></i>
        <span>号码列表</span>
        <Button class="deleteBtn" @click="addNumber">
          <Icon type="md-add-circle"  size="16" style="position: relative;top: -1px;"/>
             绑定号码  </Button>
          <!-- <Button class="deleteBtn" @click="exportExcel"  style="height: 32px;"> <img :src="Export" style="position: relative;top: 3px;" >导出Excel</Button> -->
      </div>

      <div class="tableBox">
           <ul class="table_header">
               <li style="width:25%"><span>电话号码</span></li>
               <li style="width:25%"><span>别名</span></li>
               <li style="width:50%"><span>操作</span></li>
           </ul>
          <div  class="table_Box" v-if="dataList.length>0">
            <ul class="table_body" v-for="(item,k) in dataList" :key="k">
               <li style="width:25%"><span>{{item.phone}}</span></li>
               <li style="width:25%"><span>{{item.nickName}}</span></li>
               <li style="width:50%">
                 <a @click="updateName(item.id,item.nickName)">修改名称</a>
                 <a @click="yun(item.phone)" style="color:red" v-show="item.serviceType=='01'&&item.isfull==1" title="云盘空间已满">登录云盘</a>
                 <a @click="yun(item.phone)" v-show="item.serviceType=='01'&&item.isfull!=1">登录云盘</a>
                 <!-- <a >同步云盘</a> -->
              </li>
            </ul>
        </div>
         <div  class="table_Box dataNull" v-else>
            <img :src="empty" alt="数据为空">
        </div>
        <div class="table_footer" v-show="dataList.length>0">
            <Page :total="totalData" :page-size="searchData.pageSize" :current="searchData.page+1" show-total @on-change="changePage"/>
         </div>
      </div>
         <Spin size="large" fix v-if="tableLoading"></Spin>
    </Card>
    <Card class="table_card" v-else>
      <div class="listHeader">
        <i></i>
        <span>号码列表</span>
        <Button class="deleteBtn" @click="updateDept" v-show="userType!=1"><Icon type="md-move" size="16" style="position: relative;top: -1px;"/>移动到</Button>
        <Button class="deleteBtn" @click="addNumber">
          <Icon type="md-add-circle"  size="16" style="position: relative;top: -1px;"/>
             绑定号码  </Button>
          <!-- <Button class="deleteBtn" @click="exportExcel"  style="height: 32px;"> <img :src="Export" style="position: relative;top: 3px;" >导出Excel</Button> -->
      </div>

      <div class="tableBox">
           <ul class="table_header">
               <li style="width:6%"><Checkbox  :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll"></Checkbox></li>
               <li style="width:15%"><span>电话号码</span></li>
               <li style="width:15%"><span>别名</span></li>
               <li style="width:25%"><span>部门</span></li>
               <li style="width:35%"><span>操作</span></li>
           </ul>
          <div  class="table_Box" v-if="dataList.length>0">
           <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
            <ul class="table_body" v-for="(item,k) in dataList" :key="k">
               <li style="width:6%"><Checkbox :label="item.id"> <i style="display:none"></i></Checkbox></li>
               <li style="width:15%"><span>{{item.phone}}</span></li>
               <li style="width:15%"><span>{{item.nickName}}</span></li>
               <li style="width:25%"><span>{{item.depName}}</span></li>
               <li style="width:35%">
                 <a @click="updateName(item.id,item.nickName)">修改名称</a>
                 <a @click="moveBtn(item.id)" v-show="userType!=1">移动到</a>
                 <a @click="yun(item.phone)" style="color:red" v-show="item.serviceType=='01'&&item.isfull==1" title="云盘空间已满">登录云盘</a>
                 <a @click="yun(item.phone)" v-show="item.serviceType=='01'&&item.isfull!=1">登录云盘</a>
              </li>
            </ul>
            </CheckboxGroup>
        </div>
         <div  class="table_Box dataNull" v-else>
            <img :src="empty" alt="数据为空">
        </div>
        <div class="table_footer" v-show="dataList.length>0">
            <Page :total="totalData" :page-size="searchData.pageSize" :current="searchData.page+1" show-total @on-change="changePage"/>
         </div>
      </div>
      <Spin size="large" fix v-if="tableLoading"></Spin>
    </Card>
    <Spin size="large" fix v-if="spinShow"></Spin>
    <Modal v-model="modal_AddNumber" width="400" class="modelContent">
        <p slot="header" style="font-size: 18px;color: #333333;text-align:center" >
            <span>绑定业务号码</span>
        </p>
        <div style="text-align:center;">
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
              <FormItem label="部门：" v-show="userType!=1" style="height: 33px;">
                    <div class="select_dept_box select_dept_tree" style=" top: 0;width:100%" >
                        <span class="select_dept_span" @click.stop="addMember_tree=!addMember_tree">{{addDepartName}}<Icon type="ios-arrow-down" size="16" style="position:absolute;right:10px"/></span>
                        <Tree :data="orgArray" v-show="addMember_tree==true" @on-select-change="addNumDept"></Tree>
                  </div>
              </FormItem>
              <FormItem label="别名：">
                  <Input v-model="formValidate.nickName" placeholder="请输入姓名"></Input>
              </FormItem>

               <FormItem label="业务号码：" prop="phone">
                  <Input v-model="formValidate.phone" placeholder="请输入业务号码"></Input>
              </FormItem>
              <FormItem  label="验证码：" prop="smsCode">
                        <!-- <Input v-model="formValidate.verCode"   placeholder="验证码" class="verificationCodeIpt"></Input> -->
                        <input type="text" placeholder="验证码" v-model="formValidate.smsCode" class="ivu-input verificationCodeIpt" >
                        <span class="callNum-code sendCodeBtn" @click="sendCode">发送验证码</span>
                        <div class="verCodeAlert" v-show="respCode=='02'" style="color: #1781E0;">验证码发送成功，请注意查看！</div>
                        <div class="verCodeAlert" v-show="respCode=='03'" style="color: #ED3F14;">验证码错误！</div>
                        <div class="verCodeAlert" v-show="respCode=='04'" style="color: #ED3F14;">身份验证失败，请重试！</div>
                        <div class="verCodeAlert" v-show="respCode=='05'" style="color: #ED3F14;">{{respDesc}}</div>
                        <div class="verCodeAlert" v-show="respCode=='06'" style="color: #ED3F14;">该固话号码未绑定手机号，暂不能发送短息！</div>
                        <div class="verCodeAlert" v-show="respCode=='07'" style="color: #1781E0;">验证码已发送到{{contactPhone}}，请注意查看！</div>
              </FormItem>
          </Form>
        </div>
        <div slot="footer" style="text-align:center" class="modal_footer">
              <span class="modal_footer_btn " @click="cancel_addNumber">取消</span>
              <span class="modal_footer_btn modal_footer_confirm" @click="confirm_addNumber">确定</span>
        </div>
    </Modal>
    <Modal v-model="modal_updateDept" width="300" >
        <p slot="header" style="font-size: 18px;color: #333333;text-align:center" >
            <span>移动号码</span>
        </p>
        <div style="text-align:center;">
          <Form ref="moveArr" :model="moveArr" :rules="ruleValidate" :label-width="80">
             <FormItem label="部门" prop="depCode">
                  <div class="select_dept_box select_dept_tree" style=" top: 0;width:100%" >
                        <span class="select_dept_span" @click.stop="moveMember_tree=!moveMember_tree">{{moveArr.depName}}<Icon type="ios-arrow-down" size="16" style="position:absolute;right:10px"/></span>
                        <Tree :data="orgArray" v-show="moveMember_tree==true" @on-select-change="moveOrgInfo"></Tree>
                  </div>
              </FormItem>
          </Form>
        </div>
        <div slot="footer" style="text-align:center" class="modal_footer">
              <span class="modal_footer_btn " @click="cancel_update">取消</span>
              <span class="modal_footer_btn modal_footer_confirm" @click="confirm_update">确定</span>
        </div>
    </Modal>
      <Modal v-model="modal_updateName" width="400">
        <p slot="header" style="font-size: 18px;color: #333333;text-align:center" >
            <span>修改名称</span>
        </p>
        <div style="text-align:center;">
          <Form ref="formUpdateName" :model="formUpdateName" :rules="ruleValidate" :label-width="80">
               <FormItem label="别名" prop="nickName">
                  <Input v-model="formUpdateName.nickName" clearable placeholder="请输入别名"></Input>
              </FormItem>
          </Form>
        </div>
        <div slot="footer" style="text-align:center" class="modal_footer">
              <span class="modal_footer_btn " @click="cancel_updateNickName">取消</span>
              <span class="modal_footer_btn modal_footer_confirm" @click="confirm_updateNickName">确定</span>
        </div>
    </Modal>
  </div>
</template>
<style lang="less">
  @import "../styleCss/callLog.less";
  @import "../styleCss/orgMgt.less";
</style>
<script>
import "@/assets/jquery-1.11.js";
import {sendCode} from '@/api/user'
import {getDeptCodeList,getRecordUserList,updateRecordUser,updateNickName,loginYun,bindRecordUser,getContactPhone} from "@/api/orgMgt";
import empty from '@/assets/images/empty.png';
import Export from '@/assets/images/export.png';
import config from '@/config'
var baseUrl =process.env.NODE_ENV === 'development' ? config.baseUrl.dev : process.env.VUE_APP_PATH === 'test' ? config.baseUrl.test : config.baseUrl.pro;
export default {
  data() {
     const validatePhone = (rule, value, callback) => {
        var reg = /^((1[3456789]{1}[0-9]{1})+\d{8})$/g;
        var zuoNum = /^0[0-9]{2,3}[0-9]{8}$/;
        if (reg.test(value.trim())) {
            this.canSendCode = true;
            this.smsPhone=value.trim();
           $(".callNum-code.sendCodeBtn").addClass("canSendCode");
            callback();
        }else if(zuoNum.test(value.trim())) {
           var d={
                "phone":value.trim()
              }
              getContactPhone(d).then(res=>{
                var data=res.data;
                if(data.respCode==1000){
                    this.canSendCode = true;
                    $(".callNum-code.sendCodeBtn").addClass("canSendCode");
                    callback();
                    this.respCode=0;
                    this.smsPhone=data.contactPhone;
                    this.contactPhone=data.contactPhone.substring(0,3)+'*****'+data.contactPhone.substring(7,11);
                }else{
                   this.canSendCode = false;
                   $(".callNum-code.sendCodeBtn").removeClass("canSendCode");
                   this.respCode='06';
                }
              }).catch(err =>{
                this.canSendCode = false;
                $(".callNum-code.sendCodeBtn").removeClass("canSendCode");
                 this.respCode='06';
                  console.log(err)
              })
        }else{
          this.canSendCode = false;
          $(".callNum-code.sendCodeBtn").removeClass("canSendCode");
          callback(new Error("手机号码错误"));
        }
    };


    return {
      empty,
      Export,
      searchable: true,
      searchPlace: "top",
      searchValue: "",
      searchKey: "",
      modalDelete:false,
      modal_loading:false,
      modal_AddNumber:false,
      modal_updateDept:false,
      modal_updateName:false,
      addMember_tree:false,
      moveMember_tree:false,
      search_tree:false,
      indeterminate: false,
      checkAll: false,
      checkAllGroup:[],
      respCode:'02',
      respDesc:"",
      addMore:0,
      userType:this.$store.state.user.userType,
      spinShow:false,
      tableLoading:false,
      canSendCode:false,//是否可发送短息
      contactPhone:'',//绑定固话的联系人手机号
      addDepartName:'请选择部门',
      smsPhone:'',
      searchData:{
          depCode:'',
          phone:'',
          page:0,
          pageSize:20
      },
      totalData:0,
      formValidate: {//绑定业务号码数据
          phone:'',
          nickName: '',
          depCode: '',
          smsCode: '',
      },
      ruleValidate: {
          name: [
              { required: true, message: '请输入别名名', trigger: 'blur' }
          ],
          phone: [
              { required: true, trigger: "blur", validator: validatePhone},
          ],
          smsCode: [
            { required: true, message: '请输入验证码', trigger: 'change' }
           ],
          department: [
              { required: true, message: '请选择部门', trigger: 'change' }
          ],
         depCode: [
              { required: true, message: '请选择部门', trigger: 'blur' }
          ],
          nickName: [
              { required: true, message: '请输入别名', trigger: 'blur' }
          ],
      },
      orgName:'请选择部门',
      orgId:'',
      orgArray:[],
      dataList:[],
      moveArr:{
          ids:[],
          depCode:'',
          depName:'请选择部门'
      },
     formUpdateName:{
       id:'',
       nickName:''
     },
     codeTime:''
    };
  },
  watch: {
    modal_updateName(){
       if(!this.modal_updateName){
          this.formUpdateName.id="";
          this.formUpdateName.nickname="";
          this.$refs['formUpdateName'].resetFields();
       }
    },
    modal_updateDept(){
       if(!this.modal_updateDept){
          this.moveMember_tree=false;
          this.moveArr.ids=[];
          this.moveArr.depCode='';
          this.$refs['moveArr'].resetFields();
          this.moveArr.depName='请选择部门';
       }
    },
   modal_AddNumber(){
       if(!this.modal_AddMember){
            this.addMember_tree=false;
            this.formValidate.nickName="";
            this.formValidate.phone="";
            this.formValidate.depCode="";
            this.$refs['formValidate'].resetFields();
            this.addDepartName='请选择部门';
            this.respCode=0;
            this.contactPhone='';
            this.smsPhone='';
            clearInterval(this.codeTime);
       }
    },
  },
  methods: {
     addNumDept(data){//获取搜索条件部门信息
        if(data.length>0){
            this.formValidate.depCode=data[0].code;
            this.addDepartName=data[0].title;
            this.addMember_tree=false;
        }else{
            this.formValidate.depCode='';
            this.addDepartName="请选择部门";
            this.addMember_tree=false;
        }
     },
     sendCode(){
       if(this.canSendCode){
          var phone=this.smsPhone;
          var type=3;
          var platform=this.$store.state.app.platform;
          sendCode({phone,type,platform})
            .then(response => {
              var data = response.data;
              if (data.respCode == "1000") {
                this.$Message.info({
                      content:"验证码已发送，请注意查收！",
                      duration: 3
                });
                if(this.contactPhone){
                  this.respCode = "07";
                }else{
                  this.respCode = "02";
                }
              }else {
                this.$Message.error({
                  content: data.respDesc,
                  duration: 3
                });
                 this.respCode = "05";
                  this.respDesc=data.respDesc;
                clearInterval(this.codeTime);
                this.canSendCode = true;
                $(".callNum-code.sendCodeBtn").addClass("canSendCode").html("重新发送");
              }
            }).catch(error => {
              console.log(error);
              clearInterval(this.codeTime);
              this.canSendCode = true;
              $(".callNum-code.sendCodeBtn").addClass("canSendCode").html("重新发送");
            });
            var i = 60;
            var _this=this;
            this.codeTime = setInterval(function() {
              i--;
            _this.canSendCode = false;
            $(".callNum-code.sendCodeBtn").removeClass("canSendCode").html(i + "s后重新发送");
            if (i == 0) {
              clearInterval(_this.codeTime);
              _this.canSendCode = true;
              $(".callNum-code.sendCodeBtn").addClass("canSendCode").html("重新发送");
            }
          }, 1000);
       }

    },
    moveOrgInfo(data){//获取移动部门信息
        if(data.length>0){
            this.moveArr.depCode=data[0].code;
            this.moveArr.depName=data[0].title;
            this.moveMember_tree=false;
         }else{
            this.moveArr.depCode='';
            this.moveArr.depName='请选择部门';
            this.moveMember_tree=false;
        }
    },
    getOrgInfo(data){//获取搜索条件部门信息
        if(data.length>0){
            this.orgId=data[0].code;
            this.orgName=data[0].title;
            this.searchData.depCode=data[0].code;
            this.search_tree=false;
        }else{
            this.orgId='';
            this.orgName='请选择部门';
            this.searchData.depCode='';
            this.search_tree=false;
        }

    },
    initSearch_tree(){
       this.orgId="";
       this.orgName="请选择部门";
       this.searchData.depCode="";
       this.search_tree=false;
    },
    changePage(page){//分页 更换页码
       this.searchData.page=page-1;
       this.tableLoading=true;
        getRecordUserList(this.searchData).then(res=>{
           this.tableLoading=false;
          var data=res.data;
          if(data.respCode==1000){
             if(data.recordUserPage.data.length>0){
              this.dataList=data.recordUserPage.data;
               this.totalData=data.recordUserPage.total;
             }
          }else{
              this.$Message.error(data.respDesc)
          }
        }).catch(err =>{
          this.tableLoading=false;
            console.log(err)
        })
    },
    addMoreData(){
       this.searchData.page=this.searchData.page+1;
       this.tableLoading=true;
       this.addMore=1;
        getRecordUserList(this.searchData).then(res=>{
           this.tableLoading=false;
          var data=res.data;
          if(data.respCode==1000){
             if(data.recordUserPage.data.length>0){
              this.dataList=this.dataList.concat(data.recordUserPage.data);
                if(data.recordUserPage.data.length<this.searchData.pageSize){
                    this.addMore=2;
                  }else{
                    this.addMore=0;
                  }
             }else{
                this.addMore=2;
             }
          }else{
              this.addMore=0;
              this.$Message.error(data.respDesc)
          }
        }).catch(err =>{
          if(this.searchData.page>0){
             this.searchData.page=this.searchData.page-1;
          }
          this.tableLoading=false;
          this.addMore=0;
            console.log(err)
        })
    },
    handleCheckAll () {//全选
      var _this=this;
      if (_this.indeterminate) {
          _this.checkAll = false;
      } else {
          _this.checkAll = !_this.checkAll;
      }
      _this.indeterminate = false;

      if (_this.checkAll) {
          _this.checkAllGroup = [];
          _this.dataList.forEach(function(item) {
              _this.checkAllGroup.push(item.id);
          });
      } else {
          _this.checkAllGroup = [];
      }
    },
    checkAllGroupChange (data) {
        if (data.length === this.dataList.length) {
            this.indeterminate = false;
            this.checkAll = true;
        } else if (data.length > 0) {
            this.indeterminate = true;
            this.checkAll = false;
        } else {
            this.indeterminate = false;
            this.checkAll = false;
        }
    },
    updateDept(){
        if(this.checkAllGroup.length==0){
            this.$Message.warning("请选择要移动的号码！")
        }else{
           this.modal_updateDept=true;
           this.moveArr.ids=this.checkAllGroup;
        }
    },
    cancel_update(){
       // 取消移动
        this.modal_updateDept=false;
    },
    confirm_update(){
      // 确定移动
         this.$refs.moveArr.validate(valid => {
          if (valid) {
              this.spinShow=true;
                updateRecordUser(this.moveArr).then(response => {
                     this.spinShow=false;
                var data=response.data;
                if(data.respCode==1000){
                    this.$Message.success("移动成功！");
                    this.searchData.page=0;
                    this.moveArr.ids=[];
                    this.checkAllGroup=[];
                    this.getRecordList();
                    this.modal_updateDept=false;
                }else{
                    this.$Message.error(data.respDesc)
                }
                }).catch(err =>{
                    this.spinShow=false;
                    this.$Message.error("移动失败！")
                    console.log(err)
                })
           }
         })
    },
    moveBtn(id){
        this.moveArr.ids=[];
        this.moveArr.ids.push(id);
        this.modal_updateDept=true;
    },
    handleSearch () {
       this.searchData.page=0;
       this.getRecordList();
    },
    addNumber(){//点击添加成员
        this.modal_AddNumber=true;
    },
      cancel_addNumber(){
       // 取消移动
        this.modal_AddNumber=false;
    },
    confirm_addNumber(){
      // 确定移动
         this.$refs.formValidate.validate(valid => {
          if (valid) {
              this.spinShow=true;
                bindRecordUser(this.formValidate).then(response => {
                     this.spinShow=false;
                var data=response.data;
                if(data.respCode==1000){
                    this.$Message.success("绑定成功！");
                    this.searchData.page=0;
                    this.getRecordList();
                    this.modal_AddNumber=false;
                }else{
                    this.respCode='05';
                    this.respDesc=data.respDesc;
                    this.$Message.error(data.respDesc)
                }
                }).catch(err =>{
                    this.spinShow=false;
                    this.$Message.error("绑定失败！")
                    console.log(err)
                })
           }
         })
    },
    getRecordList(){//获取数据列表
        this.tableLoading=true;
        getRecordUserList(this.searchData).then(res=>{
        this.tableLoading=false;
        var data=res.data;
        if(data.respCode==1000){
            this.dataList=data.recordUserPage.data;
             this.totalData=data.recordUserPage.total;
        }else{
           this.$Message.error(data.respDesc)
            this.dataList=[];
        }
        }).catch(err =>{
            this.tableLoading=false;
            console.log(err)
        })
    },
    updateName(id,nickName){//修改名称按钮
        this.formUpdateName.id=id;
        this.formUpdateName.nickName=nickName;
        this.modal_updateName=true;
    },
    cancel_updateNickName(){
       // 取消修改名称
        this.modal_updateName=false;
    },
    confirm_updateNickName(){
      // 确定修改名称
        this.$refs.formUpdateName.validate(valid => {
          if (valid) {
              this.spinShow=true;
                updateNickName(this.formUpdateName).then(response => {
                  this.spinShow=false;
                      var data=response.data;
                    if(data.respCode==1000){
                        this.$Message.success("修改成功！")
                        this.modal_updateName=false;
                        this.getRecordList();
                    }else{
                      this.$Message.error({
                          content:data.respDesc,
                          duration: 3
                        });
                    }
                }).catch(error => {
                    console.log(error);
                    this.spinShow = false;
                });
         }
         })
    },
    yun(phone){
      var jsonData={
        "phone":phone
      }
       this.spinShow = true;
      loginYun(jsonData).then(response => {
        this.spinShow=false;
           var data=response.data.bizData;
          if(data.code=="1000"){
            var  elink= document.createElement('a');
                elink.style.display = 'none';
                elink.target = '_blank';
                elink.href =data.data;
                document.body.appendChild(elink);
                elink.click();
                document.body.removeChild(elink);

          }else{
            this.$Message.warning({
                content:"该号码未开通云盘登录功能!",
                duration: 3
              });
          }
      }).catch(error => {
          console.log(error);
          this.spinShow = false;
      });
    },
    exportExcel () {//导出表格数据
       var token=this.$store.state.user.token;
       axios.post(baseUrl+'/recor/getExport',this.searchData,{
         responseType: 'blob',
         headers: {
            'Authorization':token,
          }
        }).then(function (response) {
            const content = response.data;
            const blob = new Blob([content], {type: 'application/vnd.ms-excel'});
            const fileName = 'data.xls';
            if ('download' in document.createElement('a')) { // 非IE下载
            const elink = document.createElement('a');
            elink.download = fileName;
            elink.style.display = 'none';
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href); // 释放URL 对象
            document.body.removeChild(elink);
          } else { // IE10+下载
            navigator.msSaveBlob(blob, fileName);
          }
      }).catch(function (error) {
        console.log(error);
      });

    },
  },
  mounted () {
     this.getRecordList();
      // 获取部门下拉列表
       getDeptCodeList().then(res=>{
            this.spinShow=false;
            var data=res.data;
            if(data.length>0){
            this.orgArray=data;
            }else{
            this.orgArray=[];
            }
        }).catch(err =>{
            console.log(err)
            this.spinShow=false;
        })
  }
}
</script>

<style>
</style>
