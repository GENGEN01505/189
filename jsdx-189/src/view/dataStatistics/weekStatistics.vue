<template>
  <div class="content_box">
    <Card id="week_tabal">
          <div id="chart_example" style="{width: 100%;height:300px;margin:15px auto;}"></div>
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
                <Button @click="handleSearch" class="search-btn" type="primary"><Icon type="md-search" size="16"/>搜索</Button>
                <Button @click="getRecentData(30)" class="search-day" :type="thirtyType" v-if="thirtyType=='default'">最近30日</Button>
                <Button @click="getRecentData(30)" class="search-btn" :type="thirtyType" v-else>最近30日</Button>
                <Button @click="getRecentData(7)" class="search-day" :type="sevenType" v-if="sevenType=='default'">最近7日</Button>
                <Button @click="getRecentData(7)" class="search-btn" :type="sevenType" v-else>最近7日</Button>
            </div>
          </div>
          <Table height="400" border :columns="columns2" :data="data4" :loading="loading" style="width:100%;margin:20px auto;" ></Table>
          <!-- <div  class="table_Box dataNull" v-if="dataList.length>0"  v-else>
            <img :src="empty" alt="数据为空">
        </div> -->
    </Card>
      <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
import "@/assets/jquery-1.11.js";
import Vue from 'vue'
import echarts from 'echarts'
import {getRecorlist,orderExport,getFifteenDayCallStatics,getMultipleDayCallStatics} from "@/api/orgMgt";
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
      searchPlace: "top",
      searchValue: "",
      searchKey: "",
      addMore:0,
      Export,
      empty,
      endTime:'',
      startTime:'',
      searchData:{
        phone:"",
        beginDate:'',
        endDate:'',
      },
      dataList:[],
      columns2: [],
      data4: [],
      thirtyType:'default',
      sevenType:'default',
      dayLength:'',
      loading:true,
    };
  },
  created(){

  },
  methods: {
    initEcharts(){
        //  this.spinShow=true;
         getFifteenDayCallStatics().then(res=>{
            var data=res.data;
            if(data.respCode==10000){
                var callList={
                    callOutNum:[],
                    callInNum:[]
                  }
                var today=new Date();
                var listDate=[];

                for(var i=15;i>0;i--){
                    var  lw = new Date(Number(today) - 1000 * 60 * 60 * 24 * (i-1)); //num天数
                    var  lastY = lw.getFullYear();
                    var  lastM = lw.getMonth()+1;
                    var  lastD = lw.getDate();
                      if(lastD<10){
                          lastD='0'+lastD;
                      }
                        if(lastM<10){
                          lastM='0'+lastM;
                      }
                      var date=lastY+'-'+lastM+'-'+lastD;

                      if(data.result){
                         var hasNum=false;
                           for(var j=0;j<data.result.length;j++){
                                if(date==data.result[j].callTime){
                                    hasNum=j;
                                }
                            }
                            if(hasNum!=false){
                                callList.callOutNum.push(data.result[hasNum].callOutNum);
                                callList.callInNum.push(data.result[hasNum].callInNum);
                            }else{
                                callList.callOutNum.push(0);
                                callList.callInNum.push(0);
                            }
                      }else{
                        callList.callOutNum=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
                        callList.callInNum=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
                      }
                    lastM=lastM+'/';
                    listDate.push(lastM+lastD);
                }
                let myChart = echarts.init(document.getElementById('chart_example'));
                let option = {
                title:{
                      text:'最近15天主叫/被叫电话数量',
                      x:"center"
                  },
                  color:['#222D56','#2D8CF0'],
                  tooltip : {
                      trigger: 'axis'
                  },
                  legend: {
                      orient: 'vertical',
                      left: '30',
                      data: ['主叫数量（个）','被叫数量（个）']
                  },

                  grid: {
                      left: '3%',
                      right: '4%',
                      bottom: '3%',
                      containLabel: true
                  },
                  xAxis : [
                      {
                          type : 'category',
                          data :listDate,//日期
                          axisTick: {
                              alignWithLabel: true
                          }
                      }
                  ],
                  yAxis : [
                      {
                          type : 'value'
                      }
                  ],
                  series : [
                      {
                          name:'主叫数量（个）',
                          type:'line',
                          data:callList.callOutNum,
                          label:{
                              normal: {
                                  show: true,
                                  position: 'top',
                                  formatter:'{c}'
                              }
                          }
                      },
                      {
                          name:'被叫数量（个）',
                          type:'line',
                          data:callList.callInNum,
                          label:{
                              normal: {
                                  show: true,
                                  position: 'top',
                                  formatter:'{c}'
                              }
                          }
                      }
                  ]
                };
                myChart.setOption(option);

                //建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
              window.addEventListener('resize',function() {myChart.resize()});
              // this.spinShow=false;
            }else{
              this.$Message.error("查询失败！")
            }
        }).catch(err =>{
             this.spinShow=false;
            console.log(err)
        })


    },
    handleStartChange(date){
      if(date){
          this.searchData.beginDate=rightTime(date);
          this.startTime= this.searchData.beginDate;
          if(this.searchData.beginDate && this.searchData.endDate){
            this.searchData.endDate= isRightDate(this.searchData.beginDate,this.searchData.endDate,3);
            this.endTime= this.searchData.endDate;
          }
      }else{
         this.searchData.beginDate='';
      }
    },
    initTime(){//时间
       if(!this.searchData.endDate && !this.searchData.beginDate){
            var timerDate=new Date();
            this.searchData.endDate=getDate(timerDate,'day');
            this.searchData.beginDate=getPreDate(timerDate,1)
            this.startTime= this.searchData.beginDate;
            this.endTime= this.searchData.endDate;
       }else if(!this.searchData.endDate){
          this.searchData.endDate=getNextDate(this.searchData.beginDate,3)
          this.endTime= this.searchData.endDate;
       }else if(!this.searchData.beginDate){
          this.searchData.beginDate=getPreDate(this.searchData.endDate,3)
          this.startTime= this.searchData.beginDate;
       }
       var day1 = new Date(this.startTime);
       var day2 = new Date(this.endTime);
       this.dayLength=Math.floor((day2 - day1) / (1000 * 60 * 60 * 24));
      if(this.dayLength==30){
        this.thirtyType="primary";
        this.sevenType="default";
      }else  if(this.dayLength==7){
        this.thirtyType="default";
        this.sevenType="primary";
      }else{
        this.thirtyType="default";
        this.sevenType="default";
      }
    },
    handleEndChange(date){
         if(date){
          this.searchData.endDate=rightTime(date);
          this.endTime= this.searchData.endDate;
          if(this.searchData.starTime && this.searchData.endDate){
              this.searchData.endDate= isRightDate(this.searchData.starTime,this.searchData.endDate,3);
              this.endTime= this.searchData.endDate;
          }
        }else{
           this.searchData.endDate="";
        }
    },
    getRecentData(day){
        var day=-day*1
        var timerDate=new Date();
        this.searchData.endDate=getDate(timerDate,'day');
        this.searchData.beginDate=getPointDate(timerDate,day)
        this.startTime= this.searchData.beginDate;
        this.endTime= this.searchData.endDate;
        this.handleSearch()
    },
    exportExcel () {//导出表格数据
       var token=this.$store.state.user.token;
       axios.post(baseUrl+'/recor/getExport',this.searchData,{
         responseType: 'blob',
         headers: {
            'Authorization':token,
          }
        }).then(function (response) {
            const content = response.data;
            const blob = new Blob([content], {type: 'application/vnd.ms-excel'});
            const fileName = 'data.xls';
            if ('download' in document.createElement('a')) { // 非IE下载
            const elink = document.createElement('a');
            elink.download = fileName;
            elink.style.display = 'none';
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href); // 释放URL 对象
            document.body.removeChild(elink);
          } else { // IE10+下载
            navigator.msSaveBlob(blob, fileName);
          }
      }).catch(function (error) {
        console.log(error);
      });

    },
    handleSearch () {//搜索
         this.loading=true;
        this.initTime();
        getMultipleDayCallStatics(this.searchData).then(res=>{
            var data=res.data;
            if(data.respCode==10000){
             this.data4=[];
             if(data.result.length>0){
              var today=new Date(this.endTime);
               for(var i=this.dayLength;i>-1;i--){
                    var  lw = new Date(Number(today) - 1000 * 60 * 60 * 24 * i); //num天数
                    var  lastY = lw.getFullYear();
                    var  lastM = lw.getMonth()+1;
                    var  lastD = lw.getDate();
                      if(lastD<10){
                        lastD='0'+lastD;
                      }
                      if(lastM<10){
                        lastM='0'+lastM;
                      }
                      var date=lastY+'-'+lastM+'-'+lastD;
                      var allWidth= $(document).width()-220;
                      var tdWidth=Math.floor(allWidth/(data.result.length+1));
                      if(tdWidth<150){
                        tdWidth=150;
                      }
                      this.columns2=[
                        {
                            title: '日期',
                            key: 'date',
                            width:tdWidth,
                            fixed: 'left'
                        },
                       ];
                        var itemList={
                            date:date,
                          }
                           for(var j=0;j<data.result.length;j++){

                                 var itemName= data.result[j].phone;
                                      var callNum={
                                          title: itemName,
                                          key:itemName,
                                          width:tdWidth,
                                           render: (h, params) => {
                                              return h('p',{
                                                  domProps:{
                                                    innerHTML:params.row[params.column.key]
                                                  },
                                              })
                                         }
                                      };
                                 this.columns2.push(callNum);
                                 var dataList= data.result[j].dataList;
                                 if(dataList){
                                     var hasNum=-1;
                                     for(var a=0;a<dataList.length;a++){
                                          if(date==dataList[a].callTime){
                                             hasNum=a;
                                          }
                                      }
                                      if(hasNum>-1){
                                          itemList[itemName]='<p>全部：'+dataList[hasNum].callAllTimes+'分</p><p>主叫：'+dataList[hasNum].callOutTimes+'分</p><p> 被叫：'+dataList[hasNum].callInTimes+'分</p>'
                                      }else{
                                          itemList[itemName]='<p>全部：0分 </p><p> 主叫：0分</p><p>被叫：0分</p>'
                                      }
                                 }else{
                                    itemList[itemName]='<p>全部：0分 </p><p> 主叫：0分 </p><p> 被叫：0分</p>'
                                 }
                            }
                             this.data4.push(itemList);
                         }
                      }else{
                         this.columns2=[];
                      }
            }else{
              this.$Message.error("查询失败！")
            }
            this.loading=false;
        }).catch(err =>{
            this.loading=false;
            this.$Message.error("查询失败！")
            console.log(err)
        })
    }
  },
  mounted () {
    this.initEcharts();
    this.handleSearch();
  }
}
</script>

<style>
</style>
