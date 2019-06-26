<style lang="less">
  @import './help.less';
</style>
<template>
    <div class="help">
         <div class="content">
		  	    <h1>公证录音使用说明</h1>
		  	    <h2>系统登录</h2>
		  	    <ul>
		  	    	<li><Icon type="ios-square" class="liIcon"/> <span> 打开登录界面：在浏览器的地址栏中输入https://189.1010bao.com打开上海公证录音平台网。</span>   </li>
		  	    	<li><Icon type="ios-square" class="liIcon"/><span>用户登录：输入正确的用户名并输入手机收到的短信验证码后点击登录按钮后进入平台。</span></li>
              <li><img :src="login" alt="登录"></li>
            	<li><Icon type="ios-square" class="liIcon"/><span>新用户注册：新用户指的是个人用户注册，企业管理员用户不用注册（由平台初始化自动设置），注册时需填写用户的相关信息并勾选“公证录音服务协议”前的选项后点击完成即注册操作完成</span></li>
              <li><img :src="register1" alt="个人用户注册"></li>
              <li><Icon type="ios-square" class="liIcon"/><span>忘记密码：填写电话号码并点击“发送验证码”后填写手机收到的验证码，点击下一步后设置新密码即可完成密码重置操作。</span></li>
              <li><img :src="back_pass_1" alt="忘记密码1"></li>
              <li><img :src="back_pass_2" alt="忘记密码2"></li>
              <li><img :src="back_pass_3" alt="忘记密码3"></li>
		  	    </ul>
            <h2>企业云盘登录</h2>
            <ul>
		  	    	<li><Icon type="ios-square" class="liIcon"/> <span> 点击系统登录界面中的“天翼企业云盘”按钮后浏览器自动打开云盘登录页面。</span>   </li>
		  	    	<li><Icon type="ios-square" class="liIcon"/> <span>在云盘登录界面中输入用户名、密码和云盘号码并拖动验证滑块后点击登录进入云盘。</span>   </li>
		  	    	<li><Icon type="ios-square" class="liIcon"/> <span> 进入云盘后可对云盘存储的录音文件进行操作，云盘的录音文件以日期作为文件夹自动存储。</span>   </li>
              <li><img :src="login" alt="登录"></li>
              <li><img :src="ypLogin" alt="云盘登录"></li>

		  	    </ul>
		  	    <h2>通话记录</h2>
		  	    <ul>
	             <li><Icon type="ios-square" class="liIcon"/><span>查看通话记录：可通过多种查询条件组合查询通话记录，每次查询的时间范围最长为90天。 </span></li>
               <li><img :src="callLog_1" alt="通话记录"></li>
               <li><Icon type="ios-square" class="liIcon"/><span>通话录音播放：选择某条通话记录后点击“在线播放”按钮，平台弹出播放器提供在线播放功能。</span></li>
               <li><img :src="callLog_2" alt="通话录音播放"></li>
               <li><Icon type="ios-square" class="liIcon"/><span>查看备案信息：选择某条通话记录后点击“查看”，弹出公证录音存证证明页供浏览。</span></li>
               <li><img :src="callLog_3" alt="备案信息"></li>
               <li><Icon type="ios-square" class="liIcon"/><span>删除录音：提供了单条通话记录删除和批量删除两种方式，通话记录删除后不能恢复。</span></li>
               <li><img :src="callLog_4" alt="删除录音"></li>
               <li><img :src="callLog_5" alt="批量删除录音"></li>
               <li><Icon type="ios-square" class="liIcon"/><span>申请公证：选择某条通话记录后点击“申请公证”并在窗口中填写相应的信息即可完成通话记录的公证预约申请。</span></li>
               <li><img :src="notary_1" alt="公证申请"></li>
               <li><Icon type="ios-square" class="liIcon"/><span>下载：选择某条通话记录后点击“下载”或选择多条记录点击“批量下载”。</span></li>
               <li><img :src="download" alt="下载"></li>
               <li>批量下载功能即将上线！</li>
		  	   </ul>
            <h2>数据统计</h2>
		  	    <ul>
	             <li><Icon type="ios-square" class="liIcon"/><span>查看通话统计：本模块提供当前用户管理的录音号码的统计数据查看，包含呼入呼出时长、电话个数、平均通话时长、总通话时长等，最多可查询90天的通话统计数据。</span></li>
               <li><img :src="data_1" alt="通话统计"></li>
               <li><Icon type="ios-square" class="liIcon"/><span>导出到Excel：点击“导出Excel”按钮后可将统计结果导出到本地的Excel保存。</span></li>
               <li><img :src="data_2" alt="导出到Excel"></li>
		  	   </ul>
           <h2>组织维护</h2>
		  	    <ul>
	            <li><Icon type="ios-square" class="liIcon"/><span>部门管理：本模块提供组织（部门）维护的功能，包含创建或删除组织、修改组织名称等功能。</span></li>
                  <li><Icon type="ios-star-outline" size="14" class="liIcon" /><span>创建部门：点击“添加新部门”按钮并在弹出窗口输入部门名称后创建部门成功。</span></li>
                  <li><img :src="dept_1" alt="创建部门"></li>
                  <li><Icon type="ios-star-outline" size="14" class="liIcon" /><span>创建子部门：选择部门后在该部门对应的操作栏中点击“创建子部门”按钮，在弹出窗口中输入子部门名称后创建子部门成功。</span></li>
                  <li><img :src="dept_2" alt="创建子部门"></li>
                  <li><Icon type="ios-star-outline" size="14" class="liIcon" /><span>删除部门：选择部门后在该部门对应的操作栏中点击“删除”按钮，在弹出窗口点击“确定”按钮后可删除成功。</span></li>
                  <li><img :src="dept_3" alt="删除部门"></li>
                  <li><Icon type="ios-star-outline" size="14" class="liIcon" /><span>修改部门名称：选择部门后在该部门对应的操作栏中点击“编辑”按钮，在弹出窗口中输入要修改的部门名称后修改成功。</span></li>
                  <li><img :src="dept_4" alt="修改部门名称"></li>

              <li><Icon type="ios-square" class="liIcon"/><span>成员管理：本模块提供维护当前组织内的人员的功能。</span></li>
                  <li><Icon type="ios-star-outline" size="14" class="liIcon" /><span>添加新成员：本模块中增加的新的成员后，被添加的成员即可使用对应的用户名和密码登录平台，并直接被拉入对应的部门内，成员可查询该部门所有通话记录以及数据统计信息。</span></li>
                  <li><img :src="member_1" alt="添加新成员"></li>
                  <li><Icon type="ios-star-outline" size="14" class="liIcon" /><span>删除成员：提供单独删除和批量删除成员的两种方式。</span></li>
                  <li><img :src="member_2" alt="删除成员"></li>
                  <li><img :src="member_3" alt="批量删除成员"></li>
                  <li><Icon type="ios-star-outline" size="14" class="liIcon" /><span>转移成员：选择成员后点击“转移到”按钮在弹出窗口中选择新的部门即可将该成员转移至新部门。</span></li>
                  <li><img :src="member_4" alt="转移成员"></li>
                  <li><Icon type="ios-star-outline" size="14" class="liIcon" /><span>修改名称：选择成员后点击“修改名称”按钮在弹出窗口中修改名称完成该成员的名称更换。</span></li>
                  <li><img :src="member_5" alt="修改名称"></li>

              <li><Icon type="ios-square" class="liIcon"/><span>号码管理：本模块提供当前部门号码管理的功能，包含修改号码别名，更换号码所属部门的功能。</span></li>
                  <li><Icon type="ios-star-outline" size="14" class="liIcon" /><span>修改号码名称：选择号码后点击“修改名称”按钮在弹出窗口中填写别名即可。</span></li>
                  <li><img :src="number_3" alt="添加新成员"></li>
                  <li><Icon type="ios-star-outline" size="14" class="liIcon" /><span>移动号码：提供单个号码转移部门和号码批量转移部门的功能。选中号码后点击“移动到”在弹出窗口中选择部门即可更换部门。</span></li>
                  <li><img :src="number_1" alt="单个号码转移部门"></li>
                  <li><img :src="number_2" alt="号码批量转移部门"></li>
		  	   </ul>
            <h2>用户中心</h2>
		  	    <ul>
	             <li><Icon type="ios-square" class="liIcon"/><span>个人设置：本模块提供更换当前密码的功能，需输入原始密码并输入两次新密码通过验证后生效。</span></li>
               <li><img :src="update_pass" alt="个人设置"></li>
               <li><Icon type="ios-square" class="liIcon"/><span>黑名单：本模块提供黑名单维护的功能，添加到黑名单的号码与录音号码通话记录不进行存证。</span></li>
                  <li><Icon type="ios-star-outline" size="14" class="liIcon" /><span>添加黑名单：点击“添加黑名单”按钮后，在弹出窗口中录入电话号码与备注信息并点击确定。</span></li>
                  <li><img :src="black_1" alt="添加黑名单"></li>
                  <li><Icon type="ios-star-outline" size="14" class="liIcon" /><span>删除黑名单：</span></li>
                  <li><img :src="black_2" alt="删除黑名单"></li>
               <li><Icon type="ios-square" class="liIcon"/><span>日志查询：查看系统操作日志，日志包含用户登入、登出、删除数据等</span></li>
               <li><img :src="log" alt="日志查询"></li>
		  	   </ul>
		  	   </ul>
            <h2>公证申请查询</h2>

            <ul>
              <li><Icon type="ios-square" class="liIcon"/><span>本模块提供已申请的通话记录查询出证情况的功能，可通过公证状态进行筛选。</span></li>
              <li><img :src="notary_2" alt="公证申请查询"></li>
              </ul>
		  </div>
    </div>
</template>
<script>
import login from '@/assets/images/helpImg/login.png';
import ypLogin from '@/assets/images/helpImg/ypLogin1.png';
import register1 from '@/assets/images/helpImg/register1.png';
import register2 from '@/assets/images/helpImg/register2.png';
import back_pass_1 from '@/assets/images/helpImg/back_pass_1.png';
import back_pass_2 from '@/assets/images/helpImg/back_pass_2.png';
import back_pass_3 from '@/assets/images/helpImg/back_pass_3.png';
import callLog_1 from '@/assets/images/helpImg/callLog_1.png';
import callLog_2 from '@/assets/images/helpImg/callLog_2.png';
import callLog_3 from '@/assets/images/helpImg/callLog_3.png';
import callLog_4 from '@/assets/images/helpImg/callLog_4.png';
import callLog_5 from '@/assets/images/helpImg/callLog_5.png';
import download from '@/assets/images/helpImg/download.png';
import notary_1 from '@/assets/images/helpImg/notary_1.png';
import notary_2 from '@/assets/images/helpImg/notary_2.png';
import data_1 from '@/assets/images/helpImg/data_1.png';
import data_2 from '@/assets/images/helpImg/data_2.png';
import dept_1 from '@/assets/images/helpImg/dept_1.png';
import dept_2 from '@/assets/images/helpImg/dept_2.png';
import dept_3 from '@/assets/images/helpImg/dept_3.png';
import dept_4 from '@/assets/images/helpImg/dept_4.png';
import member_1 from '@/assets/images/helpImg/member_1.png';
import member_2 from '@/assets/images/helpImg/member_2.png';
import member_3 from '@/assets/images/helpImg/member_3.png';
import member_4 from '@/assets/images/helpImg/member_4.png';
import member_5 from '@/assets/images/helpImg/member_5.png';
import number_1 from '@/assets/images/helpImg/number_1.png';
import number_2 from '@/assets/images/helpImg/number_2.png';
import number_3 from '@/assets/images/helpImg/number_3.png';
import update_pass from '@/assets/images/helpImg/update_pass.png';
import black_1 from '@/assets/images/helpImg/black_1.png';
import black_2 from '@/assets/images/helpImg/black_2.png';
import log from '@/assets/images/helpImg/log.png';
export default {
     data(){
        return{
          login,
          ypLogin,
          register1,
          register2,
          back_pass_1,
          back_pass_2,
          back_pass_3,
          data_1,
          data_2,
          callLog_1,
          callLog_2,
          callLog_3,
          callLog_4,
          callLog_5,
          download,
          notary_1,
          notary_2,
          dept_1,
          dept_2,
          dept_3,
          dept_4,
          member_1,
          member_2,
          member_3,
          member_4,
          member_5,
          number_1,
          number_2,
          number_3,
          update_pass,
          black_1,
          black_2,
          log
        }
     }
}
</script>
