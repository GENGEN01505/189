<template>
  <div class="content_box">
    <Card>
      <div v-if="searchable && searchPlace === 'top'" class="search-con search-con-top" style=" padding-top: 10px ">
      <div class="search_div">
         <span class="search-span">姓名：</span>
        <Input  clearable placeholder="请输入姓名" class="search-input" v-model="searchData.idName" />
      </div>
      <div class="search_div">
        <span class="search-span">电话号码：</span>
        <Input clearable placeholder="请输入电话号码" class="search-input" v-model="searchData.phone" />
      </div>
        <Button @click="handleSearch" class="search-btn" type="primary">
          <Icon type="md-search" size="16"/>搜索</Button>
      </div>
    </Card>

    <Card class="table_card" >
      <div class="listHeader">
        <i></i>
        <span>成员列表</span>
        <Button class="deleteBtn" @click="deleteMore">
          <Icon type="md-trash" size="16" style="position: relative;top: -1px;"/>批量删除</Button>
        <Button class="deleteBtn" @click="createMember">
          <Icon type="md-add-circle"  size="16" style="position: relative;top: -1px;"/>
             添加新成员  </Button>
      </div>

      <div class="tableBox">

           <ul class="table_header">
               <li style="width:6%"><Checkbox  :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll"></Checkbox></li>
               <li style="width:20%"><span>姓名</span></li>
               <li style="width:20%"><span>电话号码</span></li>
               <li style="width:17%"><span>部门</span></li>
               <!-- <li style="width:12%"><span>别名</span></li> -->
               <li style="width:35%"><span>操作</span></li>
           </ul>
          <div  class="table_Box" v-if="dataList.length>0">
              <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
             <ul class="table_body" v-for="(item,k) in dataList" :key="k">
               <li style="width:6%"><Checkbox :label="item.id"> <i style="display:none"></i></Checkbox></li>
               <li style="width:20%"><span>{{item.idName}}</span></li>
               <li style="width:20%"><span>{{item.phone}}</span></li>
               <li style="width:17%"><span>{{item.name}}</span></li>
               <!-- <li style="width:12%"><span>{{item.nickname}}</span></li> -->
               <li style="width:35%">
                 <a @click="updateName(item.id,item.idName,item.nickname)">修改名称</a>
                 <a @click="deleteMember(item.id)">删除</a>
                 <a @click="moveMember(item.id)">移动到</a>
              </li>
            </ul>
            </CheckboxGroup>
        </div>
        <div  class="table_Box dataNull" v-else>
            <img :src="empty" alt="数据为空">
        </div>
        <div class="table_footer" v-show="dataList.length>0">
             <Page :total="totalData" :page-size="searchData.pageSize" :current="searchData.page+1" show-total @on-change="changePage"/>
             <!-- <a v-show="addMore==0" @click="addMoreData">加载更多</a>
             <a v-show="addMore==1">努力加载中······</a>
             <a v-show="addMore==2">无更多数据</a> -->
         </div>
      </div>
       <Spin size="large" fix v-if="tableLoading"></Spin>
    </Card>

     <Modal v-model="modal_AddMember" width="400" class="modelContent">
        <p slot="header" style="font-size: 18px;color: #333333;text-align:center" >
            <span>添加新成员</span>
        </p>
        <div style="text-align:center;">
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
              <FormItem label="姓名" prop="idName">
                  <Input v-model="formValidate.idName" clearable placeholder="请输入姓名"></Input>
              </FormItem>
               <!-- <FormItem label="身份证号" prop="idNumber">
                  <Input v-model="formValidate.idNumber" clearable placeholder="请输入身份证号"></Input>
              </FormItem> -->
               <FormItem label="电话号码" prop="phone">
                  <Input v-model="formValidate.phone" clearable placeholder="请输入电话号码"></Input>
              </FormItem>
              <FormItem label="部门" prop="deptCode" style="height: 33px;">
                  <div class="select_dept_box select_dept_tree" style=" top: 0;width:280px" >
                        <span class="select_dept_span" @click.stop="addMember_tree=!addMember_tree">{{addDepartName}}<Icon type="ios-arrow-down" size="16" style="position:absolute;right:10px"/></span>
                        <Tree :data="orgArray" v-show="addMember_tree==true" @on-select-change="getOrgInfo"></Tree>
                  </div>
              </FormItem>
             <FormItem label="邮箱" >
                   <FormItem  prop="email">
                    <Input v-model="formValidate.email" clearable placeholder="请输入邮箱" ></Input>
                  </FormItem>
                  <!-- <Input v-model="formValidate.email" clearable placeholder="请输入邮箱" ></Input> -->
              </FormItem>
               <FormItem label="初始密码">
                  <Input v-model="formValidate.password" disabled placeholder="初始密码" style="color:#333"></Input>
                  <div class="verCodeAlert" v-show="respCode=='03'" style="color: #ED3F14;">成员添加失败！</div>
                  <div class="verCodeAlert" v-show="respCode=='04'" style="color: #ED3F14;">您添加手机号码已存在！</div>
                <div class="verCodeAlert" v-show="respCode=='05'" style="color: #ED3F14;">部门不存在！</div>
              </FormItem>
          </Form>
        </div>
        <div slot="footer" style="text-align:center" class="modal_footer">
              <span class="modal_footer_btn " @click="cancelAdd">取消</span>
              <span class="modal_footer_btn modal_footer_confirm" @click="addMember">确定</span>
        </div>
    </Modal>
    <Modal v-model="modal_updateName" width="400">
        <p slot="header" style="font-size: 18px;color: #333333;text-align:center" >
            <span>修改名称</span>
        </p>
        <div style="text-align:center;">
          <Form ref="formUpdateName" :model="formUpdateName" :rules="ruleValidate" :label-width="80">
              <FormItem label="姓名" prop="idName">
                  <Input v-model="formUpdateName.idName" clearable placeholder="请输入姓名"></Input>
              </FormItem>
               <FormItem label="别名" prop="nickname" v-show="false">
                  <Input v-model="formUpdateName.nickname" clearable placeholder="请输入别名"></Input>
              </FormItem>
          </Form>
        </div>
        <div slot="footer" style="text-align:center" class="modal_footer">
              <span class="modal_footer_btn " @click="cancel_update">取消</span>
              <span class="modal_footer_btn modal_footer_confirm" @click="confirm_update">确定</span>
        </div>
    </Modal>
     <Modal v-model="modal_moveMember" width="350" class="modelContent">
        <p slot="header" style="font-size: 18px;color: #333333;text-align:center" >
            <span>移动成员</span>
        </p>
        <div style="text-align:center;">
          <Form ref="formMove" :model="formMove" :rules="ruleValidate" :label-width="80">
              <FormItem label="部门" prop="deptCode">
                   <div class="select_dept_box select_dept_tree" style=" top: 0;">
                      <span class="select_dept_span" @click.stop="moveMember_tree=!moveMember_tree">{{moveMemberName}}<Icon type="ios-arrow-down" size="16" style="position:absolute;right:10px"/></span>
                       <Tree :data="orgArray" v-show="moveMember_tree==true" @on-select-change="moveOrgInfo"></Tree>
                  </div>
                   <div class="verCodeAlert" v-show="respCode=='001'" style="color: #ED3F14;">请选择部门！</div>
              </FormItem>

          </Form>
        </div>
        <div slot="footer" style="text-align:center" class="modal_footer">
            <span class="modal_footer_btn " @click="cancel_move">取消</span>
            <span class="modal_footer_btn modal_footer_confirm" @click="confirm_move">确定</span>
        </div>
    </Modal>
    <Modal v-model="modalDelete" width="360">
        <p slot="header" style="font-size: 18px;color: #333333;text-align:center" >
            <span>删除成员</span>
        </p>
        <div style="text-align:center;padding: 30px 0;">
            <p  style="font-size:16px">  确实要删除所选成员吗？</p>
        </div>
        <div slot="footer">
           <div slot="footer" style="text-align:center" class="modal_footer">
              <span class="modal_footer_btn" @click="cancelDelete">取消</span>
              <span class="modal_footer_btn modal_footer_confirm" @click="confirmDelete">确定</span>
           </div>
        </div>
    </Modal>
     <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>
<style lang="less">
  @import "../styleCss/callLog.less";
 @import "../styleCss/orgMgt.less";
</style>
<script>
import {getDeptCodeList,getAppUserList,addAppUserInfo,updateName,deleteAppUser,updateDeptCode} from "@/api/orgMgt";
import empty from '@/assets/images/empty.png';
export default {
  data() {
     const validatePhone = (rule, value, callback) => {
        var reg = /^((1[3456789]{1}[0-9]{1})+\d{8})$/g;
        var zuoNum = /^0[0-9]{2,3}[0-9]{8}$/;
        if (reg.test(value.trim())) {
           callback();
        }else if(zuoNum.test(value.trim())){
           callback();
        }else {
           callback(new Error("号码错误"));
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
    return {
      searchable: true,
      searchData:{
        phone:"",
        idName:'',
        page:0,
        pageSize:20
      },
      empty,
      searchPlace: "top",
      searchValue: "",
      searchKey: "",
      modalDelete:false,
      modal_loading:false,
      modal_AddMember:false,
      modal_updateName:false,
      modal_moveMember:false,
      indeterminate: false,
      addMember_tree:false,
      moveMember_tree:false,
      checkAll: false,
      checkAllGroup:[],
      respCode:0,
      addMore:0,
      totalData:0,
      spinShow:false,
      tableLoading:false,
      deleteArr:[],
      formUpdateName:{
          userId:'',
          idName:'',
          nickname: ''
      },
      formMove:{
          userId:'',
          deptCode:""
      },
      formValidate: {
          phone:'',
          idName: '',
          idNumber: '',
          platform: this.$store.state.app.platform,
          deptCode: '',
          password:'111111.Aa',
          email:''
      },
      ruleValidate: {
          idName: [
              { required: true, message: '请输入成员姓名', trigger: 'blur' }
          ],
          nickname: [
              { required: true, message: '请输入成员别名', trigger: 'blur' }
          ],
          phone: [
              { required: true, trigger: "blur", validator: validatePhone},
          ],
          email: [
              { required: true, trigger: "blur", validator: validateEmail},
          ],
          idNumber: [
              {  required: true, trigger: "blur", validator: validateIDCard}
          ],
          deptCode: [
              { required: true, message: '请选择部门', trigger: 'blur'}
          ],
      },
      dataList:[],
      departments:[],
      addDepartName:'请选择部门',
      orgArray:[],
      moveMemberName:'请选择部门'
    };
  },
  watch: {//关闭窗口信息初始化
    modal_AddMember(){
       if(!this.modal_AddMember){
            this.formValidate.phone="";
            this.formValidate.idName="";
            this.formValidate.idNumber="";
            this.formValidate.deptCode="";
            this.formValidate.email="";
            this.addMember_tree=false;
            this.$refs['formValidate'].resetFields();
            this.addDepartName='请选择部门';
            this.respCode=0;

       }
    },
    modal_updateName(){
       if(!this.modal_updateName){
          this.formUpdateName.userId="";
          this.formUpdateName.idName="";
          this.formUpdateName.nickname="";
          this.$refs['formUpdateName'].resetFields();
       }
    },
    modal_moveMember(){
       if(!this.modal_moveMember){
          this.formMove.deptCode='';
          this.moveMember_tree=false;
          this.moveMemberName='请选择部门';
          this.respCode=0;
       }
    }
  },
  methods: {
    moveOrgInfo(data){//获取移动部门信息
       if(data.length>0){
          this.formMove.deptCode=data[0].code;
          this.moveMemberName=data[0].title;
          this.moveMember_tree=false;
          this.respCode=0;
       }else{
          this.formMove.deptCode='';
          this.moveMemberName='请选择部门';
          this.moveMember_tree=false;
          this.respCode=0;
       }

    },
    getOrgInfo(data){//获取搜索条件部门信息orgId,orgName
       if(data.length>0){
          this.formValidate.deptCode=data[0].code;
          this.addDepartName=data[0].title;
          this.addMember_tree=false;
       }else{
          this.formValidate.deptCode='';
          this.addDepartName='请选择部门';
          this.addMember_tree=false;
       }
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
    handleSearch(){
     //  搜索
       this.getMembersList();
    },
    createMember(){
      this.modal_AddMember=true;
    },
      cancelAdd(){
       this.modal_AddMember=false;
    },
    changePage(page){//分页 更换页码
       this.searchData.page=page-1;
       this.tableLoading=true;
        getAppUserList(this.searchData).then(res=>{
           this.tableLoading=false;
          var data=res.data;
          if(data.respCode==1000){
             if(data.users.data.length>0){
              this.dataList=data.users.data;
               this.totalData=data.users.total;
             }
          }else{
              this.$Message.error(data.respDesc)
          }
        }).catch(err =>{
          this.tableLoading=false;
            console.log(err)
        })
    },
    addMember(){//添加成员
       this.respCode=0;
       this.$refs.formValidate.validate(valid => {
          if (valid) {
            this.spinShow = true;
            addAppUserInfo(this.formValidate)
              .then(response => {
                 this.spinShow = false;
                var res = response.data;
                if (res.respCode == "1000") {
                     this.$Message.success({
                      content:"成员添加成功！",
                      duration: 3
                   });
                   this.modal_AddMember=false;
                   this.getMembersList();
                }else if (res.respCode == "1014") {
                     this.$Message.error({
                      content:res.respDesc,
                      duration: 3
                   });
                   this.respCode='04';
                }else if (res.respCode == "1012") {
                     this.$Message.error({
                      content:res.respDesc,
                      duration: 3
                   });
                   this.respCode='05';
                } else{
                   this.$Message.error({
                      content:res.respDesc,
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
    },
    updateName(id,idName,nickname){//修改名称按钮
        this.formUpdateName.userId=id;
        this.formUpdateName.idName=idName;
        this.formUpdateName.nickname=nickname;
        this.modal_updateName=true;
    },
    cancel_update(){
       // 取消修改名称
        this.modal_updateName=false;
    },
    confirm_update(){
      // 确定修改名称
       this.$refs.formUpdateName.validate(valid => {
          if (valid) {
              this.spinShow = true;
                updateName(this.formUpdateName).then(response => {
                      var data=response.data;
                      this.spinShow = false;
                    if(data.respCode==1000){
                        this.$Message.success("修改成功！")
                        this.modal_updateName=false;
                        this.getMembersList();
                    }else{
                      this.$Message.error({
                          content:"修改失败！稍后请重试",
                          duration: 3
                        });
                    }
                }).catch(error => {
                    console.log(error);
                    this.spinShow = false;
                });
         } else {
            return false;
          }
        });
    },
    moveMember(id){
         this.formMove.userId=id;
         this.modal_moveMember=true;
    },
    cancel_move(){
       // 取消移动
        this.modal_moveMember=false;
    },
    confirm_move(){
      // 确定移动
      if(this.formMove.deptCode==""){
        this.respCode="001";
      }else{
         this.spinShow = true;
        updateDeptCode(this.formMove).then(response => {
             this.spinShow = false;
            var data=response.data;
            if(data.respCode==1000){
                this.$Message.success("移动成功！")
                 this.modal_moveMember=false;

                 this.getMembersList();
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

    },

    deleteMember(id){
      // 删除
        this.deleteArr=[];
        this.deleteArr.push(id)
        this.modalDelete=true;
    },
    deleteMore(){
      // 批量删除
        if(this.checkAllGroup.length==0){
          this.$Message.info({
              content:"请选择要删除的成员！",
              duration: 3
            })
        }else{
           this.deleteArr=this.checkAllGroup;
          this.modalDelete=true;
        }
    },
    cancelDelete(){
        this.modalDelete=false;
    },
    confirmDelete(){//确定删除
       var data={
         "ids":this.deleteArr
       }
        this.spinShow=true;
        deleteAppUser(data).then(response => {
            var data=response.data;
             this.spinShow=false;
            if(data.respCode==1000){
                this.$Message.success("删除成功！")
                 this.modalDelete=false;
                 this.indeterminate=false;
                 this.checkAll = false;
                 this.checkAllGroup=[];
                 this.getMembersList();
            }else{
              this.$Message.error({
                  content:data.respDesc,
                  duration: 3
                });
            }
        }).catch(error => {
            console.log(error);
            this.spinShow = false;
        })
    },
    getMembersList(){//获取成员数据列表
        this.searchData.page=0;
        this.tableLoading=true;
        getAppUserList(this.searchData).then(res=>{
        this.tableLoading=false;
        var data=res.data;
        if(data.respCode==1000){
            this.dataList=data.users.data;
            this.totalData=data.users.total;
        }else{
            this.$Message.error({
                  content:data.respDesc,
                  duration: 3
                });
            this.dataList=[];
        }
        }).catch(err =>{
            this.tableLoading=false;
            console.log(err)
        })
    },

  },
  mounted () {
   this.getMembersList();
    // this.setDefaultSearchKey();
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
        })
  }
}
</script>

<style>
</style>
