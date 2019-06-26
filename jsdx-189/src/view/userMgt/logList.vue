<template>
  <div class="content_box">
    <Card>
      <div v-if="searchable && searchPlace === 'top'" class="search-con search-con-top" style=" padding-top: 10px ">
       <div class="search_div">
         <span class="search-span">开始时间：</span>
         <DatePicker type="date" placeholder="开始时间" style="width:200px" v-model="startTime" @on-change="handleStartChange"></DatePicker>
        </div>
         <div class="search_div">
         <span class="search-span">结束时间：</span>
        <DatePicker type="date" placeholder="结束时间" style="width: 200px" v-model="endTime"  @on-change="handleEndChange"></DatePicker>
        </div>
        <Button @click="handleSearch" class="search-btn" type="primary">
          <Icon type="md-search" size="16"/>搜索</Button>
      </div>
      <a id="hrefToExportTable" style="display: none;width: 0px;height: 0px;"></a>
      <!-- <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button> -->
    </Card>

    <Card class="table_card" >
      <div class="listHeader">
        <i></i>
        <span>日志列表</span>
      </div>

      <div class="tableBox">
           <ul class="table_header">
               <li style="width:15%"><span>操作人</span></li>
               <li style="width:20%"><span>操作时间</span></li>
               <li style="width:20%"><span>操作</span></li>
               <li style="width:20%"><span>操作IP</span></li>
               <li style="width:20%"><span>操作描述</span></li>

           </ul>
          <div  class="table_Box" v-if="dataList.length>0">
            <ul class="table_body" v-for="(item,k) in dataList" :key="k">
              <li style="width:15%"><span>{{item.username}}</span></li>
               <li style="width:20%"><span>{{item.createTime}}</span></li>
               <li style="width:20%"><span>{{item.module}}</span></li>
               <li style="width:20%"><span>{{item.ipAddress}}</span></li>
               <li style="width:20%"><span>{{item.remark}}</span></li>
            </ul>
        </div>
        <div  class="table_Box dataNull" v-else>
            <img :src="empty" alt="数据为空">
        </div>
        <div class="table_footer"  v-show="dataList.length>19">
             <a v-show="addMore==0" @click="addMoreData">加载更多</a>
             <a v-show="addMore==1">努力加载中······</a>
             <a v-show="addMore==2">无更多数据</a>
         </div>
      </div>
          <Spin size="large" fix v-if="tableLoading"></Spin>
    </Card>
   <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>
<style lang="less">
  @import "../styleCss/callLog.less";
  @import "./userMgt.less";
</style>
<script>
import {getLogList} from "@/api/user";
import {getDate,getNextDate,getPreDate,rightTime,isRightDate} from "@/libs/tools";
import empty from '@/assets/images/empty.png';
export default {
  data() {

    return {
      empty,
      searchable: true,
      searchPlace: "top",
      searchValue: "",
      searchKey: "",
      endTime:'',
      startTime:'',
      addMore:0,
      spinShow:false,
      tableLoading:false,
      searchData:{
        endTime:'',
        beginTime:'',
        page:0,
        pageSize:20
      },
      dataList:[]
    };
  },
  watch: {
     dataList(){
         if(this.dataList.length>0){
              this.dataList.forEach((item) => {
                 if(item.idName==null||item.idName=="null"||item.idName==''){
                    item.username=item.phone
                 }else{
                    item.username=item.idName;
                 }
                  item.createTime=getDate(item.createTime,'year')
              })
         }
     }
  },
  methods: {
   handleStartChange(date){
      if(date){
          this.searchData.beginTime=rightTime(date);
          this.startTime= this.searchData.beginTime;
          if(this.searchData.beginTime && this.searchData.endTime){
            this.searchData.endTime= isRightDate(this.searchData.beginTime,this.searchData.endTime,3);
            this.endTime= this.searchData.endTime;
          }
      }else{
         this.searchData.beginTime='';
      }
    },
    initTime(){
       if(!this.searchData.endTime && !this.searchData.beginTime){
            var timerDate=new Date();
            this.searchData.endTime=getDate(timerDate,'day');
            this.searchData.beginTime=getPreDate(timerDate,3)
            this.startTime= this.searchData.beginTime;
            this.endTime= this.searchData.endTime;
       }else if(!this.searchData.endTime){
          this.searchData.endTime=getNextDate(this.searchData.beginTime,3)
          this.endTime= this.searchData.endTime;
       }else if(!this.searchData.beginTime){
          this.searchData.beginTime=getPreDate(this.searchData.endTime,3)
          this.startTime= this.searchData.beginTime;
       }
    },

    handleEndChange(date){
        if(date){
          this.searchData.endTime=rightTime(date);
          this.endTime= this.searchData.endTime;
          if(this.searchData.beginTime && this.searchData.endTime){
              this.searchData.endTime= isRightDate(this.searchData.beginTime,this.searchData.endTime,3);
              this.endTime= this.searchData.endTime;
          }
        }else{
           this.searchData.endTime="";
        }
    },
    getListLog(){
        this.searchData.page=0;
        this.tableLoading=true;
        getLogList(this.searchData).then(res=>{
        this.tableLoading=false;
        var data=res.data;
        if(data.respCode==1000){
            this.dataList=data.logPage.data;
        }else{
           this.$Message.error({
              content: data.respDesc,
              duration: 3
            })
            this.dataList=[];
        }
        }).catch(err =>{
            this.tableLoading=false;
            console.log(err)
        })
    },
    handleSearch () {
       this.initTime();
       this.getListLog();
    },
     addMoreData(){
       this.searchData.page=this.searchData.page+1;
       this.tableLoading=true;
       this.addMore=1;
        getLogList(this.searchData).then(res=>{
           this.tableLoading=false;
          var data=res.data;
          if(data.respCode==1000){
             if(data.logPage.data.length>0){
              this.dataList=this.dataList.concat(data.logPage.data);
              if(data.logPage.data.length<this.searchData.pageSize){
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
  },
  mounted () {
   this.initTime();
   this.getListLog()
  }
}
</script>

<style>
</style>
