<template>
  <div class="content_box">
    <Card>
      <div v-if="searchable && searchPlace === 'top'" class="search-con search-con-top"  style=" padding-top: 10px ">
       <div class="search_div">
           <span class="search-span">开始时间：</span>
           <DatePicker type="date" placeholder="开始时间" style="width:200px" v-model="startTime" @on-change="handleStartChange"></DatePicker>
         </div>
        <div class="search_div">
           <span class="search-span">结束时间：</span>
           <DatePicker type="date" placeholder="结束时间" style="width:200px" v-model="endTime"  @on-change="handleEndChange"></DatePicker>
         </div>
         <div class="search_div">
           <span class="search-span">业务号码：</span>
           <Input  clearable placeholder="请输入业务号码" class="search-input" v-model="searchData.phone" />
         </div>
          <div class="search_div">
             <span class="search-span">姓  名：</span>
            <Input  clearable placeholder="请输入姓名" class="search-input" v-model="searchData.username" />
        </div>

        <div class="search_div">
        <Button @click="handleSearch" class="search-btn" type="primary"><Icon type="md-search" size="16"/>搜索</Button>
        <Button @click="getRecentData(30)" class="search-day" :type="thirtyType" v-if="thirtyType=='default'">最近30日</Button>
        <Button @click="getRecentData(30)" class="search-btn" :type="thirtyType" v-else>最近30日</Button>
        <Button @click="getRecentData(7)" class="search-day" :type="sevenType" v-if="sevenType=='default'">最近7日</Button>
        <Button @click="getRecentData(7)" class="search-btn" :type="sevenType" v-else>最近7日</Button>
     </div>
      </div>
    </Card>
    <Card class="table_card" >
      <div class="listHeader">
        <i></i>
        <span>记录列表</span>
        <Button class="deleteBtn" @click="exportExcel">
         <img :src="Export" style="position: relative;top: 3px;" >导出Excel</Button>
      </div>

      <div class="tableBox">
           <ul class="table_header">
               <li style="width:10%"><span>姓名</span></li>
               <li style="width:10%"><span>号码</span></li>
               <li style="width:10%"><span>主叫电话时长</span></li>
               <li style="width:10%"><span>主叫电话个数</span></li>
               <li style="width:14%"><span>主叫电话平均时长</span></li>
               <li style="width:10%"><span>被叫电话时长</span></li>
               <li style="width:10%"><span>被叫电话个数</span></li>
               <li style="width:14%"><span>被叫电话平均时长</span></li>
               <li style="width:10%"><span>总通话时长</span></li>
           </ul>
          <div  class="table_Box"  v-if="dataList.length>0">
             <ul class="table_body" v-for="(item,k) in dataList" :key="k">
               <li style="width:10%"><span>{{item.userid}}</span></li>
               <li style="width:10%"><span>{{item.phone}}</span></li>
               <li style="width:10%"><span>{{item.calloutTime}}分</span></li>
               <li style="width:10%"><span>{{item.calloutNum}}</span></li>
               <li style="width:14%"><span>{{item.callOutAvg}}分</span></li>
               <li style="width:10%"><span>{{item.incomingTime}}分</span></li>
               <li style="width:10%"><span>{{item.incomingNum}}</span></li>
               <li style="width:14%"><span>{{item.incomingAvg}}分</span></li>
               <li style="width:10%"><span>{{item.totalLength}}分</span></li>
            </ul>
        </div>
        <div  class="table_Box dataNull" v-else>
            <img :src="empty" alt="数据为空">
        </div>
        <div class="table_footer"  v-show="dataList.length>0">
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

<script>
import "@/assets/jquery-1.11.js";
import {getRecorlist,orderExport} from "@/api/orgMgt";
import {getDate,getNextDate,getPreDate,rightTime,isRightDate,getPointDate} from "@/libs/tools";
import "../styleCss/callLog.less";
import axios from 'axios'
import Export from '@/assets/images/export.png';
import empty from '@/assets/images/empty.png';
import QS from 'qs'
import config from '@/config'
var baseUrl =process.env.NODE_ENV === 'development' ? config.baseUrl.dev : process.env.VUE_APP_PATH === 'test' ? config.baseUrl.test : config.baseUrl.pro;
export default {
  data() {
    return {
      searchable: true,
      spinShow:false,
      tableLoading:false,
      searchPlace: "top",
      searchValue: "",
      searchKey: "",
      addMore:0,
      Export,
      empty,
      endTime:'',
      startTime:'',
      searchData:{
        username:"",
        endTime:'',
        starTime:'',
        phone:'',
        page:0,
        pagesize:20
      },
      dataList:[],
      thirtyType:'default',
      sevenType:'default',
    };
  },
  watch: {

  },
  methods: {
    handleStartChange(date){
      if(date){
          this.searchData.starTime=rightTime(date);
          this.startTime= this.searchData.starTime;
          if(this.searchData.starTime && this.searchData.endTime){
            this.searchData.endTime= isRightDate(this.searchData.starTime,this.searchData.endTime,3);
            this.endTime= this.searchData.endTime;
          }
      }else{
         this.searchData.starTime='';
      }
    },
    initTime(){//时间
       if(!this.searchData.endTime && !this.searchData.starTime){
            var timerDate=new Date();
            this.searchData.endTime=getDate(timerDate,'day');
            this.searchData.starTime=getPreDate(timerDate,3)
            this.startTime= this.searchData.starTime;
            this.endTime= this.searchData.endTime;
       }else if(!this.searchData.endTime){
          this.searchData.endTime=getNextDate(this.searchData.starTime,3)
          this.endTime= this.searchData.endTime;
       }else if(!this.searchData.starTime){
          this.searchData.starTime=getPreDate(this.searchData.endTime,3)
          this.startTime= this.searchData.starTime;
       }
       var day1 = new Date(this.startTime);
       var day2 = new Date(this.endTime);
       var day=Math.floor((day2 - day1) / (1000 * 60 * 60 * 24));
      if(day==30){
        this.thirtyType="primary";
        this.sevenType="default";
      }else  if(day==7){
        this.thirtyType="default";
        this.sevenType="primary";
      }else{
        this.thirtyType="default";
        this.sevenType="default";
      }
    },
    handleEndChange(date){
        if(date){
          this.searchData.endTime=rightTime(date);
          this.endTime= this.searchData.endTime;
          if(this.searchData.starTime && this.searchData.endTime){
              this.searchData.endTime= isRightDate(this.searchData.starTime,this.searchData.endTime,3);
              this.endTime= this.searchData.endTime;
          }
        }else{
           this.searchData.endTime="";
        }

    },
    getRecentData(day){
        var day=-day*1
        var timerDate=new Date();
        this.searchData.endTime=getDate(timerDate,'day');
        this.searchData.starTime=getPointDate(timerDate,day)
        this.startTime= this.searchData.starTime;
        this.endTime= this.searchData.endTime;
        this.handleSearch()
    },
    addMoreData(){//加载更多
       this.searchData.page=this.searchData.page+1;
       this.tableLoading=true;
       this.addMore=1;
       this.initTime();
        getRecorlist(this.searchData).then(res=>{
           this.tableLoading=false;
          var data=res.data;
          if(data.respCode==1000){
             if(data.callStatisticsRes.length>0){
                this.dataList=this.dataList.concat(data.callStatisticsRes);
                 if(data.callStatisticsRes.length<this.searchData.pagesize){
                    this.addMore=2;
                  }else{
                    this.addMore=0;
                  }
             }else{
                this.addMore=2;
             }
          }else{
              this.addMore=0;
              this.$Message.error("查询失败！")
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
            var timerDate=new Date();
            var nameInit="数据统计_"+getDate(timerDate,'nian2');
            var fileName= nameInit+'.xls';
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
    handleSearch () {//搜索
        this.tableLoading=true;
        this.searchData.page=0;
        this.initTime();
        getRecorlist(this.searchData).then(res=>{
            this.tableLoading=false;
            var data=res.data;
            if(data.respCode==1000){

              this.dataList=data.callStatisticsRes;
               if(data.callStatisticsRes.length<this.searchData.pagesize){
                    this.addMore=2;
                  }else{
                    this.addMore=0;
                  }
            }else{
              this.dataList=[];
              this.$Message.error("查询失败！请稍后重试")
            }
        }).catch(err =>{
             this.tableLoading=false;
            console.log(err)
        })
    }
  },
  mounted () {
    this.handleSearch();
  }
}
</script>

<style>
</style>
