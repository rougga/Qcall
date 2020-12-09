/**
 *员工信息、评价页 
 * 
 */
 var ticketId = "";//当前办理的票号,从cookie中获取
 var clocker;
 var eval_wait_time = 5;//评价等待时间，单位秒
 var eval_val = -1;//评介结果，默认好评
 var ct;
 
 var double_screen;
/**
 * 初始化页面
 */
 function init(){
 	double_screen = $('#double_screen')[0];//加载控件
    $.cookie("eval_val",null,{expires:1});//清空评价数据
 	//为评价按钮注册事件
 	$('.eval_btn > a').bind('click',function(){
 		setEval($(this).attr('eval'));
 		showThanks();
 		return false;
 	});
 }
 
 /**
  * 提交评价数据
  * @param  ticketId 票号id
  * @param  evalId	评价id
  */
 function setEval(evalId){
 	ct = undefined;
 	$('#cutdown').text(eval_wait_time);
 	clearInterval(clocker);
	$.cookie("eval_val",evalId,{expires:1});
	try{
		double_screen.PingJia();
	}catch(e){}
 }

/**
 * 评价倒计时
 */
function cutdown(){
	if(ct == undefined){
		ct = eval_wait_time;
	}
	ct--;
	if(ct == 0){
		setEval(eval_val);
		ct = undefined;
		$('#cutdown').text(eval_wait_time);
		clearInterval(clocker);
        showInfo();
	}
	$('#cutdown').text(ct);
}

//显示评价按钮
function showEval(){
	//释放鼠标 dsc.unLockMouse();
    show_sta = 'eval';
    clocker = setInterval(cutdown, 1000);
}

//显示感谢信息
function showThanks(){
    $('div[id$="_sdiv"]').hide();
	$('#eval_thanks_sdiv').show();
	setTimeout(showInfo,3000);
	//锁定鼠标 dsc.lockMouse();
}
