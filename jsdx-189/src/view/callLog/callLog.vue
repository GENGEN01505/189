<template>
  <div class="content_box">
    <Card>
      <div v-if="searchable && searchPlace === 'top'" class="search-con search-con-top" style="padding-top:10px" >
      <div class="search_div" v-show="userType==2||userType==3">
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
            <span class="search-span">开始时间：</span>
            <DatePicker type="date" placeholder="开始时间" style="width:200px" v-model="startTime" @on-change="handleStartChange"></DatePicker>
            <!-- <DatePicker type="date" placeholder="结束时间" style="width: 200px" v-model="endTime"  @on-change="handleEndChange"></DatePicker> -->
        </div>
       <div class="search_div">
            <span class="search-span">结束时间：</span>
            <!-- <DatePicker type="date" placeholder="开始时间" style="width:200px" v-model="startTime" @on-change="handleStartChange"></DatePicker> - -->
            <DatePicker type="date" placeholder="结束时间" style="width: 200px" v-model="endTime"  @on-change="handleEndChange"></DatePicker>
        </div>
           <div class="search_div">
         <span class="search-span">呼叫类型：</span>
        <Select v-model="callType" class="search-col">
          <Option :value="0">全部</Option>
          <Option :value="1">主叫</Option>
          <Option :value="2">被叫</Option>
        </Select>
        </div>
         <div class="search_div">
            <span class="search-span">主叫号码：</span>
            <Input clearable placeholder="请输入主叫号码" class="search-input" v-model="searchData.callingNumber" />
        </div>
        <div class="search_div">
            <span class="search-span">被叫号码：</span>
            <Input clearable placeholder="请输入被叫号码" class="search-input" v-model="searchData.calledNumber" />
            </div>
        <div class="search_div">
            <span class="search-span">录音状态：</span>
            <Input clearable placeholder="录音状态" class="search-input" v-model="searchData.remarks1" />
        </div>
        <div class="search_div">
            <span class="search-span">工单编号：</span>
            <Input clearable placeholder="工单编号" class="search-input" v-model="searchData.remarks2" />
        </div>
        <div class="search_div">
            <span class="search-span">备注3：</span>
            <Input clearable placeholder="备注3" class="search-input" v-model="searchData.remarks3" />
        </div>
        <Button @click="handleSearch" class="search-btn" type="primary">
          <Icon type="md-search" size="16"/>搜索</Button>
      </div>
    </Card>
 <!--通话记录列表-->
    <Card class="table_card" >
      <div class="listHeader">
        <i></i>
        <span>记录列表</span>
        <Button class="deleteBtn" @click="exportExcel" style="height: 32px;">
         <img :src="Export" style="position: relative;top: 3px;" >导出Excel</Button>
        <Button class="deleteBtn"  @click="deleteMore()"  v-show="userType==2||userType==1">
          <Icon type="md-trash" size="16" style="position: relative;top: -1px;"/>批量删除</Button>
        <Button class="deleteBtn" @click="downloadMore()">
          <Icon type="md-add-circle" size="16" style="position: relative;top: -1px;"/>批量下载</Button>
        <Button class="deleteBtn" @click="addNotary()" v-show="userType==2||userType==1">
          <Icon type="md-add-circle" size="16" style="position: relative;top: -1px;"/>申请公证</Button>

      </div>

      <div class="tableBox">
           <ul class="table_header">
               <li style="width:4%"><Checkbox :indeterminate="indeterminate" :value="checkAll"  @click.prevent.native="handleCheckAll"></Checkbox></li>
               <li style="width:5%"><span>在线播放</span></li>
               <li style="width:5%"><span>呼叫类型</span></li>
               <li style="width:8%"><span>主叫号码</span></li>
               <li style="width:8%"><span>被叫号码</span></li>
               <li style="width:8%"><span>开始时间</span></li>
               <li style="width:8%"><span>结束时间</span></l>
               <li style="width:8%"><span>通话时长</span></li>
               <li style="width:8%"><span>部门</span></li>
               <li style="width:7%"><span>录音状态</span></li>
               <li style="width:7%"><span>工单编号</span></li>
               <li style="width:7%"><span>备注3</span></li>
               <li style="width:5%"><span>备案信息</span></li>
               <li style="width:12%"><span>操作</span></li>
           </ul>
          <div  class="table_Box" v-if="dataList.length>0">

            <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
             <ul class="table_body" v-for="(item,k) in dataList" :key="k">
               <li style="width:4%"><Checkbox :label="item.rowKey"> <i style="display:none"></i></Checkbox></li>
               <li style="width:5%">
                  <img :src="upload" alt=""  @click="checkAudio(item.rowKey,item.bucket,item.filePath,item.uploadStatus)" v-if="item.uploadStatus=='1'||item.uploadStatus=='2'" style="position:relative;top:4px">
                  <img :src="playing" alt=""  @click="checkAudio(item.rowKey,item.bucket,item.filePath,item.uploadStatus)" v-else-if="item.uploadStatus=='3'&&(isPlay==true&&audioPlayId==item.rowKey)"  style="position:relative;top:4px">
                  <img :src="suspend" alt=""  @click="checkAudio(item.rowKey,item.bucket,item.filePath,item.uploadStatus)" v-else-if="item.uploadStatus=='3'&&(isPlay==false&&audioPlayId==item.rowKey)"  style="position:relative;top:4px">
                  <img :src="play" alt=""  @click="checkAudio(item.rowKey,item.bucket,item.filePath,item.uploadStatus)" v-else-if="item.uploadStatus=='3'&&(isPlay==false||audioPlayId!=item.rowKey)"  style="position:relative;top:4px">
               </li>
               <li style="width:5%">
                  <span v-if="item.callType==2">被叫</span>
                  <span v-else>主叫</span>
                 </li>
               <li style="width:8%"><span>{{item.callingNumber}}</span></li>
               <li style="width:8%"><span>{{item.calledNumber}}</span></li>
               <li style="width:8%"><span>{{item.callTime}}</span></li>
               <li style="width:8%"><span>{{item.endTime}}</span></l>
               <li style="width:8%"><span>{{item.duration}}</span></li>
               <li style="width:8%"><span>{{item.deptName}}</span></li>
               <li style="width:7%"><span>{{item.remarks1}}</span></li>
               <li style="width:7%"><span>{{item.remarks2}}</span></li>
               <li style="width:7%"><span>{{item.remarks3}}</span></li>
               <li style="width:5%" @click="beiAnFun(true,k)">
                 <!-- <img :src="beiAn" alt="" style="position: relative;top: -4px;margin-left:6px"> -->
                 <a>查看</a>
               </li>
               <li style="width:12%">
                 <a  style="margin-right:10px" @click="deleteEvd(item.rowKey)" v-show="userType==2||userType==1">删除</a>
                <a @click="download(item.bucket,item.filePath,item.uploadStatus)">下载</a>
                 <a  @click="updateRemark(item.rowKey,item.indexRowKey,item.remarks1,item.remarks2,item.remarks3)">备注</a>
                 <!-- <a  @click="addNotary(k)">公证</a> -->
               </li>
            </ul>
         </CheckboxGroup>
        </div>
       <div  class="table_Box dataNull" v-else>
            <img :src="empty" alt="数据为空">
        </div>
        <div class="table_footer" v-show="dataList.length>0">
             <a v-show="addMore==0" @click="addMoreData">加载更多</a>
             <a v-show="addMore==1">努力加载中······</a>
             <a v-show="addMore==2" >无更多数据</a>
         </div>
      </div>
       <Spin size="large" fix v-if="tableLoading"></Spin>
    </Card>
    <!--END通话记录列表-->
  <!--删除提醒-->
     <Modal v-model="modalDelete" width="360">
        <p slot="header" style="font-size: 18px;color: #333333;text-align:center" >
            <span>删除通话录音</span>
        </p>
        <div style="text-align:center;padding: 30px 0;">
            <p  style="font-size:16px">确实要删除所选通话录音吗？</p>
            <p style="color:red;margin-top:15px">一旦删除，就无法撤消此操作</p>
        </div>
        <div slot="footer">
           <div slot="footer" style="text-align:center" class="modal_footer">
              <span class="modal_footer_btn" @click="cancel_del">取消</span>
              <span class="modal_footer_btn modal_footer_confirm" @click="confirm_del">确定</span>
           </div>
        </div>
    </Modal>
     <!--END删除提醒-->
       <!--修改备注-->
     <Modal v-model="modal_updateRemark" width="560">
        <p slot="header" style="font-size: 18px;color: #333333;text-align:center" >
            <span>修改备注</span>
        </p>
        <div style="text-align:center;padding: 30px 0;">
             <div class="remarkItem">
               <span>录音状态：</span>
               <span>
                    <CheckboxGroup v-model="remarkCheckbox">
                        <Checkbox label="先行联系"></Checkbox>
                        <Checkbox label="事中沟通"></Checkbox>
                        <Checkbox label="事后办结"></Checkbox>
                        <Checkbox label="回访"></Checkbox>
                        <Checkbox label="情况说明"></Checkbox>
                    </CheckboxGroup>
               </span>
               </div>
                <div class="remarkItem">
                   <span>工单编号：</span>
                   <span><Input  type="textarea" :autosize="{minRows: 2,maxRows: 4}" :maxlength='100' v-model="remarksInfo.remarks2"></Input></span>
                </div>
                 <div class="remarkItem">
                   <span>备注3 ：</span>
                   <span><Input  type="textarea" :autosize="{minRows: 2,maxRows: 4}" :maxlength='100'  v-model="remarksInfo.remarks3"></Input></span>
                </div>
        </div>
        <div slot="footer">
           <div slot="footer" style="text-align:center" class="modal_footer">
              <span class="modal_footer_btn" @click="cancel_updateRemark">取消</span>
              <span class="modal_footer_btn modal_footer_confirm" @click="confirm_updateRemark">确定</span>
           </div>
        </div>
    </Modal>
     <!--END修改备注-->
     <!--备案证书-->
    <div class="beiAnBoxModal" v-show="modalBeiAn">

         <div  class="beiAnClose" @click="beiAnFun(false)">
            <Icon type="md-close"  size="50"/>
        </div>
         <div  class="beiAnBox">
              <img :src="beianBNG" alt="" class="beianBNG">
              <div class="beiAnInfo">
                 <img :src="zhang" alt="" class="beianIMG">
                  <h1 style="margin-bottom:50px">公证录音存证证明</h1>
                  <p style="margin-bottom:25px"  class="info_p"><span>证据编号</span>：{{evidenceBeiAn.evidenceId}}</p>
                  <p  class="info_p"><span>主叫号码</span>：{{evidenceBeiAn.callingNumber}}</p>
                  <p  class="info_p"><span>被叫号码</span>：{{evidenceBeiAn.calledNumber}}</p>
                  <p  class="info_p"><span>通话时间</span>：{{evidenceBeiAn.callTime}}</p>
                  <p style="margin-bottom:25px"  class="info_p"><span>通话时长</span>：{{evidenceBeiAn.duration}}</p>
                  <p  class="info_p"><span style="letter-spacing:1px;">录音文件MD5</span>：{{evidenceBeiAn.md5}}</p>
                  <p style="margin-bottom:35px;" class="info_p"><span style="letter-spacing:4.5px;">时间戳编号</span>：{{evidenceBeiAn.timeId}}</p>
                  <p style="margin-bottom:15px" class="describe_P">兹证明号码{{evidenceBeiAn.callNumber}}在上海电信开通了公证录音服务，上海电信对{{evidenceBeiAn.callTime}}号码{{evidenceBeiAn.callingNumber}}呼叫号码{{evidenceBeiAn.calledNumber}}的通话进行了同步录音，录音文件MD5值为{{evidenceBeiAn.md5}}。</p>
                  <p style="margin-bottom:15px" class="describe_P">上述存证时间戳系实时保电子数据保全平台接收到上述通话信息后即刻采用北京CA时间戳服务器加盖生成，北京CA时间戳服务器的时间源与中科院授时中心保持高精度同步，电子数据在时间戳加盖后无法篡改。</p>
              </div>

        </div>
    </div>
      <!--END备案证书-->
        <!--录音播放-->
     <div class="audioBox" v-show="isShowAudioBox">
          <div id="left-audio">
              <img :src="audioLeftBtn" alt=""  @click="audioPlayPause()">
          </div>
          <div id="my-audio"></div>
          <div id="my-btn">
            <a @click="audioBoxHide">隐藏</a>
            <a>|</a>
            <a  @click="audioBoxClose">关闭</a>
          </div>
     </div>
       <!--END录音播放-->
    <!--申请公证-->
     <Modal v-model="modal_AddNotary" width="60" class="modelContent">
        <p slot="header" style="font-size: 18px;color: #333333;text-align:center" >
            <span>申请公证</span>
        </p>
        <Steps :current="current" class="steps" style="position: relative;left: 9%;">
                <Step title="证据列表"></Step>
                <Step title="公证须知"></Step>
                <Step title="申请信息"></Step>
                <Step title="完成"></Step>
          </Steps>

        <div class="NotaryLi">
            <div id="Notary01" v-show="current==0" style="padding:0">
              <div class="tableBox">
                <ul class="table_header">
                  <li style="width:10%">呼叫类型</li>
                  <li style="width:20%">主叫号码</li>
                  <li style="width:20%">被叫号码</li>
                  <li style="width:20%">通话时长</li>
                  <li style="width:20%">存证公证处</li>
                  <li style="width:10%">操作</li>
                </ul>
                <div  class="table_Box" v-if="notaryData.length>0">

                  <ul class="table_body" v-for="(item,k) in notaryData" :key="k">
                    <li style="width:10%"><span v-if="item.callType==2">被叫</span><span v-else>主叫</span></li>
                    <li style="width:20%"><span>{{item.callingNumber}}</span></li>
                    <li style="width:20%"><span>{{item.calledNumber}}</span></li>
                    <li style="width:20%"><span>{{item.duration}}</span></l>
                    <li style="width:20%"><span></span></li>
                    <li style="width:10%"><a @click="removeNotary(item.rowKey)">删除</a></li>
                  </ul>
                </div>
                <div  class="table_Box dataNull" v-else>
                    <img :src="empty" alt="数据为空">
                </div>

                </div>
            </div>
            <div id="Notary02" v-show="current==1">
                <div class="orczxz">
                    <p>公证所需材料</p>
                    <ul>
                        <li>申请人办理需携带：</li>
                        <li>申请人的营业执照副本或正本复印件（盖公章）</li>
                        <li>申请人的组织机构代码证（盖公章）</li>
                        <li>法定代表人身份证明（盖公章）</li>
                        <li>法定代表人身份证复印件（盖公章）</li>
                    </ul>
                    <ul>
                        <li>委托办理还需携带：</li>
                        <li>授权委托书（盖公章）</li>
                        <li>受托人身份证复印件</li>
                        <li>著作权凭证</li>
                    </ul>
                </div>
                <div class="orczxz" style="clear:both; border-top: solid 1px #dedede;">
                    <p>出证必须由申请人或受托人到场</p>
                </div>
            </div>
            <div id="Notary03" v-show="current==2">
                <div class="oryysx">
                     <Form ref="notaryInfo" :model="notaryInfo" :rules="ruleValidate" :label-width="130" class="notaryInfoForm">
                         <FormItem label="公　证　处：" prop="nppCode">
                            <Select v-model="notaryInfo.nppCode" >
                                <Option :value="item.code" v-for="(item,k) in nppList" :key="k">{{item.name}}</Option>
                            </Select>
                            <b>*选择公证处办理公证书</b>
                        </FormItem>
                        <FormItem label="委托人姓名：" prop="agentName">
                            <Input v-model="notaryInfo.agentName" clearable></Input>
                            <b>* 委托书姓名</b>
                        </FormItem>
                        <FormItem label="公证主体　：" prop="abstract">
                            <Input v-model="notaryInfo.abstract" clearable ></Input>
                            <b>* 公证主体</b>
                        </FormItem>
                        <FormItem label="手机号码　：" prop="agentPhoneNo">
                            <Input v-model="notaryInfo.agentPhoneNo" clearable></Input>
                            <b>* 接收公证提示信息</b>
                        </FormItem>

                       <FormItem label="邮　　箱　：" prop="agentEmail">
                            <Input v-model="notaryInfo.agentEmail" clearable ></Input>
                            <b>* 接收公证提示信息</b>
                        </FormItem>
                        <!-- <FormItem label="事项名称　：" prop="matterName">
                            <Input v-model="notaryInfo.matterName" clearable></Input>
                            <b>*公证事项标题</b>
                        </FormItem> -->
                        <FormItem label="事项名称　：" prop="description">
                            <Input v-model="notaryInfo.description" clearable></Input>
                            <b>*简要说明公证事项</b>
                        </FormItem>
                    </Form>
               </div>
            </div>
            <div id="Notary04" v-show="current==3">
                <Icon type="md-checkmark-circle" size="120" color="#2d8cf0" style=" margin-top: 100px;margin-bottom: 80px;"/>
                <p>申请公证提交成功，查看当前公证状态请至 <router-link tag="a"  :to="{name:'notary_data'}" style="color:#2d8cf0">公证查询</router-link>，谢谢！</p>
            </div>
        </div>
        <div slot="footer"  class="NotaryBut">
             <span class="NoPrev" v-show="current>0&&current<3" @click="notaryPrev">上一步</span>
             <span class="NoNext" v-show="current<2"  @click="notaryNext">下一步</span>
             <span class="NoNext" v-show="current==2"  @click="notaryNext">提交</span>
             <span class="NoOk"  v-show="current==3"  @click="notaryConfirm">确　定</span>
        </div>

    </Modal>
<!--END申请公证-->
    <Spin size="large" fix v-if="spinShow"></Spin>
    <Spin fix size="large" v-if="downloadShow">
        <Icon type="ios-loading" size=48 class="demo-spin-icon-load"></Icon>
        <div>文件下载中...</div>
    </Spin>
  </div>
</template>
<style lang="less">
  @import "../styleCss/callLog.less";
  @import "../styleCss/orgMgt.less";
  @import "./beian.less";
</style>
<script>
import "@/assets/jquery-1.11.js";
import "./audio.js";
import {mapActions} from 'vuex'
import {getDeptCodeList,getRecordUserList,updateRecordUser,getCallLogList,deleteCallLog,getRecordPath,updateRemark,capacityAlert,callRecordMultipleDowload} from "@/api/orgMgt";
import {getNppList,addNotary} from "@/api/notary";
import {getDate,getNextDate,getPreDate,rightTime,isRightDate} from "@/libs/tools";
// import {handleBatchDownload} from "@/libs/download";
import play from '@/assets/images/play.png';
import playing from '@/assets/images/playing.gif';
import upload from '@/assets/images/upload.gif';
import suspend from '@/assets/images/suspend.png';
import beiAn from '@/assets/images/baxx.png';
import pauseBtn from '@/assets/images/zt.png';
import playBtn from '@/assets/images/bf.png';
import empty from '@/assets/images/empty.png';
import beianBNG from "@/assets/images/beian.png"
import zhang from "@/assets/images/yba.png"
import Export from '@/assets/images/export.png';
import config from '@/config';
import axios from 'axios'
import QS from 'qs'
var baseUrl =process.env.NODE_ENV === 'development' ? config.baseUrl.dev : process.env.VUE_APP_PATH === 'test' ? config.baseUrl.test : config.baseUrl.pro;
var downloadUrl =process.env.NODE_ENV === 'development' ? 'http://192.168.9.101:8080/ossdownload' : process.env.VUE_APP_PATH === 'test' ? 'http://192.168.9.101:8080/ossdownload': 'https://rdbao-api.1010bao.com:8080/ossdownload';
export default {
  data() {
       const validatePhone = (rule, value, callback) => {
        var reg = /^((1[3456789]{1}[0-9]{1})+\d{8})$/g;
        if (reg.test(value.trim())) {
           callback();
        } else {
           callback(new Error("手机号码错误"));
        }
    };

    const validateEmail = (rule, value, callback) => {
      var isEmail = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
       if (isEmail.test(value.trim())) {
            callback();
          } else {
            callback(new Error("邮箱格式错误"));
        }
      };
    return {
      userType:this.$store.state.user.userType,
      searchable: true,
      searchPlace: "top",
      searchValue: "",
      searchKey: "",
      play,
      empty,
      playing,
      suspend,
      style:'padding-top:10px',
      beiAn,
      upload,
      beianBNG,
      zhang,
      Export,
      playLogo:play,
      audioLeftBtn:playBtn,
      startTime:'',
      endTime:'',
      callType:'0',
      searchData:{//搜索数据
         startTime:'',
         endTime:'',
         pageSize:20,
         callType:'',
         deptCode:'',
         callingNumber:'',
         calledNumber:'',
         pageFlag:'',
         remarks1:'',
         remarks2:'',
         remarks3:'',
      },
      modalDelete:false,
      deleteRowKey:[],//暂存删除的rowkey
      modalBeiAn:false,
      modal_loading:false,
      modal_AddNotary:false,
      modal_updateRemark:false,
      indeterminate: false,
      checkAll: false,
      search_tree:false,
      orgName:'请选择部门',
      orgId:'',
      orgArray:[],
      checkAllGroup:[],
      dataList:[],
      wxAudio:"",
      isPlay:false,
      audioPlayId:"",
      isShowAudioBox:false,
      addMore:0,
      spinShow:false,
      tableLoading:false,
      downloadShow:false,
      evidenceBeiAn:{//备案数据
         evidenceId:'',
         callingNumber:'',
         calledNumber:'',
         callTime:'',
         duration:'',
         md5:' ',
         timeId:'',
         callNumber:''

      },
      remarkCheckbox:[],
      remarksInfo:{
        rowKey:'',
        indexRowKey:'',
        remarks1:'',
        remarks2:'',
        remarks3:'',
      },
      current:0,//申请公证进度条
      notaryData:[],
      notaryInfo:{//申请公证信息
        applicantName:this.$store.state.user.userName,
        agentName:'',
        agentIDNo:'',
        agentPhoneNo:'',
        agentEmail:'',
         abstract:'',
         evidenceInfo:[],
         nppCode:'',
         timeStamp:'',
         description:'',
      },
      downloadList:'',//批量下载list
      nppList:[],//公证处List
      ruleValidate: {
          nppCode: [
              { required: true, message: '请选择公证处', trigger: 'change' }
          ],
          agentName: [
              { required: true, message: '请输入委托人姓名', trigger: 'change' }
          ],
          abstract: [
              { required: true, message: '请输入公证主体', trigger: 'change' }
          ],
          agentPhoneNo: [
              { required: true, trigger: "blur", validator: validatePhone},
          ],
          agentEmail: [
              { required: true, trigger: "blur", validator: validateEmail},
          ],
          matterName: [
              { required: true, message: '请输入公证事项标题', trigger: 'change' }
          ],

          description: [
              { required: true, message: '请简要说明公证事项', trigger: 'change' }
          ],

      },
    };
  },
  watch: {
    isPlay(){
      if(this.isPlay){
        this.audioLeftBtn=pauseBtn;
      }else{
        this.audioLeftBtn=playBtn;
      }
    },
    callType(){
      if(this.callType=='0'){
        this.searchData.callType='';
      }else{
        this.searchData.callType=this.callType;
      }
    },
    modal_AddNotary(){
       if(!this.modal_AddNotary){
          this.$refs['notaryInfo'].resetFields();
       }
    },
  },
  methods: {
      ...mapActions([
      'handleLogOut'
    ]),
    handleCheckAll () {
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
              _this.checkAllGroup.push(item.rowKey);
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
  downloadMore(){
        if(this.checkAllGroup.length==0){
          this.$Message.info({
              content:"请选择要下载的通话记录！",
              duration: 3
            })
        }else if(this.checkAllGroup.length>50){
          this.$Message.info({
              content:"本次批量下载数量不能超过50条！",
              duration: 3
            })
        }else{
          var  _this=this;
           var  bucket=''
          _this.downloadList=[];
          for (var i=0;i<_this.checkAllGroup.length;i++){
              _this.dataList.forEach((item)=>{
                  if(_this.checkAllGroup[i]==item.rowKey){
                       bucket=item.bucket;
                       _this.downloadList.push(item.filePath);
                  }
              })
          }
            var jsonData={
              "bucket":bucket,
              "filePaths":this.downloadList
            }
            this.callRecordMultipleDowload(jsonData)
        }
    },
    callRecordMultipleDowload(data){
        // /callRecordMultipleDowload
        var _this=this;
        this.downloadShow=true;
        var token=this.$store.state.user.token;//
         axios.post(downloadUrl+'/callRecordMultipleDowload',data,{
         headers: {
           'Authorization':token,
         }
        }).then((res)=>{
          if(res.data){
             var timerDate=new Date();
            var nameInit="录音文件_"+getDate(timerDate,'nian2');
            var fileName= nameInit+'.zip';
                if ('download' in document.createElement('a')) { // 非IE下载
                const elink = document.createElement('a');
                elink.download = fileName;
                elink.style.display = 'none';
                elink.href =downloadUrl+res.data;
                document.body.appendChild(elink);
                elink.click();
                document.body.removeChild(elink);
              }
            _this.downloadShow=false;
        }else{
             this.$Message.info({
                          content:"录音文件正在上传，请稍后重试！",
                          duration: 3
                    });
            _this.downloadShow=false;
        }
        }).catch(function (error) {
          _this.downloadShow=false;
        });
    },
    handleStartChange(date){
      if(date){
          this.searchData.startTime=rightTime(date);
          this.startTime= this.searchData.startTime;
          if(this.searchData.startTime && this.searchData.endTime){
            this.searchData.endTime= isRightDate(this.searchData.startTime,this.searchData.endTime,3);
            this.endTime= this.searchData.endTime;
          }
      }else{
         this.searchData.startTime='';
      }
    },
    initTime(){//初始
       if(!this.searchData.endTime && !this.searchData.startTime){
            var timerDate=new Date();
            this.searchData.endTime=getDate(timerDate,'day');
            this.searchData.startTime=getPreDate(timerDate,3)
            this.startTime= this.searchData.startTime;
            this.endTime= this.searchData.endTime;
       }else if(!this.searchData.endTime){
          this.searchData.endTime=getNextDate(this.searchData.startTime,3)
          this.endTime= this.searchData.endTime;
       }else if(!this.searchData.startTime){
          this.searchData.startTime=getPreDate(this.searchData.endTime,3)
          this.startTime= this.searchData.startTime;
       }
    },
    handleEndChange(date){//结束时间change
        if(date){
          this.searchData.endTime=rightTime(date);
          this.endTime= this.searchData.endTime;
          if(this.searchData.startTime && this.searchData.endTime){
              this.searchData.endTime= isRightDate(this.searchData.startTime,this.searchData.endTime,3);
              this.endTime= this.searchData.endTime;
          }
        }else{
           this.searchData.endTime="";
        }
    },
    getOrgInfo(data){//获取搜索条件部门信息
       if(data.length>0){
          this.orgId=data[0].code;
          this.orgName=data[0].title;
          this.searchData.deptCode=data[0].code;
          this.search_tree=false;
       }else{
         this.orgId="";
         this.orgName="请选择部门";
         this.searchData.deptCode="";
         this.search_tree=false;
       }

    },
    initSearch_tree(){
       this.orgId="";
       this.orgName="请选择部门";
       this.searchData.deptCode="";
       this.search_tree=false;
    },
    getCallLog(){
       this.tableLoading=true;
       this.searchData.startTime= this.searchData.startTime;
       this.searchData.endTime= this.searchData.endTime;
       this.page=0;
        getCallLogList(this.searchData).then(res=>{
           this.tableLoading=false;
           var data=res.data.bizData;
          if(data.respCode=="1000"){
            var da=data.data;
             this.searchData.pageFlag=da.pageFlag;
             if(da.list.length>0){
                da.list.forEach((item)=>{
                   item.duration=this.sec_to_time(item.duration*1);
                })
               this.dataList=da.list;
               if(da.list.length<this.searchData.pageSize){
                    this.addMore=2;
                  }else{
                    this.addMore=0;
                  }
             }else{
               this.dataList=[]
             }
          }else{
               this.dataList=[]
              this.$Message.error(data.respDesc)
          }
        }).catch(err =>{
          this.tableLoading=false;
          this.dataList=[];
          console.log(err)
        })
    },
    addMoreData(){//加载更多
        this.tableLoading=true;
        this.addMore=1;
        getCallLogList(this.searchData).then(res=>{
           this.tableLoading=false;
           var data=res.data.bizData;
          if(data.respCode==1000){
              var da=data.data;
             this.searchData.pageFlag=da.pageFlag;
             if(da.list.length>0){
                da.list.forEach((item)=>{
                   item.duration=this.sec_to_time(item.duration*1);
                });
               this.dataList=this.dataList.concat(da.list);
                if(this.checkAllGroup.length>0){
                    this.indeterminate = true;
                    this.checkAll = false;
                }
                if(da.list.length<this.searchData.pageSize){
                    this.addMore=2;
                  }else{
                    this.addMore=0;
                  }

             }else{
                this.addMore=2;
             }
          }else{
              this.addMore=0;
              this.$Message.error(data.respDesc);
          }
        }).catch(err =>{
          this.tableLoading=false;
          this.addMore=0;
            console.log(err)
        })
    },
    handleSearch () {//搜索
        this.initTime();
        this.indeterminate=false;
        this.checkAll = false;
        this.checkAllGroup=[];
        this.searchData.pageFlag='';
        this.getCallLog()
    },
    sec_to_time (s) {
        var t="";
        if(s > -1){
            var hour = Math.floor(s/3600);
            var min = Math.floor(s/60) % 60;
            var sec = s % 60;
            if(hour==0){
                t="";
            }else if(hour < 10 && hour>0) {
                t = '0'+ hour + "时";
            }else{
                t = hour + "时";
            }
            if(hour==0&&min==0){
              if(sec < 10){t += "0";}
               t += sec+'秒';
            }else{
                if(min < 10){t += "0";}
                t += min + "分";
                if(sec < 10){t += "0";}
                t += sec+'秒';
            }

        }
        return t;
    },
    deleteMore () {//批量删除
         // 批量删除
        if(this.checkAllGroup.length==0){
          this.$Message.info({
              content:"请选择要删除通话记录！",
              duration: 3
            })
        }else{
          var  _this=this;
          _this.deleteRowKey=[];
          for (var i=0;i<_this.checkAllGroup.length;i++){
              _this.dataList.forEach((item)=>{
                  if(_this.checkAllGroup[i]==item.rowKey){
                       var data={
                         'rowKey':item.rowKey,
                         'indexRowKey':item.indexRowKey
                       }
                       _this.deleteRowKey.push(data);
                  }
              })
          }
          this.modalDelete=true;
        }
     },
     deleteEvd(rowKey){
       var _this=this;
       _this.deleteRowKey=[];
       _this.dataList.forEach((item)=>{
          if(rowKey==item.rowKey){
                var data={
                  'rowKey':item.rowKey,
                  'indexRowKey':item.indexRowKey
                }
                _this.deleteRowKey.push(data);
          }
        })
        this.modalDelete=true;
     },
     confirm_del(){//确定删除
        var data={
          "str":JSON.stringify(this.deleteRowKey)
        }
         this.spinShow=true;
       deleteCallLog(data).then(response => {
             this.spinShow=false;
            var data=response.data.bizData;
            if(data.code="1000"){
                this.$Message.success("删除成功！")
                 this.modalDelete=false;
                 this.indeterminate=false;
                 this.checkAll = false;
                 this.checkAllGroup=[];
                 this.searchData.pageFlag='';
                 this.getCallLog();
            }else{
              this.$Message.info({
                  content:"删除失败！稍后请重试",
                  duration: 3
                });
                this.modalDelete=false;
            }
        }).catch(error => {
            console.log(error);
            this.spinShow = false;
        })
     },
      cancel_del(){
       this.modalDelete=false;
     },
   beiAnFun(bool,index){//备案
       if(bool){
          var data=this.dataList[index];
          if(data.evidenceId){
              this.evidenceBeiAn.evidenceId = data.evidenceId;
              this.evidenceBeiAn.callingNumber = data.callingNumber;
              this.evidenceBeiAn.calledNumber = data.calledNumber;
              this.evidenceBeiAn.callTime = getDate(data.callTime,'nian');
              this.evidenceBeiAn.callNumber = data.callType ==1 ? data.callingNumber : data.calledNumber;
              this.evidenceBeiAn.duration = data.duration;
              this.evidenceBeiAn.md5 = data.md5;
              var str= data.rowKey.split(':');
              this.evidenceBeiAn.timeId = str[1]+str[2];
              this.modalBeiAn=bool;
          }else{
              this.$Message.info({
                  content:"录音文件正在上传，请稍后重试！",
                  duration: 3
              });
          }
      }else{
         this.modalBeiAn=bool;
      }
    },
 download(bucket,filePath,status){//下载录音
      if(status==3||status=="3"){
        var data={
          "bucket":bucket,
          "filePath":filePath
        }
          getRecordPath(data).then(res=>{
              if(res.data.status="0"){
                var da=res.data.bizData;
                if(da.code=='1000'){
                   var path=da.url;
                    var a=path.split('?');
                    var b=a[0].split('/');
                    var pathName=b[b.length-1];
                    var elink = document.createElement('a');
                    elink.download = pathName;
                    elink.target= '_blank';
                    elink.style.display = 'none';
                    elink.href=path;
                    document.body.appendChild(elink);
                    elink.click();
                    document.body.removeChild(elink);
                }else{
                    this.$Message.info({
                      content:"录音文件正在上传，请稍后重试！",
                      duration: 3
                  });
                }

              }else{
                this.$Message.error({
                      content:"录音文件下载地址获取失败！稍后请重试",
                      duration: 3
                  });
              }
          }).catch(err =>{
              console.log(err)
          })
    }else{
       this.$Message.info({
            content:"录音文件正在处理中，暂不能下载",
            duration: 3
        });
    }
  },
  checkAudio(id,bucket,filePath,status){//切换录音
    if(status=='3'){
         if(this.audioPlayId==id){
            this.isShowAudioBox=true;
          }else{

              var data={
               "bucket":bucket,
               "filePath":filePath,
               "evidenctId":1
            }
            getRecordPath(data).then(res=>{
                if(res.data.status="0"){
                   var da=res.data.bizData;
                    if(da.code=='1000'){
                      this.audioPlayId=id;
                      var path=da.url;
                      this.isShowAudioBox=true;
                      this.wxAudio.audioCut(path);
                    }else{
                        this.$Message.info({
                          content:"录音文件正在上传，请稍后重试！",
                          duration: 3
                      });
                       this.audioBoxClose();
                    }
                }else{
                  this.$Message.error({
                        content:"获取播放地址失败！稍后请重试",
                        duration: 3
                    });
                     this.audioBoxClose();
                }
            }).catch(err =>{
                console.log(err)
                this.$Message.error({
                      content:"播放失败！稍后请重试",
                      duration: 3
                  });
                   this.audioBoxClose();
            })
          }
     }else{
       this.$Message.error({
              content:"录音文件正在处理中！稍后请重试",
              duration: 3
          });
            this.audioBoxClose();
     }

  },
  audioPlayPause(){//暂停播放切换
    if(this.isPlay){
      this.wxAudio.audioPause();
    }else{
      this.wxAudio.audioPlay();
    }

  },
  audioBoxHide(){//播放框隐藏
     this.isShowAudioBox=false;
  },
  audioBoxClose(){//播放框关闭
     this.audioPlayId='';
     this.isShowAudioBox=false;
     this.wxAudio.audioPause();
  },
  updateRemark(rowKey,indexRowKey,remarks1,remarks2,remarks3){
      this.remarksInfo.rowKey=rowKey;
      this.remarksInfo.indexRowKey=indexRowKey;
      if(remarks1){
        this.remarkCheckbox=remarks1.split(',');
      }else{
         this.remarkCheckbox=[];
      }
      this.remarksInfo.remarks2=remarks2;
      this.remarksInfo.remarks3=remarks3;
      this.modal_updateRemark=true;
  },
  cancel_updateRemark(){
    this.modal_updateRemark=false;
  },
  confirm_updateRemark(){
       this.remarksInfo.remarks1=this.remarkCheckbox.join(',');
       this.spinShow=true;
       updateRemark(this.remarksInfo).then(response => {
             this.spinShow=false;
            var data=response.data;
            if(data.code="1000"){
                this.$Message.success("修改成功！")
                this.modal_updateRemark=false;
                 this.indeterminate=false;
                 this.checkAll = false;
                 this.checkAllGroup=[];
                 this.searchData.pageFlag='';
                 this.getCallLog();
            }else{
              this.$Message.info({
                  content:"修改失败！稍后请重试",
                  duration: 3
                });
                this.modal_updateRemark=false;
            }
        }).catch(error => {
            console.log(error);
            this.spinShow = false;
        })
  },
  addNotary(){
      if(this.checkAllGroup.length==0){
          this.$Message.info({
              content:"请选择要申请公证的通话记录！",
              duration: 3
            })
        }else{

          getNppList().then(res=>{
            var data=res.data;
            if(data.length>0){
               this.nppList=data;
               this.notaryInfo.nppCode=data[0].code;
            }else{
               this.nppList=[];
            }
        }).catch(err =>{
            console.log(err)
        })
         var _this=this;
          _this.notaryData=[];
          _this.checkAllGroup.forEach(function(item){
             _this.dataList.forEach(function(items){
                if(item==items.rowKey){
                   _this.notaryData.push(items);
                }
              })
          })

           _this.modal_AddNotary=true;
        }

  },
  removeNotary(rowKey){
     var _this=this;

      // _this.checkAllGroup.forEach(function(item){
       _this.notaryData.forEach(function(items,key){
          if(rowKey==items.rowKey){
              _this.notaryData.splice(key,1);
              for(var i=0;i<_this.checkAllGroup.length;i++){
                if(rowKey==_this.checkAllGroup[i]){
                     _this.checkAllGroup.splice(i,1);
                }
              }
            }
       });

  },
  notaryPrev(){
    this.current=this.current-1;
  },
  notaryNext(){
    if(this.current==2){
      var _this=this;
       _this.notaryData.forEach(function(items){
          var d={
              "evidenceId":items.evidenceId
            }
            _this.notaryInfo.evidenceInfo.push(d)
        })
       var formData={
         "requestId":this.guid(),
         "applicantInfo":{
            "applicantName":_this.notaryInfo.applicantName,
         },
         "agentInfo":{
            "agentName":_this.notaryInfo.agentName,
            "agentIDNo":_this.notaryInfo.agentIDNo,
            "agentPhoneNo":_this.notaryInfo.agentPhoneNo,
            "agentEmail":_this.notaryInfo.agentEmail,
         },
         "abstract":_this.notaryInfo.abstract,
         "evidenceInfo":_this.notaryInfo.evidenceInfo,
         "nppCode":_this.notaryInfo.nppCode,
         "timeStamp":(new Date()).getTime(),
         "description":_this.notaryInfo.description,
      };

       this.$refs.notaryInfo.validate(valid => {
             if (valid) {
                 addNotary(formData).then(res=>{
                      var data=res.data;
                      if(data.respCode==1000){
                          this.current=this.current+1;
                      }else{
                        this.$Message.info({
                          content:"！稍后请重试",
                          duration: 3
                        });
                      }
                  }).catch(err =>{
                      console.log(err)
                  })
              }
         })

     }else{
        this.current=this.current+1;
     }
  },
  notaryConfirm(){
    this.modal_AddNotary=false;
  },
  guid() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0,
				v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	},
  exportExcel () {//导出表格数据
       var token=this.$store.state.user.token;
       var url=baseUrl+'/sh/exportExcel?startTime='+this.searchData.startTime+'&endTime='+this.searchData.endTime+'&pageSize='+this.searchData.pageSize+'&callType='+this.searchData.callType+'&deptCode='+this.searchData.deptCode+'&callingNumber='+this.searchData.callingNumber+'&calledNumber='+this.searchData.calledNumber+'&remarks1='+this.searchData.remarks1+'&remarks2='+this.searchData.remarks2+'&remarks3='+this.searchData.remarks3
       axios.get(url,{
         responseType: 'blob',
         headers: {
            'Authorization':token,
          }
        }).then(function (response) {
            const content = response.data;
            const blob = new Blob([content], {type: 'application/vnd.ms-excel'});
            var timerDate=new Date();
            var nameInit="通话记录_"+getDate(timerDate,'nian2');
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
    capacityAlert(){
        var alert=window.sessionStorage.getItem('alert');
        if(alert!="one"){

          capacityAlert().then(res=>{
              this.spinShow=false;
              var data=res.data;
              window.sessionStorage.setItem('alert','one');
              if(data.resCode=="1000"){
                 var total=data.data.total*1;
                 var alreadyUsedNum=data.data.alreadyUsedNum*1;
                 var persentNum=alreadyUsedNum/total*100;
                 persentNum=persentNum.toFixed(2);
                 if(persentNum>80){
                     this.$Modal.info({
                        title: "系统提醒",
                        content:"尊敬的用户：</br><span style='display:inline-block;width:25px'></span> 当前存储空间已使用<b style='color:#2251B9;font-size:18px;'>"+persentNum+"%</b>,空间使用到达<b style='color:red;font-size:18px;'>100%</b>后，系统将自动清理最早数据。</p>",
                        okText: '我知道了',
                    });
                 }
                }
          }).catch(err =>{
              console.log(err)
          });
        }

    }
},
mounted () {
    this.initTime()
    this.getCallLog()
    getDeptCodeList().then(res=>{
          var data=res.data;
          if(data.length>0){
           this.orgArray=data;
          }else{
           this.orgArray=[];
          }
      }).catch(err =>{
          console.log(err)
      });

    this.$nextTick(()=>{
       var vueObj=this;
       this.wxAudio = new Wxaudio({
		    ele: '#my-audio',
		    src: '',
        width: '100%',
        vueObj:vueObj
      });
      //  if(this.userType==1||this.userType==2){
      //     this.capacityAlert();
      //  }

   })
  }
}
</script>

<style>
</style>
