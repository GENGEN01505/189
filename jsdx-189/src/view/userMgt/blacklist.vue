<template>
  <div class="content_box">
    <Card>
      <div v-if="searchable && searchPlace === 'top'" class="search-con search-con-top" style=" padding-top: 10px ">
       <div class="search_div">
        <span class="search-span">电话号码：</span>
        <Input  clearable placeholder="请输入电话号码" class="search-input" v-model="searchData.blackPhone" />
        </div>
        <Button @click="handleSearch" class="search-btn" type="primary">
         <Icon type="md-search" size="16"/>搜索</Button>
      </div>
      <a id="hrefToExportTable" style="display: none;width: 0px;height: 0px;"></a>
    </Card>

    <Card class="table_card" >
      <div class="listHeader">
        <i></i>
        <span>黑名单列表</span>
        <Button class="deleteBtn" @click="deleteMore">
          <Icon type="md-trash" size="16" style="position: relative;top: -1px;"/>批量删除</Button>
         <Button class="deleteBtn" @click="addBlackList">
          <Icon type="md-add-circle"  size="16" style="position: relative;top: -1px;"/>
             添加黑名单  </Button>
      </div>
      <div class="tableBox">
           <ul class="table_header">
               <li style="width:6%"><Checkbox  :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll"></Checkbox></li>
               <li style="width:30%"><span>电话号码</span></li>
               <li style="width:25%"><span>备注</span></li>
               <li style="width:35%"><span>操作</span></li>
           </ul>
          <div  class="table_Box"  v-if="dataList.length>0">
               <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
                    <ul class="table_body" v-for="(item,k) in dataList" :key="k">
                    <li style="width:6%"><Checkbox :label="item.id"> <i style="display:none"></i></Checkbox></li>
                    <li style="width:30%"><span>{{item.blackPhone}}</span></li>
                    <li style="width:25%"><span>{{item.remark}}</span></li>
                    <li style="width:35%"><a @click="blacklistDel(item.id)">删除</a></li>
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

     <Modal v-model="modal_AddMember" width="400">
        <p slot="header" style="font-size: 18px;color: #333333;text-align:center" >
            <span>添加黑名单</span>
        </p>
        <div style="text-align:center;">
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">

               <FormItem label="电话号码" prop="blackPhone">
                  <Input v-model="formValidate.blackPhone" placeholder="请输入电话号码"></Input>
              </FormItem>
              <FormItem label="备注信息">
                  <input type="text"  maxlength="8" class="ivu-input" v-model="formValidate.remark" placeholder="备注信息"/>
                  <!-- <Input v-model="formValidate.remark" placeholder="备注信息"  maxlength= 8 ></Input> -->
              </FormItem>
          </Form>
        </div>
        <div slot="footer" style="text-align:center" class="modal_footer">
              <span class="modal_footer_btn " @click="cancelBlack">取消</span>
              <span class="modal_footer_btn modal_footer_confirm" @click="addBlack">确定</span>
        </div>
    </Modal>
    <Modal v-model="modalDelete" width="360">
        <p slot="header" style="font-size: 18px;color: #333333;text-align:center" >
            <!-- <Icon type="ios-information-circle"></Icon> -->
            <span>删除黑名单</span>
        </p>
        <div style="text-align:center;padding: 30px 0;">
            <p  style="font-size:16px"> 确实要删除所选黑名单吗？</p>
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
  @import "./userMgt.less";
</style>
<script>
import { getBlackList,addBlack,deleteBlack } from "@/api/user";
import empty from '@/assets/images/empty.png';
export default {
  data() {
     const validatePhone = (rule, value, callback) => {
        var reg = /^((1[3456789]{1}[0-9]{1})+\d{8})$/g;
        var zuoNum = /^0[0-9]{2,3}[0-9]{8}$/;
        if (reg.test(value.trim())||zuoNum.test(value.trim())) {
            callback();
        } else {
            callback(new Error("请输入正确格式的电话/固话号码"));
        }
    };

    return {
      empty,
      searchable: true,
      searchPlace: "top",
      searchValue: "",
      searchKey: "",
      searchData:{
          blackPhone:'',
          page:0,
          pageSize:30
      },
      modalDelete:false,
      modal_AddMember:false,
      formValidate: {
          blackPhone:'',
          remark:''
      },
      ruleValidate: {
          blackPhone: [
              { required: true, trigger: "blur", validator: validatePhone},
          ],
      },
      spinShow:false,
      tableLoading:false,
      addMore:0,
      indeterminate: false,
      checkAll: false,
      checkAllGroup:[],
      dataList:[],
      deleteArr:[],
      totalData:0,

    };
  },
   watch: {
    modal_AddMember(){
       if(!this.modal_AddMember){
            this.formValidate.blackPhone="";
            this.formValidate.remark="";
            this.$refs['formValidate'].resetFields();
       }
    },
   },
  methods: {
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
    getBlack(){//获取黑名单数据列表
         this.searchData.page=0;
        this.tableLoading=true;
        getBlackList(this.searchData).then(res=>{
        this.tableLoading=false;
        var data=res.data;
        if(data.respCode==1000){
            this.dataList=data.blackListPage.data;
            this.totalData=data.blackListPage.total;
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
    changePage(page){//分页 更换页码
        this.searchData.page=page-1;
       this.tableLoading=true;
        getBlackList(this.searchData).then(res=>{
           this.tableLoading=false;
          var data=res.data;
          if(data.respCode==1000){
             if(data.blackListPage.data.length>0){
              this.dataList=data.blackListPage.data;
               this.totalData=data.blackListPage.total;
             }
          }else{
              this.$Message.error(data.respDesc)
          }
        }).catch(err =>{
          this.tableLoading=false;
            console.log(err)
        })
    },
    handleSearch () {
        this.getBlack()
    },

    blacklistDel(id){
        // 删除
        this.deleteArr=[];
        this.deleteArr.push(id)
        this.modalDelete=true;
    },
    deleteMore(){
      // 批量删除
        if(this.checkAllGroup.length==0){
          this.$Message.info({
              content:"请选择要删除的黑名单！",
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
           this.spinShow = true;
        deleteBlack(data).then(response => {
            var data=response.data;
             this.spinShow = false;
            if(data.respCode==1000){
                this.$Message.success("删除成功！")
                 this.modalDelete=false;
                 this.deleteArr=[];
                 this.indeterminate=false;
                 this.checkAll = false;
                 this.checkAllGroup=[];
                 this.getBlack();
            }else{
              this.$Message.info({
                  content:"删除失败！稍后请重试",
                  duration: 3
                });
            }
        }).catch(error => {
            console.log(error);
            this.spinShow = false;
        })
    },
    addBlackList(){
        this.modal_AddMember=true;
    },
    cancelBlack(){
        this.modal_AddMember=false;
    },
    addBlack(){//添加黑名单
       this.$refs.formValidate.validate(valid => {
          if (valid) {
            this.spinShow = true;
            addBlack(this.formValidate)
              .then(response => {
                 this.spinShow=false;
                var res = response.data;
                if (res.respCode == "1000") {
                     this.$Message.success({
                      content:"黑名单添加成功！",
                      duration: 3
                   });
                   this.formValidate.blackPhone='';
                   this.formValidate.remark='';
                   this.modal_AddMember=false;
                   this.getBlack();
                }else{
                   this.$Message.info({
                      content:"黑名单添加失败",
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
  },
   mounted () {
     this.getBlack();
  }
}
</script>

<style>
</style>
