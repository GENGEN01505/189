<template>
  <div class="content_box">
    <Card>
          <div id="chart_example" style="{width: 100%;height:300px;margin:15px auto;}"></div>
          <div v-if="searchable && searchPlace === 'top'" class="search-con search-con-top"  style=" padding-top: 10px ">
             <div class="search_div">
                <span class="search-span">业务号码：</span>
                <Input  clearable placeholder="请输入业务号码" class="search-input" v-model="searchData.phone" />
            </div>
            <div class="search_div">
                <span class="search-span">指定日期：</span>
                <DatePicker type="date" placeholder="指定日期：" style="width:200px" v-model="startTime" @on-change="handleStartChange"></DatePicker>
            </div>

             <div class="search_div" style="width: 250px;">
                <span class="search-span">时间点：</span>
                <Select name="startPoint" v-model="startHour" style="width:80px">
                   <Option v-for="(item,k) in startPointList" :value="item" :key="k" v-show="item<endHour">{{item}}点</Option>
                </Select>
                  <i>-</i>
                <Select name="endPoint"  v-model="endHour" style="width:80px">
                    <Option v-for="(item,k) in endPointList" :key="k" :value="item" v-show="item>startHour">{{item}}点</Option>
                </Select>
            </div>
            <div class="search_div">
                <Button @click="handleSearch" class="search-btn" type="primary"><Icon type="md-search" size="16"/>搜索</Button>
            </div>
          </div>
          <Table height="400" border :columns="columns2" :data="data4" :loading='loading' style="width:100%;margin:20px auto;" ></Table>
          <!-- <div  class="table_Box dataNull" v-if="dataList.length>0"  v-else>
            <img :src="empty" alt="数据为空">
        </div> -->
    </Card>
      <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
import Vue from 'vue'
import echarts from 'echarts'
import {getRecorlist,orderExport,getOneDayCallStatics,getOneDaySectionCallStatics} from "@/api/orgMgt";
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
        startHour:0,
        endHour:24,
        platform:this.$store.state.app.platform
      },
      startPointList:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
      endPointList:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
      startHour:0,
      endHour:24,
      dataList:[],
      columns2: [],
      data4: [],
      loading:true
    };
  },
  created(){
  },
  watch: {

  },
  methods: {
      initEcharts(){
       var today=new Date();
       var listDate=["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"];
       var dataJSON={
         platform:this.$store.state.app.platform
       }
       getOneDayCallStatics(dataJSON).then(res=>{
          var data=res.data;
            var dataList={
            "callInNumTotal":[],
            "callOutNumTotal":[]
          }
          if(data.respCode==10000){
              if(data.result.callInNumTotal=='null'||data.result.callInNumTotal==null){
                dataList.callInNumTotal=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
              }else{
                dataList.callInNumTotal=data.result.callInNumTotal;
              }
              if(data.result.callOutNumTotal=='null'||data.result.callOutNumTotal==null){
                dataList.callOutNumTotal=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
              }else{
                dataList.callOutNumTotal=data.result.callOutNumTotal;
              }
          }else{
              dataList.callInNumTotal=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
              dataList.callOutNumTotal=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
          }

            let this_ = this;
            let myChart = echarts.init(document.getElementById('chart_example'));
            let option ={
                  title:{
                      text:'昨日主叫/被叫电话数量',
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
                          data : ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],//时间
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
                          data:dataList.callOutNumTotal,
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
                          data:dataList.callInNumTotal,
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
        }).catch(err =>{
           this.spinShow=false;
            console.log(err)
        })

    },
    handleStartChange(date){
      if(date){
          this.searchData.beginDate=rightTime(date);
          this.startTime= this.searchData.beginDate;
      }else{
         this.searchData.starDate='';
      }
    },
    handleSearch () {//搜索
        this.loading=true;
        if(!this.searchData.beginDate){
            var timerDate=new Date();
            this.searchData.beginDate=getDate(timerDate,'day');
            this.startTime= this.searchData.beginDate;
        }
        if(this.startHour<10){
          this.searchData.startHour='0'+this.startHour;
        }else{
          this.searchData.startHour=''+this.startHour;
        }
        if(this.endHour<10){
          this.searchData.endHour='0'+this.endHour;
        }else{
          this.searchData.endHour=''+this.endHour;
        }
        getOneDaySectionCallStatics(this.searchData).then(res=>{
            var data=res.data;
            if(data.respCode==10000){
             this.data4=[];
             if(data.result.length>0){
              var today=new Date(this.endTime);
                      var allWidth= $(document).width()-220;
                      var tdWidth=Math.floor(allWidth/(data.result.length+1));
                      if(tdWidth<150){
                        tdWidth=150;
                      }
                      this.columns2=[
                        {
                            title: '时间段',
                            key: 'date',
                            width:tdWidth,
                            fixed: 'left'
                        },
                       ];
                        var itemList={
                            date:this.searchData.startHour+'点-'+this.searchData.endHour+'点',
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
                                                  }
                                              })
                                         }
                                      };
                                 this.columns2.push(callNum);
                                 var dataList= data.result[j].dataList;
                                 if(dataList){
                                    if(dataList.callTotalNum>0){
                                      dataList.callTotalNum=(dataList.callTotalNum/60).toFixed(2);
                                    }
                                    if(dataList.callOutTime>0){
                                      dataList.callOutTime=(dataList.callOutTime/60).toFixed(2);
                                    }
                                    if(dataList.callInTime>0){
                                      dataList.callInTime=(dataList.callInTime/60).toFixed(2);
                                    }
                                     itemList[itemName]='<p>全部：'+dataList.callTotalNum+'分</p><p>主叫：'+dataList.callOutTime+'分</p> <p>被叫：'+dataList.callInTime+'分</p>'
                                 }else{
                                    itemList[itemName]='<p>全部：0分</p><p> 主叫：0分 </p> <p>被叫：0分</p>'
                                 }
                            }
                             this.data4.push(itemList);
                         }else{
                           this.columns2=[];
                         }
            }else{
              this.$Message.error("查询失败！")
            }
             this.loading=false;
        }).catch(err =>{
          this.columns2=[];
          this.data4=[];
          this.loading=false;
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
