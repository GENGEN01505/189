<template>
  <div>
    <Card shadow style="padding-bottom:40px">
      <div class="listHeader">
        <i></i>

        <span>部门架构</span>
        <Button class="deleteBtn" @click="createNewDept">
          <Icon type="md-add-circle"  size="16" style="position: relative;top: -1px;"/>
          添加新部门</Button>
      </div>
      <tree-table ref="treeTable" expand-key="name" :expand-type="false" :selection-type="false" :columns="columns" :data="data" v-if="data.length>0" >
        <template slot="code" slot-scope="scope">
          <a @click="createDept(scope)" style="margin-right:10px;">创建子部门</a>
          <a @click="editDept(scope)" style="margin-right:10px;">编辑</a>
          <a @click="delDept(scope)" style="margin-right:10px;">删除</a>
        </template>
      </tree-table>
      <div class="tableBox"  v-else>
           <div  class="table_Box dataNull">
              <img :src="empty" alt="数据为空">
          </div>
     </div>
        <Spin size="large" fix v-if="tableLoading"></Spin>
    </Card>
     <Modal v-model="modalAddNewDep" width="400" class="modalOrgMgt">
        <p slot="header" style="font-size: 18px;color: #333333;text-align:center" >
            <span v-show="optionType==0">添加新部门</span>
            <span v-show="optionType==1">修改部门</span>
            <span v-show="optionType==2">添加子部门</span>
        </p>
        <div class="modal_body">
           <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
              <FormItem label="部门名称" prop="name">
                  <Input v-model="formValidate.name" placeholder="请输入部门名称"></Input>
              </FormItem>
          </Form>
        </div>
        <div slot="footer" style="text-align:center" class="modal_footer">
              <span class="modal_footer_btn "  @click="cancel_fun">取消</span>
              <span class="modal_footer_btn modal_footer_confirm" @click="confirm_fun">确定</span>
        </div>
    </Modal>
    <Modal v-model="modalDelete" width="360">
        <p slot="header" style="font-size: 18px;color: #333333;text-align:center" >
            <span>删除部门</span>
        </p>
        <div style="text-align:center;padding: 30px 0;">
            <p  style="font-size:16px">确实要删除所选部门吗？</p>
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
import {deleteDepartment,updateDepartment,getDepartmentList,getDeptCodeList,addNewDepartment,addDepartment} from "@/api/orgMgt";
import empty from '@/assets/images/empty.png';
export default {
  name: 'tree_table_page',
  data () {
    return {
      empty,
      columns: [
        {
          label: '部门名称',
          prop: 'name',
          minWidth: '400px',
        },
        {
          label: '操作',
          prop: 'likes',
          minWidth: '200px',
          type: 'template',
          template: 'code',
          align:'center',
          headerAlign:"center"
        }
      ],
      data: [],
      modalAddNewDep:false,
      modal_loading:false,
      modalDelete:false,
      optionType:0,
      spinShow:false,
      tableLoading:false,
      parentCode:'',
      formValidate:{
         name:'',
      },
      ruleValidate: {
        name: [
            { required: true, message: '请输入部门名称', trigger: 'blur' }
        ],
      },
      departmentId:'',
      name:'',
      departments:[],
    }
  },
  watch:{
 modalAddNewDep(){
       if(!this.modalAddNewDep){
             this.$refs['formValidate'].resetFields();
            this.respCode=0;
       }
    },
  },
  methods: {
     getDepartment(){//获取部门列表数据
        this.tableLoading=true;
        getDepartmentList().then(res=>{
        this.tableLoading=false;
        var data=res.data;
        if(data){
            this.data=data;
        }else{
           this.$Message.error(data.respDesc)
            this.data=[];
        }
        }).catch(err =>{
            this.tableLoading=false;
            console.log(err)
        })
    },
    createNewDept(scope){//创建新部门
        this.modalAddNewDep=true
        this.optionType=0;
    },
    createDept(scope){//创建子部门
        this.modalAddNewDep=true
        this.parentCode=scope.row.code;
        this.optionType=2;
    },
    editDept(scope){//编辑部门信息
        this.departmentId=scope.row.departmentId;
        this.formValidate.name=scope.row.name;
        this.modalAddNewDep=true
        this.optionType=1;
    },
    delDept(scope){//删除
       this.modalDelete=true;
       this.departmentId=scope.row.departmentId;

    },
    cancelDelete(){
        this.modalDelete=false;
    },
    confirmDelete(){//确定删除
      var data={
        "departmentId":this.departmentId
      }
       this.spinShow=true;
       deleteDepartment(this.departmentId).then(response => {
            var data=response.data;
             this.spinShow=false;
            if(data.respCode==1000){
                this.$Message.success("删除成功！")
                 this.modalDelete=false;
                 this.getDepartment();
            }else{
              this.$Message.error({
                  content:data.respDesc,
                  duration: 3
                });
                this.modalDelete=false;
            }
        }).catch(error => {
            console.log(error);
            this.spinShow = false;
        })
    },
    cancel_fun(){
       this.modalAddNewDep=false;
    },
    confirm_fun(){
       this.$refs.formValidate.validate(valid => {
          if (valid) {
              this.spinShow = true;
                if(this.optionType==1){//编辑
                    var updateData={
                      "departmentId":this.departmentId,
                      "name":this.formValidate.name
                    }
                    updateDepartment(updateData).then(response=>{
                        this.spinShow=false;
                        var data=response.data;
                        if(data.respCode==1000){
                            this.$Message.success("修改成功！")
                            this.modalAddNewDep=false;
                            this.getDepartment();
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
                }else if(this.optionType==2){//创建子部门
                    var addData={
                      "parentCode":this.parentCode,
                      "name":this.formValidate.name
                    }
                    addDepartment(addData).then(response=>{
                        this.spinShow=false;
                        var data=response.data;
                        if(data.respCode==1000){
                            this.$Message.success("子部门添加成功！")
                            this.modalAddNewDep=false;
                            this.formValidate.name="";
                            this.getDepartment();
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
                }else if(this.optionType==0){//创建新部门
                    addNewDepartment(this.formValidate).then(response=>{
                      this.spinShow=false;
                        var data=response.data;
                        if(data.respCode==1000){
                            this.$Message.success("新部门添加成功！")
                            this.modalAddNewDep=false;
                            this.formValidate.name="";
                            this.getDepartment();
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
          } else {
            return false;
          }
        });
    },
  },
  mounted () {
     this.getDepartment();
  }
}
</script>

<style>

</style>
