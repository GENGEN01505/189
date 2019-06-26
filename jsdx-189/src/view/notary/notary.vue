<template>
  <div class="content_box">
    <Card>
      <div v-if="searchable && searchPlace === 'top'" class="search-con search-con-top" style=" padding-top: 10px ">
       <div class="search_div">
        <span class="search-span">公证状态：</span>
        <Select v-model="notaryStatus" class="search-col">
            <Option :value="0">全部</Option>
            <Option :value="1">申请中</Option>
            <Option :value="2">预约成功</Option>
            <Option :value="3">预约失败</Option>
            <Option :value="4">已出证</Option>
          </Select>
        </div>
        <div class="search_div">
        <Button @click="handleSearch" class="search-btn" type="primary">
          <Icon type="search" />&nbsp;&nbsp;搜索</Button>
         </div>
      </div>
      <a id="hrefToExportTable" style="display: none;width: 0px;height: 0px;"></a>
    </Card>

    <Card class="table_card" >
      <div class="listHeader">
        <i></i>
        <span>公证申请</span>
      </div>
      <div class="tableBox">
        <!-- 申请人	事项说明	证据数量	出证公证处	当前状态	申请时间 -->
           <ul class="table_header">
               <li style="width:15%"><span>申请人</span></li>
               <li style="width:25%"><span>事项说明</span></li>
               <li style="width:10%"><span>证据数量</span></li>
               <li style="width:20%"><span>出证公证处</span></li>
               <li style="width:10%"><span>当前状态</span></li>
               <li style="width:20%"><span>申请时间</span></li>
           </ul>
          <div  class="table_Box"  v-if="dataList.length>0">
             <ul class="table_body" v-for="(item,k) in dataList" :key="k">
                <li style="width:15%"><span>{{item.applicantName}}</span></li>
                <li style="width:25%"><span>{{item.description}}</span></li>
                <li style="width:10%"><span>{{item.evidenceNum}}</span></li>
                <li style="width:20%"><span>{{item.nppName}}</span></li>
                <li style="width:10%">
                  <span v-if="item.status==1">申请中</span>
                  <span v-else-if="item.status==2">预约成功</span>
                  <span v-else-if="item.status==3">预约失败</span>
                  <span v-else-if="item.status==4">已出证</span>
                </li>
                <li style="width:20%"><span>{{item.createTime}}</span></li>
             </ul>
        </div>
        <div  class="table_Box dataNull" v-else>
            <img :src="empty" alt="数据为空">
        </div>
        <!-- 分页 -->
        <div class="table_footer" v-show="dataList.length>0">
             <Page :total="totalData" :page-size="searchData.pageSize" :current="searchData.page+1" show-total @on-change="changePage"/>
         </div>
         <!-- END分页 -->
      </div>
      <Spin size="large" fix v-if="tableLoading"></Spin>
    </Card>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>
<style lang="less">
  @import "../styleCss/callLog.less";
</style>
<script>
import {getNotary} from "@/api/notary";
import {getDate} from "@/libs/tools";
import empty from '@/assets/images/empty.png';
export default {
  data() {
    return {
      empty,
      searchable: false,
      tableLoading:false,
      searchPlace: "top",
      searchData:{
          status:'',
          page:0,
          pageSize:30
      },
      notaryStatus:0,
      spinShow:false,
      dataList:[],
      totalData:0,
    };
  },
   watch: {
      notaryStatus(){
        if(this.notaryStatus=='0'){
          this.searchData.status='';
        }else{
          this.searchData.status=this.notaryStatus;
        }
      },
   },
  methods: {
    getNotaryData(){//获取黑名单数据列表
         this.searchData.page=0;
        this.tableLoading=true;
        getNotary(this.searchData).then(res=>{
        this.tableLoading=false;
        var data=res.data;
        if(data.respCode==1000){
          var d=data.notaryPage.data;
              if(d.length>0){
                d.forEach((item)=>{
                   item.createTime=getDate(item.createTime,'day');
                })
              }
            this.dataList=d;
            this.totalData=data.notaryPage.total;
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
        getNotary(this.searchData).then(res=>{
           this.tableLoading=false;
          var data=res.data;
          if(data.respCode==1000){
             if(data.notaryPage.data.length>0){
              this.dataList=data.notaryPage.data;
               this.totalData=data.notaryPage.total;
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
        this.getNotaryData()
    },
  },
   mounted () {
     this.getNotaryData();
  }
}
</script>

<style>
</style>
