var timeoutSec = 6;
var call_btn;
var reCall_btn;
var abandonCall_btn;
var specialCall_btn;
var seccall_btn;
var suspend_btn;
var continue_btn;
var doubleScreen_btn;
var singleScreen_btn;
var screenShot_btn;
var start_btn;
var finish_btn;
var abandon_btn;
var transfer_btn;
var return_btn;
var machineAccount_btn;
var buluMachineAccount_btn;
var luruGZL_btn;
var luruGZL_tag = 0;
var op_tag;
var process_btn = '';
var screen_tag;
var auto_call_tag = false;
var call_sta = 1;
var reCall_sta = 2;
var abandonCall_sta = 3;
var specialCall_sta = 4;
var suspend_sta = 5;
var continued_sta = 6;
var doubleScreen_sta = 7;
var singleScreen_sta = 8;
var screenShot_sta = 9;
var start_sta = 10;
var finish_sta = 11;
var abandon_sta = 12;
var default_sta = 13;
var seccall_sta = 14;

var ticketId = "";// 当前票号
var userInfoWindow;// 员工信息窗口
var loginUrl = "";// 坐席登录地址
var basePath = "";
var scrollTick;
var freshBizTick;

// 系统参数
var evalType = "";// 评价器类型
var autoCallTime = 10000;// 自动呼叫等待时间
var autoDeal = 0;
var fvts_client_tag;
var call_wait_time = 0;//呼叫后等待时间

// 窗口参数
var enableEval = 1;// 是否启动评价器
var record_items = 0;// 完成后录入工作量

// 双屏评价窗口
var screenEvalWin;

var userId;

// 窗口是否已经关闭
window.isExit = false;

// 评价定时器
var eval_inter;

var double_screen_obj;

var dealTimeWarn = 0;

//系统错误提示
var sys_error = $.i18n.prop('server.system.fail');

//暂停子选项,为1时,坐席暂停要选择子项,为0时直接暂停
var pauseSubItem = "0";

var autoCall_Timer;

var flag;

//大厅ID
var branchId;

//微信票状态
var wxTag = 0;

var refresh_biz_delay = 5000;//定时刷新票号间隔时间

/**
 * 初始化坐席主页面
 */
function init() {
    initButton();// 初始化按钮
    bindEvent2Button();// 绑定事件

    // 设置操作按钮的初始状态
    op_tag = default_sta;
    setButton();

    if (evalType == 'SCREEN') {
        double_screen_obj = $("#double_screen")[0];
        // 设置双屏按钮的初始状态
        screen_tag = doubleScreen_sta;
        setScreenButton();
    }
    // showUserInfo();

    if (fvts_client_tag == "app") {
        $('#menu_out').hide();
    }

    // 定时刷新业务refreshBiz
    reFreshBiz(windowId, userId, 0);
    flag = 0;
    freshBizTick = setInterval("reFreshBiz(windowId,userId,flag)", refresh_biz_delay);

    // 设置评价器星级
    //var evalObj = getEvaluation("evalFac");
    //修改成从后台获取设置的评价器
    var evalObj = getEvaluationByToolFac(eval_tool_fac);
    if (evalObj != null) {
        evalObj.setStars(5);
    }
    recoverTkt();

    $.cookie("eval_val", null);

    // 计时
    setInterval("timerTick()", 1000);
}

/**
 * 恢复异常状态的票号
 */
function recoverTkt() {
    var r = $.cookie("fvts_seat_ticket");
    var t_status = "";
    if (r != null) {
        r = JSON.parse(r);
        if (r.ticket_id == undefined || r.ticket_id == "") {
            return;
        } else {
            var lastDate = $.cookie('last_tickedate');
            if (lastDate == new Date().getDate()) {//如果是当天的票号则提示继续完成
                alert($.i18n.prop('server.last.time.error'));
                var data = {'tid': r.tid};
                $.ajax({
                    url    : basePath + 'client/seat/recoverTicket',
                    type   : 'post',
                    data   : data,
                    success: function (result) {
                        t_status = result.status;
                        if (t_status == "1") {
                            op_tag = call_sta;
                            setButton();
                        } else if (t_status == "3") {
                            op_tag = start_sta;
                            setButton();
                        }
                    }
                });
            } else {
                return;
            }
        }
        saveTicket2Cookie(r);
        $('#current_ticket').text(r.ticket_id);
        var autoTrans = "";
        if (r.AUTO_TRANS != undefined && r.biz_type_id != r.AUTO_TRANS) {
            autoTrans = ","+$.i18n.prop('server.automatic.transfer');
        }
        setTicketStateBar(r.ticket_id + "," + r.biz_name + "," + r.type_name
            + autoTrans);
    }
}

/**
 * 双屏显示人员信息
 */
function showUserInfo() {
    if (evalType == 'SCREEN') {
        var url = basePath + "client/seat/userInfo?rand=" + Math.random()
            + "&userId=" + userId;
        try {
            var r = double_screen_obj.ExternOpenUrl(url);
            // 设置双屏按钮的初始状态
            screen_tag = doubleScreen_sta;
            setScreenButton();
        } catch (e) {
        }
    }
}

/**
 * 呼叫
 * @param tid
 *            业务类型id，自选呼叫时用
 */
function call(tid) {
    //呼叫时清除自动呼叫的定时器
    if (autoCall_Timer != null) {
        clearTimeout(autoCall_Timer);
    }
    //正在呼叫中或窗口处于暂停状态时不能呼叫
    //if(isLockProcess(call_sta)  || (tid == 'auto' && $("#pause_icon").is(":hidden") == false)){
    if (isLockProcess(call_sta) || (tid == 'auto' && $("#pause_icon").is(":hidden") == false)) {
        setTicketStateBar($.i18n.prop('server.call.fail'));
        return;
    } else {
        lockProcess(call_sta);
    }

    if (op_tag == 1 || op_tag == 10) {
        if (tid != 'auto') {//自动呼叫时不提示
            alert($.i18n.prop('server.call.next.banks.error'));
        } else {
            //alert("自动呼叫");
        }
        return;
    }

    if (tid == 'auto') {
        tid = null;
    }

    var pars = {};
    if (tid != undefined && tid != "" && (tid instanceof Object) == false) {
        pars['bizid'] = tid;
    }
    $.ajax({
        url     : basePath + 'client/seat/call',
        type    : 'post',
        data    : pars,
        success : function (r) {
            if (r.error != undefined && r.error != '') {
                setTicketStateBar(r.error);
            } else {
                dealTimeWarn = 0;
                if (r.dealTimeWarn) {
                    dealTimeWarn = r.dealTimeWarn * 60;// 办理时长预警
                }
                t_clock('start');// 计时
                op_tag = call_sta;
                setButton();
                saveTicket2Cookie(r);
                $('#current_ticket').text(r.ticket_id);
                var autoTrans = "";
                if (r.auto_trans && r.biz_type_id != r.auto_trans) {
                    autoTrans = ","+$.i18n.prop('server.automatic.transfer');
                }
                setTransferedTag('N');
                setTicketStateBar(r.ticket_id + "," + r.biz_name + ","
                    + r.type_name + autoTrans);
                setNsrStateBar(r.id_card_name, r.id_card_info_id)
                // 自动开始办理
                if (autoDeal == 1) {
                    deal();
                }
                //呼叫中状态，双屏根据此标志进行切换
                openDscreenCall(r.ticket_id);

                //如果当前设置了自动呼叫则弹出呼叫提醒
                if (auto_call_tag) {
                    var MSG1 = new CLASS_MSN_MESSAGE("autoCall", 300, 160, "",
                        $.i18n.prop('server.auto.call.reminder'), $.i18n.prop('server.enable.automatic.call')+"<span style='color: red'>" + r.ticket_id + "</span>", "_blank");
                    MSG1.show();
                }
            }
        },
        error   : function () {
            setTicketStateBar(sys_error);
        },
        complete: function () {
            unlockProcess();
        }
    });
}


/**
 * 显示票号纳税人消息页面
 * @param tid
 */
function showNsrMessage(tid) {
    var msgUrl = basePath + "client/seat/queryNsrMsgs?ticketId=" + tid + "&rand=" + Math.random();
    showModDialog(msgUrl, 600, 380);
}


/**
 * 查询纳税人是否为CA认证用户
 *
 * @param {}
 *            sbh 纳税人识别号
 */
function queryIsCa(sbh) {
    var url = 'client/ticket/isCaUser?rand=' + Math.random();
    var par = {};
    par.nsrsbh = sbh;
    $.getJSON(url, par, function (d) {
        if (d != undefined && d.isCaUser) {
            var str = $('#nsr_state_bar marquee').text();
            $('#nsr_state_bar marquee').text($.i18n.prop('server.CA.auth.user')+"," + str);
        }
    });
}

/**
 * 追呼
 */
function reCall() {
    op_tag = reCall_sta;
    var tid = getTidFromCookie();
    if (!tid) {
        return;
    }
    var url = basePath + 'client/seat/reCall?id='
        + tid + "&rand=" + Math.random();
    $.get(url, function (r) {
        if (r.error != undefined && r.error != '') {
            setTicketStateBar(r.error);
        } else {
            //呼叫中状态，双屏根据此标志进行切换
            openDscreenCall($.cookie('fvts_seat_ticketId'));
        }
    });
}

/**
 * 弃号重呼
 */
function abandonCall() {
    op_tag = abandon_sta;
    var url = basePath + "client/seat/abandonCall?action=load&rand="
        + Math.random();
    var ti = showModDialog(url, 600, 420);
    if (ti != undefined) {
        var str = ti.split("_");
        url = "client/seat/abandonCall?action=do&rand=" + Math.random();
        var par = {};
        par.id = str[0];
        par.tBizTypeId = str[1];
        $.get(url, par, function (r) {
            if (r.error != undefined && r.error != '') {
                setTicketStateBar(r.error);
                $.cookie("fvts_seat_ticket", null);
            } else {
                dealTimeWarn = 0;
                if (r.dealTimeWarn) {
                    dealTimeWarn = r.dealTimeWarn * 60;// 办理时长预警
                }
                setTransferedTag('N');
                t_clock('start');// 计时
                op_tag = call_sta;
                setButton();
                saveTicket2Cookie(r);
                $('#current_ticket').text(r.ticketId);
                setTicketStateBar(r.ticket_id + "," + r.biz_name + ","
                    + r.type_name);
                // 自动开始办理
                if (autoDeal == 1) {
                    deal();
                }
                openDscreenCall(r.ticketId);
            }
        });
    }
}

/**
 * 特定呼号
 */
function specialCall() {
    op_tag = specialCall_sta;
    var url = basePath + "client/seat/specialCall?action=load&rand="
        + Math.random();
    var ti = showModDialog(url, 550, 420);
    if (ti != undefined) {
        url = "client/seat/specialCall?action=do&rand=" + Math.random();
        var par = {};
        par.tid = ti;
        $.get(url, par, function (r) {
            if (r.error != undefined && r.error != '') {
                setTicketStateBar(r.error);
            } else {
                dealTimeWarn = 0;
                if (r.dealTimeWarn) {
                    dealTimeWarn = r.dealTimeWarn * 60;// 办理时长预警
                }
                t_clock('start');// 计时
                op_tag = call_sta;
                setButton();
                saveTicket2Cookie(r);
                $('#current_ticket').text(r.ticket_id);
                setTicketStateBar(r.ticket_id + "," + r.biz_name + ","
                    + r.type_name);
                // 自动开始办理
                if (autoDeal == 1) {
                    deal();
                }
                openDscreenCall(r.ticket_id);
            }
        });
    }
}

/**
 * 二次呼叫
 */
function seccall() {
    op_tag = seccall_sta;
    var url = basePath + "client/seat/seccall?action=load&rand="
        + Math.random();
    var ti = showModDialog(url, 400, 160);
    if (ti != undefined) {
        url = "client/seat/seccall?action=do&rand=" + Math.random();
        var par = {};
        par.tid = ti;
        $.get(url, par, function (r) {
            if (r.error != undefined && r.error != '') {
                setTicketStateBar(r.error);
            } else {
                setTicketStateBar($.i18n.prop('server.second.call.success'))
                $.cookie('fvts_seat_tid', ti);// 将票号主键保存在cookie
                setButton();
            }
        });
    }
}

/**
 * 票号转移
 *
 * @param needFin
 *            转移后是否需要完成 转移流程： 1.手动转移：先转移再完成票号 2.自动转移：先完成票号再进行转移
 */
function transfer(tag, needFin) {
    var seccallTran = false;
    needFin = (!needFin?true:needFin);
    if (op_tag == seccall_sta) {
        seccallTran = true;
        needFin = false;
    }
    var bizid;
    op_tag = specialCall_sta;
    var url = basePath + "client/seat/transfer?bizid="
        + $.cookie('fvts_seat_bizType') + "&rand=" + Math.random();
    if (tag != undefined && (tag.type == "bizTrans" || tag.type == "winTrans")) {
        bizid = tag;
    } else {
        bizid = showModDialog(url, 450, 380);
    }
    if (bizid != undefined) {
        var par = {};
        if (bizid.type == "bizTrans") {// 业务转移
            url = basePath + "client/seat/transfer?action=bizTrans&rand="
                + Math.random();
            par.tId = getTidFromCookie();
            par.bizId = bizid.id;
            par.priority = bizid.priority;
        } else if (bizid.type == "winTrans") {// 窗口转移
            url = basePath + "client/seat/transfer?action=winTrans&rand="
                + Math.random();
            par.tId = getTidFromCookie();
            par.winId = bizid.id;
            par.priority = bizid.priority;
        }
        $.getJSON(url, par, function (r) {
            t_clock('stop');// 计时
            if (r.error == undefined || r.error == "") {
                setTransferedTag('Y');
                if (needFin != false) {
                    finish();
                }
                /*
                 * op_tag = finish_sta; setButton(); autoCall();
                 */
                if (seccallTran) {
                    op_tag = default_sta;
                    setButton();
                }
            } else {
                setTicketStateBar(r.error);
            }
        });
    }
}

/**
 * 中断办理
 */
function suspend() {
    var tid = getTidFromCookie();
    var url = 'tid=' + tid;
    if (isLockProcess(suspend_sta)) {
        return;
    } else {
        lockProcess(suspend_sta);
    }

    $.ajax({
        url    : basePath + "client/seat/suspend",
        type   : 'post',
        data   : url,
        success: function (r) {
            unlockProcess();
            if (r.error != undefined && r.error != '') {
                setTicketStateBar(r.error);

            } else {
                t_clock('stop');// 计时
                op_tag = suspend_sta;
                setButton();
                autoCall();
                showUserInfo();
            }
        },
        error  : function () {
            unlockProcess();
            setTicketStateBar(sys_error);
        }
    });
}

/**
 * 继续办理
 */
function continued() {
    op_tag = continued_sta;
    setButton();
    var url = basePath + "client/seat/suspendCall?action=load&rand="
        + Math.random();
    var ti = showModDialog(url, 550, 420);
    if (ti != undefined) {
        var str = ti.split("_");
        url = "client/seat/suspendCall?action=do&rand=" + Math.random();
        var par = {};
        par.id = str[0];
        par.tBizTypeId = str[1];
        $.get(url, par, function (r) {
            if (r.error != undefined && r.error != '') {
                setTicketStateBar(r.error);

            } else {
                dealTimeWarn = 0;
                if (r.dealTimeWarn) {
                    dealTimeWarn = r.dealTimeWarn * 60;// 办理时长预警
                }
                setTransferedTag('N');
                t_clock('start');// 计时
                op_tag = call_sta;
                setButton();
                saveTicket2Cookie(r);
                $('#current_ticket').text(r.ticket_id);
                setTicketStateBar(r.ticket_id + "," + r.biz_name + ","
                    + r.type_name);
                // 自动开始办理
                if (autoDeal == 1) {
                    deal();
                }
            }
        });
    }
}

/**
 * 双屏
 */
function doubleScreen() {
    // dsc.doubleScr();
    try {
        double_screen_obj.DualScreen();
    } catch (e) {
    }
    screen_tag = doubleScreen_sta;
    setScreenButton();
}

/**
 * 单屏
 */
function singleScreen() {
    // dsc.singleScr();
    try {
        double_screen_obj.SingleScreen();
    } catch (e) {
    }
    screen_tag = singleScreen_sta;
    setScreenButton();
}

/**
 * 截屏
 */
function screenShot() {
    // dsc.shortcutScr();
    try {
        double_screen_obj.CutScreen();
    } catch (e) {
    }
    screen_tag = screenShot_sta;
    setScreenButton();
}

function doRefuseDeal() {
    //alert("doRefuseDeal");
    var tid = getTidFromCookie();
    var url = 'tid=' + tid;

    $.ajax({
        url    : basePath + "client/seat/refuseDeal",
        type   : 'post',
        data   : url,
        success: function (t) {
            if (t) {
                abandon();
            }
        }
    });
}

/**
 * 开始办理
 */
function deal() {
    doStartCall();
    /*
    var tid = getTidFromCookie();
    var url = 'tid=' + tid;
    $.ajax({
        url: basePath + "client/seat/dealCheck",
        type: 'post',
        data: url,
        success: function (t) {
            //身份证ID
            if (t != null) {
                var idCardId = t.id;
                if (idCardId != null && idCardId != "") {
                        var modelUrl = basePath + "client/seat/showIdCardInfo?idCardId=" + idCardId + "&tid="+tid+"&action=load&rand=" + Math.random();

                        var result = showModDialog(modelUrl, 850, 520);
                        if (result == '1') {//正常办理
                            doStartCall();
                        } else if (result == "0") {
                            doRefuseDeal();
                        }
                } else { //如果不关联身份证
                    doStartCall();
                }
            }

        }
    });
*/
}

function doStartCall() {
    var tid = getTidFromCookie();
    var url = 'tid=' + tid;
    if(!tid ){
        return;
    }
    if (isLockProcess(start_sta)) {
        return;
    } else {
        lockProcess(start_sta);
    }

    //微信票标记
    wxTag = 0;

    $.ajax({
        url    : basePath + "client/seat/deal",
        type   : 'post',
        //async:false,
        data   : url,
        success: function (r) {
            unlockProcess();
            if (r.error != undefined && r.error != '') {
                setTicketStateBar(r.error);
            } else {
                wxTag = r.wxTag;
                op_tag = start_sta;
                setButton();
                playWelcome();
            }
        },
        error  : function () {
            unlockProcess();
            setTicketStateBar(sys_error);
        }
    });
}

/**
 * 完成,1.评价.2.选择业务细项,保存结果.3.修改票号状态和保存评价结果
 */
function finish() {
    var tid = getTidFromCookie();
    if (!tid) {
        return;
    }
    // 评价
    if (record_items == '1' && machineAccount_tag != "1" && luruGZL_tag != "1") {// 完成后录入工作量且不启用台帐
        evaluation(setBizItemCount);
    } else {
        evaluation(finishAction);
    }
}

/**
 * 评价
 *
 * @param tid
 *            票号
 * @param func
 *            评价完要处理的函数
 */
function evaluation(func) {
    var evalRet = -1;
    // 评价 且 该票不是通过微信取票
    if (enableEval == 1 && wxTag != 1) {
        if (evalType == "BUTTON") { // 按钮
            // 从cookies读取评价器厂商evalFac
            //var obj = getEvaluation('evalFac');
            //修改成从后台获取设置的评价器
            var obj = getEvaluationByToolFac(eval_tool_fac);
            if (obj == null) {
                func(-1);
            } else {
                obj.receive(timeoutSec, func);
            }
        } else if (evalType == "SCREEN") { // 双屏
            $(document).mask($.i18n.prop('server.waiting.evaluation'));
            try {
                palyEval();
                // screenEvalWin.startEval(func);
                startReadEval(func);
            } catch (e) {
                alert(e.message);
                // func(-1);
            }
        } else {
            func(-1);
        }
    } else {// 不启用评价
        func(-1);
    }
}

/**
 * 选择业务细项（录入工作量）
 *
 * @param tid
 * @param evalRet
 */
function setBizItemCount(evalRet) {
    var tkid = getTidFromCookie();
    // 选择业务细项
    var urlshow = basePath + 'client/seat/finishBiz?action=show&tid=' + tkid
        + "&rand=" + Math.random();
    var msg = showModDialog(urlshow, 900, 460);
    if ("success" == msg) {
        finishAction(evalRet);
    } else if ("none" == msg) {
        if (confirm($.i18n.prop('server.effort.fail'))) {
            finishAction(evalRet);
        } else {
            $(document).unmask();
        }
    } else {
        $(document).unmask();
    }
}

function finishAction(evalRet) {
    var tid = getTidFromCookie();
    if(!tid ){
        return;
    }
    var url = 'client/seat/finish?tid=' + tid + "&evalRet=" + evalRet
        + "&rand=" + Math.random();
    $.get(url, function (r) {
        if (r.error != undefined && r.error != '') {
            setTicketStateBar(r.error);
        } else {
            unlockProcess();
            t_clock('stop');// 计时
            op_tag = finish_sta;
            setButton();
            autoCall();
            trans();// 自动转移
        }
    });
    $(document).unmask();
    palyThanks();
}

function trans() {
    var transfered = getTransferedTag();
    if (transfered == 'Y') {
        // 已经转移过，不需要再进行自动转移，避免出现死循环
        return;
    }
    var autotrans = getAutotransFromCookie();
    if (autotrans != undefined && autotrans != '') {
        var url = "client/seat/getBizInfo?bizId=" + autotrans + "&rand="
            + Math.random();
        $.get(url, function (r) {
            if (r.name != undefined) {
                var result=true;
                if(showTransferConfirm && showTransferConfirm == "yes"){
                    result = confirm($.i18n.prop('server.auto.transferred.business') + '【' + r.name + '】？');
                }
                if (result) {
                    var priority = false;//confirm($.i18n.prop('server.banks.priority'));
                    var biz = {};
                    biz.type = "bizTrans";
                    biz.id = autotrans;
                    biz.priority = priority;
                    transfer(biz, false);// 自动转移的业务不再需要进行完成操作
                }
            }
        });
    }
}

/**
 * 弃号
 */
function abandon() {
    //alert(111);
    var tid = getTidFromCookie();
    if(!tid ){
        return;
    }
    var url = 'tid=' + tid;
    if (isLockProcess(abandon_sta)) {
        return;
    } else {
        lockProcess(abandon_sta);
    }
    $.ajax({
        url    : basePath + "client/seat/abandon",
        type   : "post",
        data   : url,
        success: function (r) {
            unlockProcess();
            t_clock('stop');// 计时
            if (r.error != undefined && r.error != '') {
                setTicketStateBar(r.error);
            } else {
                op_tag = abandon_sta;
                setButton();
                autoCall();
                showUserInfo();
            }
        },
        error  : function () {
            unlockProcess();
            setTicketStateBar(sys_error);
        }
    });
}

/**
 * 初始化操作按钮
 */
function initButton() {
    call_btn = $('#call_btn');
    reCall_btn = $('#reCall_btn');
    abandonCall_btn = $('#abandonCall_btn');
    specialCall_btn = $('#specialCall_btn');
    seccall_btn = $('#seccall_btn');
    suspend_btn = $('#suspend_btn');
    continue_btn = $('#continue_btn');
    doubleScreen_btn = $('#doubleScreen_btn');
    singleScreen_btn = $('#singleScreen_btn');
    screenShot_btn = $('#screenShot_btn');
    start_btn = $('#start_btn');
    finish_btn = $('#finish_btn');
    abandon_btn = $('#abandon_btn');
    transfer_btn = $('#transfer_btn');
    return_btn = $('#return_btn');
    machineAccount_btn = $("#to_machineAccount");
    buluMachineAccount_btn = $("#bulu_machineAccount");
    //录入与纳税人相关的工作量按钮
    luruGZL_btn = $("#luruGZL");
}

/**
 * 给按钮绑定事件
 */
function bindEvent2Button() {
    call_btn.bind('click', call);
    reCall_btn.bind('click', reCall);
    abandonCall_btn.bind('click', abandonCall);
    specialCall_btn.bind('click', specialCall);
    seccall_btn.bind('click', seccall);
    suspend_btn.bind('click', suspend);
    continue_btn.bind('click', continued);
    doubleScreen_btn.bind('click', doubleScreen);
    singleScreen_btn.bind('click', singleScreen);
    screenShot_btn.bind('click', screenShot);
    start_btn.bind('click', deal);
    finish_btn.bind('click', finish);
    transfer_btn.bind('click', transfer);
    abandon_btn.bind('click', abandon);
    return_btn.bind('click', returnCallSta);
    $('#enabel_auto_call').bind('click', setAutoCallTag);
    machineAccount_btn.bind('click', toMachineAccount);
    buluMachineAccount_btn.bind('click', buluMachineAccount);
    luruGZL_btn.bind('click', lurugongzuoliang);
}

/**
 * 设置按钮的显示状态
 */
function setButton() {
    //取消批量处理复选
    $("#batch_handle").removeAttr("checked");
    switch (op_tag) {
        case call_sta :
            call_btn.hide();
            seccall_btn.hide();
            abandonCall_btn.hide();
            specialCall_btn.hide();
            suspend_btn.hide();
            continue_btn.hide();
            reCall_btn.show();
            start_btn.show();
            finish_btn.hide();
            transfer_btn.hide();
            abandon_btn.show();
            return_btn.hide();
            //录入工作量(台帐)
            machineAccount_btn.hide();
            //录入与纳税人相关的工作量
            luruGZL_btn.hide();
            break;
        case suspend_sta :
            call_btn.show();
            seccall_btn.show();
            abandonCall_btn.show();
            specialCall_btn.show();
            suspend_btn.hide();
            continue_btn.show();
            reCall_btn.hide();
            start_btn.hide();
            finish_btn.hide();
            transfer_btn.hide();
            abandon_btn.hide();
            return_btn.hide();
            setTicketStateBar('---');
            $('#current_ticket').text('');
            $.cookie("fvts_seat_ticket", null);
            //录入工作量(台帐)
            machineAccount_btn.hide();
            //录入与纳税人相关的工作量
            luruGZL_btn.hide();
            break;
        case start_sta :
            call_btn.hide();
            seccall_btn.hide();
            abandonCall_btn.hide();
            specialCall_btn.hide();
            transfer_btn.show();
            suspend_btn.show();
            continue_btn.hide();
            reCall_btn.show();
            start_btn.hide();
            finish_btn.show();
            abandon_btn.show();
            return_btn.hide();
            //录入工作量(台帐)
            machineAccount_btn.show();
            //录入与纳税人相关的工作量
            luruGZL_btn.show();
            break;
        case finish_sta :
            call_btn.show();
            seccall_btn.show();
            abandonCall_btn.show();
            specialCall_btn.show();
            suspend_btn.hide();
            continue_btn.show();
            reCall_btn.hide();
            start_btn.hide();
            finish_btn.hide();
            transfer_btn.hide();
            abandon_btn.hide();
            return_btn.hide();
            setTicketStateBar('---');
            $('#current_ticket').text('');
            $.cookie("fvts_seat_ticket", null);
            //录入工作量(台帐)
            machineAccount_btn.hide();
            //录入与纳税人相关的工作量
            luruGZL_btn.hide();
            break;
        case abandon_sta :
            call_btn.show();
            seccall_btn.show();
            abandonCall_btn.show();
            specialCall_btn.show();
            suspend_btn.hide();
            continue_btn.show();
            reCall_btn.hide();
            start_btn.hide();
            finish_btn.hide();
            transfer_btn.hide();
            abandon_btn.hide();
            return_btn.hide();
            setTicketStateBar('---');
            $('#current_ticket').text('');
            $.cookie("fvts_seat_ticket", null);
            //录入工作量(台帐)
            machineAccount_btn.hide();
            //录入与纳税人相关的工作量
            luruGZL_btn.hide();
            break;
        case default_sta :
            call_btn.show();
            seccall_btn.show();
            abandonCall_btn.show();
            specialCall_btn.show();
            suspend_btn.hide();
            continue_btn.show();
            reCall_btn.hide();
            start_btn.hide();
            finish_btn.hide();
            transfer_btn.hide();
            abandon_btn.hide();
            return_btn.hide();
            setTicketStateBar('---');
            $('#current_ticket').text('');
            //录入工作量(台帐)
            machineAccount_btn.hide();
            //录入与纳税人相关的工作量
            luruGZL_btn.hide();
            break;
        case seccall_sta :
            call_btn.hide();
            transfer_btn.show();
            return_btn.show();
            seccall_btn.hide();
            abandonCall_btn.hide();
            specialCall_btn.hide();
            suspend_btn.hide();
            continue_btn.hide();
            reCall_btn.hide();
            start_btn.hide();
            finish_btn.hide();
            abandon_btn.hide();
            //录入工作量(台帐)
            machineAccount_btn.hide();
            break;
        default :
            call_btn.show();
            transfer_btn.hide();
            seccall_btn.show();
            abandonCall_btn.show();
            specialCall_btn.show();
            suspend_btn.hide();
            continue_btn.show();
            reCall_btn.hide();
            start_btn.hide();
            finish_btn.hide();
            abandon_btn.hide();
            return_btn.hide();
            setTicketStateBar('---');
            $('#current_ticket').text('');
        //return;
    }
    if (machineAccount_tag != "1") {
        try {
            machineAccount_btn.hide();
        } catch (e) {
        }
    }
    if (luruGZL_tag != "1") {
        try {
            luruGZL_btn.hide();
        } catch (e) {

        }
    }
}

/**
 * 设置截屏按钮的显示状态
 */
function setScreenButton() {
    switch (screen_tag) {
        case doubleScreen_sta :
            doubleScreen_btn.hide();
            singleScreen_btn.show();
            screenShot_btn.show();
            break;
        case singleScreen_sta :
            doubleScreen_btn.show();
            singleScreen_btn.hide();
            screenShot_btn.show();
            break;
        case screenShot_sta :
            doubleScreen_btn.show();
            singleScreen_btn.hide();
            screenShot_btn.show();
            break;
        default :
            doubleScreen_btn.hide();
            singleScreen_btn.hide();
            screenShot_btn.show();
            return;
    }
}

function showModDialog(url, width, height, model) {
    var top = (screen.height - height) / 2 - 100;
    var left = (screen.width - width) / 2;
    var param = "dialogHeight:" + height + "px;dialogWidth:" + width
        + "px;dialogTop:" + top + "px;dialogLeft:" + left
        + "px;resizable:no;status:no;scroll:no;";
    url+="&lang="+getNowLanguage();
    return window.showModalDialog(url, window, param);
    /*if (model==false) {
     return window.showModelessDialog(url, window, param);
     }else
     {
     }*/
}

/**
 * 坐席显示公告内容
 *
 * @param {}
 *            url
 */
function showNotice(n_id) {
    var url = 'client/seat/showNotice?action=show&noticeId=' + n_id;
    showModDialog(url, 400, 380);
}

/**
 * 票号查询
 */
function queryTicket() {
    var url = basePath + "client/seat/queryTicket?action=load&rand="
        + Math.random();
    showModDialog(url, 720, 420);
}

/**
 * 自选业务呼叫
 */
function setBiz() {
    var url = basePath + "client/seat/setBiz?rand=" + Math.random();
    var tid = showModDialog(url, 400, 300);
    if (tid != undefined && tid != "") {
        call(tid);
    }
}

/**
 * 发布取件信息
 */
function pickNotice() {
    var url = basePath + "client/seat/pickNotice?rand=" + Math.random();
    showModDialog(url, 400, 280);
}

/**
 * 切换为在线
 */
function setOnline() {
    var url;
    if ($("#ticket_state_bar").text() == $.i18n.prop('json.msg.unableCall3') ||
        $("#ticket_state_bar").text() == '---'
    ) {
        url = basePath + "client/online?rand=" + Math.random() + "&status=1"
    } else {
        url = basePath + "client/online?rand=" + Math.random() + "&status=0"
    }
    $.get(url, function (r) {
        if (r.error != '') {
            setTicketStateBar($.i18n.prop('public.operate.fail'));
        }
        togglePaus();
        //在双屏打开人员信息页面
        if (evalType == 'SCREEN') {
            var url = basePath + "client/seat/userInfo?rand=" + Math.random() + "&userId=" + userId;

            try {
                double_screen_obj.ExternOpenUrl(url);
            } catch (e) {
            }
        }
    });
}

/**
 * 切换为暂停
 */
function setStop() {
    if (pauseSubItem == "1") {
        var url = basePath + "client/seat/loginStatus?action=load&rand=" + Math.random();
        var ret = showModDialog(url, 420, 220);
        if (ret) {
            toStop(ret);
        }
    } else {
        toStop();
    }
}

function toStop(type) {
    //$("#stopIcon").find("ul").hide();
    $('#sta_icon').attr('src', icon_src + 'menu02.gif');
    var pauseTime = "0";
    if (type) {
        pauseTime = type;
    }
    var url = basePath + "client/stop?pauseTime=" + pauseTime + "&rand=" + Math.random();
    $.get(url, function (r) {
        if (r.error != '') {
            setTicketStateBar($.i18n.prop('public.operate.fail'));
            return;
        }
        togglePaus(1);
        //在双屏打开暂停页面
        if (evalType == 'SCREEN') {
            var url = basePath + "client/seat/dscreenPause?rand=" + Math.random();
            try {
                double_screen_obj.ExternOpenUrl(url);
            } catch (e) {
            }
        }
    });
}

/**
 * 切换为注销
 */
function setLogoff(status) {
    //退出注销窗口前，销毁定时刷新业务。
    flag = 1;
    clearInterval(freshBizTick);
    var url = "client/logout";
    $.ajax({
        url    : "client/logout",
        type   : "post",
        async  : false,
        data   : {"status": status},
        success: function () {
            window.location.href = loginUrl;
        },
        error  : function () {
            window.location.href = loginUrl;
        }
    });

}

/**
 * 退出
 */
function setLogout() {
    //退出注销窗口前，销毁定时刷新业务。
    flag = 1;
    clearInterval(freshBizTick);
    var url = "client/logout";
    $.ajax({
        url    : "client/logout",
        type   : "post",
        async  : false,
        data   : {"status": status},
        success: function () {
            window.opener = null;
            window.open('', '_self');
            window.close();//关闭模式窗口后,原窗口关闭.
        },
        error  : function () {
            window.opener = null;
            window.open('', '_self');
            window.close();//关闭模式窗口后,原窗口关闭.
        }
    });
}

/**
 * 保存票号主键id到cookie中
 *
 * @param {}
 *            tid
 */
function saveTicket2Cookie(t) {
    // 先清除
    $.cookie('fvts_seat_tid', '');// 将票号主键保存在cookie
    $.cookie('fvts_seat_ticketId', '');// 将票号保存在cookie
    $.cookie('fvts_seat_callLanguage', '');//
    $.cookie('fvts_seat_bizType', '');//
    $.cookie('fvts_seat_autotrans', '');
    $.cookie('fvts_seat_transfered', 'N');
    $.cookie('fvts_seat_nsrdzdah', '');

    // 再保存
    $.cookie('fvts_seat_tid', t.tid);// 将票号主键保存在cookie
    $.cookie('fvts_seat_ticketId', t.ticket_id);// 将票号保存在cookie
    $.cookie('fvts_seat_callLanguage', t.call_language);//
    $.cookie('fvts_seat_bizType', t.biz_type_id);//
    if (t.biz_type_id != t.auto_trans) {
        $.cookie('fvts_seat_autotrans', t.auto_trans);
    }
    $.cookie('last_tickedate', new Date().getDate(), {expires: 0.1});
    // 将呼叫到的票号保存在cookie中，当客户端异常退出时再恢复到原来的状态,0.1为大约2个小时多
    $.cookie("fvts_seat_ticket", JSON.stringify(t), {expires: 0.1});
    $.cookie('fvts_seat_nsrdzdah', t.nsrdzdah);
}

/**
 * 从cookie中读取票号主键id
 *
 * @return {}
 */
function getTidFromCookie() {
    return $.cookie('fvts_seat_tid');// 从cookie取票号id
}

/**
 * 从cookie取自动转移业务
 *
 * @return {}
 */
function getAutotransFromCookie() {
    return $.cookie('fvts_seat_autotrans');// 从cookie取自动转移业务
}

/**
 * 是否已经进行过转移
 */
function setTransferedTag(tag) {
    $.cookie('fvts_seat_transfered', tag);
}

function getTransferedTag() {
    return $.cookie('fvts_seat_transfered');
}

/**
 * 设置票号信息状态栏
 *
 * @param {}
 *            info
 */
function setTicketStateBar(info) {
    $('#ticket_state_bar').text(info);
    if (info == "---") {
        setNsrStateBar("---");
    }
    if ($.i18n.prop('public.operate.fail') == info) {
        $.cookie("fvts_seat_ticket", null);
    }
}

/**
 * 设置纳税人信息状态栏
 *
 * @param {}
 *            info
 */
function setNsrStateBar() {
    if (arguments) {
        var str = "";
        for (var obj in arguments) {
            if (arguments[obj]) {
                str += arguments[obj] + " ";
            }
        }
        $('#nsr_state_bar').html(str);
    }
}

/**
 * 设置坐席操作状态栏
 *
 * @param {}
 *            info
 */
function setSeatStateBar(info) {
    $('#seat_state_bar').text(info);
}

/**
 * 改变自动呼叫标识
 */
function setAutoCallTag() {
    if ($(this).is(':checked')) {
        auto_call_tag = true;
    } else {
        auto_call_tag = false;
    }
}

/**
 * 自动呼叫下一票号
 * immediate=true时立即进行呼叫
 */
function autoCall(immediate) {
    if (autoCall_Timer != null) {
        clearTimeout(autoCall_Timer);
    }
    if (auto_call_tag && $("#pause_icon").is(":hidden") == true) {
        autoCall_Timer = setTimeout("call('auto')", autoCallTime);
    }
}

var biz_length;// 窗口可办业务数
var iswait;// 当前是否有客户等待

/**
 * 定时刷新业务
 */
function reFreshBiz(windowId, userId, flag) {
    var url = basePath + "client/seat/refreshBiz?rand=" + Math.random();
    $.getJSON(url, function (r) {
        var l = $('#biz_list_');
        if (r != undefined) {
            // 可办理业务数量与刷新前的数量不同时提示坐席业务能力被修改
            if (biz_length != undefined && r.length != biz_length) {
                var MSG1 = new CLASS_MSN_MESSAGE("bizChange", 300, 160, "",
                    $.i18n.prop('server.ticket.tip'), $.i18n.prop('server.window.ability'), "_blank");
                MSG1.show();
            }
            biz_length = r.length;
            l.empty();
            var show = false;
            $.each(r, function (i, d) {
                var html = "<li><span style='width:55px;text-align:left;overflow:hidden;' title='" + d.bizname + "'>"
                    + d.bizname
                    + "</span><p style='width:20px;overflow:hidden;' title="+$.i18n.prop('server.now.waiting.number')+">"
                    + (d.waitcount < 0 ? 0 : d.waitcount);

                //下一票号和下一票号等待的时间
                if (d.nextticket) {
                    html = html + "</p><span title="+$.i18n.prop('page.tickettype.next.number')+">"
                        + d.nextticket
                        + "</span>";
                }
                html = html + "</span></li>";

                l.append(html);
                // 等待人数从0变为大于0时提示坐席有用户等待办理
                if (Number(d.waitcount) > 0) {
                    show = true;
                }
            });
            // alert('before:'+iswait);
            if (show && !iswait) {
                iswait = true;
                //当等待人数从0变为大于0时启动自动呼叫
                autoCall();
                var MSG2 = new CLASS_MSN_MESSAGE("isWaiting", 300, 160, "",
                    $.i18n.prop('server.ticket.tip'), $.i18n.prop('server.waiting.business'), "_blank");
                //MSG2.show();
            } else if (!show && iswait) {
                iswait = false;
            }
            // alert('after:'+iswait);
        }
    });

    /*
        if (flag == 0) {
            var checkUrl = basePath + "client/seat/checkBeforeFreshBiz?rand=" + Math.random()
                + "&windowId=" + windowId + "&userId=" + userId;

            $.getJSON(checkUrl, function (r) {
                if (r == 'relogin') {
                    alert("当前窗口登陆时间已超过1天,请重新登录!");
                    setLogoff(0);
                    return;
                } else if (r == 'continue') {} else if (r == 'exit') {
                    alert("当前窗口的用户名为空，将强行退出!");
                    setLogoff(1);
                    return;
                } else {
                    alert(r);
                    setLogoff(1);
                    return;
                }
            });
        }*/
}

/**
 * 返回默认状态
 */
function returnCallSta() {
    op_tag = default_sta;
    setButton();
}

function togglePaus(tag) {
    if (tag == 1) {
        $('#pause_icon').show();
        $('.icon > ul').hide();
        if (autoCall_Timer != null) {
            clearTimeout(autoCall_Timer);
        }
    } else {
        $('#pause_icon').hide();
        $('.icon > ul').show();
    }
}

// 播放欢迎语
function playWelcome() {
    // 评价
    if (enableEval == 1) {
        if (evalType == "BUTTON") { // 按钮
            // 评价器欢迎光临
            //var evalObj = getEvaluation("evalFac");
            //修改成从后台获取设置的评价器
            var evalObj = getEvaluationByToolFac(eval_tool_fac);
            if (evalObj != null) {
                evalObj.welcome();
            }
        } else if (evalType == "SCREEN") { // 双屏
            try {
                document.getElementById('Welcome').controls.play();
            } catch (e) {
            }
        }
    }
}

// 播放评价语
function palyEval() {
    try {
        document.getElementById('Evaluate').controls.play();
    } catch (e) {
        // alert(e.message);
    }
}

// 播放感谢语
function palyThanks() {
    if (enableEval == 1) {
        if (evalType == "SCREEN") {
            try {
                document.getElementById('Thanks').controls.play();
            } catch (e) {
            }
        }
    }
}

// 开始从cookie中读取评价结果
function startReadEval(callback) {
    eval_inter = setInterval(readEval(callback), 1000);
    openDscreenEval();
    try {
        double_screen_obj.Finish();
    } catch (e) {
    }
}

// 停止从cookie中读取评价结果
function stopReadEval() {
    clearInterval(eval_inter);
    $.cookie("eval_val", null, {expires: 1});
    try {
        double_screen_obj.PingJia();
    } catch (e) {
    }
}

var et = timeoutSec;

// 从cookie读取评价
function readEval(callback) {
    return function () {
        var eval = $.cookie("eval_val");
        if (et == 0) {
            eval = (eval == undefined ? -1 : eval);
        }
        if (eval != undefined) {
            et = timeoutSec;
            callback.call(this, eval);
            stopReadEval();
        }
        et--;
    }
}

var tim = 1;
var $timer;
var $timer_mask;
var countTime = false;//开始记录时长
// 计时
function t_clock(t) {
    if (t == 'start') {
        $timer.text('1');
        tim = 1;
        $timer.show();
        $timer_mask.hide();
        countTime = true;
    } else if (t == 'stop') {
        if (auto_call_tag == true) {//开启了自动呼叫，开始倒计时
            $timer.text(autoCallTime / 1000);
        }
        tim = 1;
        //开启了自动呼叫时显示倒计时，否则隐藏
        if (auto_call_tag == false) {
            $timer.hide();
            $timer_mask.show();
        }
        countTime = false;
    }
}

function timerTick() {
    if ($timer == undefined) {
        $timer = $("#timer_");
    }
    if ($timer_mask == undefined) {
        $timer_mask = $('#timer_mask');
    }
    if (auto_call_tag == true && countTime == false) {//开启了自动呼叫，开始倒计时
        $timer.text(autoCallTime / 1000 - tim);
        if (autoCallTime / 1000 - tim == 0) {
            $timer.hide();
            $timer_mask.show();
        }
    } else {
        $timer.text(tim);
    }
    if (tim >= dealTimeWarn && dealTimeWarn > 0 && countTime == true) {
        var mes = "";
        mes += $.i18n.prop('server.business.long.time')+"<font color='red'>" + (dealTimeWarn / 60)
            + "</font>"+$.i18n.prop('server.min')+"</div>";
        var MSG1 = new CLASS_MSN_MESSAGE("warningInfo", 350, 120, "", $.i18n.prop('server.warning.message'),
            mes, "_blank", function () {
                return false;
            });
        MSG1.show();

        dealTimeWarn = 0;
    }
    //是否启用了等待超时后自动弃号并呼叫下一票号
    //需满足以下条件，1.处于计时中；2.开启了强制自动呼叫；3.等待时长和设置的限制值相等；4.票号处于呼叫状态，还没有开始办理
    if (countTime == true && auto_call_tag == true && tim == call_wait_time && op_tag == call_sta) {
        abandon();//等待超时，自动弃号
    }
    tim++;
}

function openWindowInfo() {
    var url = basePath + "client/seat/windowInfo?userId=" + userId
        + "&rand=" + Math.random();
    showModDialog(url, 500, 380);
}

function openSetBizWindow() {
    var url = basePath + "client/seat/setBizByWin?rand=" + Math.random();
    showModDialog(url, 500, 380);
}

/**
 * 锁定按钮，锁定后用户不能连续点击同一按钮
 */
function lockProcess(btnid) {
    process_btn = btnid;
}

/**
 * 解锁按钮
 */
function unlockProcess() {
    process_btn = '';
}

/**
 * 判断按钮是否被锁定
 */
function isLockProcess(btnid) {
    if (process_btn == btnid) {
        setTicketStateBar($.i18n.prop('server.in.operation'));
    }
    return process_btn == btnid;
}

/**
 * 批量处理中的复选框选中事件
 */
function batchHandleClick() {
    var c = $("#batch_handle").attr("checked");
    if (c == "checked") {
        var url = basePath + "client/batchHandleState?batch=" + true + "&rand=" + Math.random();
        $.get(url, function (r) {
            if (r.error != '') {
                setTicketStateBar($.i18n.prop('public.operate.fail'));
            } else {
                openDscreenBatchHandle();
            }
        });
    } else {
        var url = basePath + "client/batchHandleState?batch=" + false + "&rand=" + Math.random();
        $.get(url, function (r) {
            if (r.error != '') {
                setTicketStateBar($.i18n.prop('public.operate.fail'));
            }
        });
        showUserInfo();
    }
}

/**
 * 录入工作量-台帐
 */
function toMachineAccount() {
    var tid = getTidFromCookie();
    var url = basePath + "client/seat/machineAccount?tid=" + tid + "&rand=" + Math.random();
    showModDialog(url, 720, 420, false);
}

/**
 * 导出台帐
 */
function exportMachineAccount() {
    var url = basePath + "client/seat/machineAccount?action=to_export&rand=" + Math.random();
    showModDialog(url, 650, 260);
}

/**
 * 补录台帐
 */
function buluMachineAccount() {
    var url = basePath + "client/seat/machineAccount?tid=&rand=" + Math.random();
    showModDialog(url, 720, 420);
}

//打开双屏叫号页面
function openDscreenCall(ticket) {
    //在双屏打开暂停页面
    if (evalType == 'SCREEN') {
        var url = basePath + "client/seat/dscreenCall?rand=" + Math.random() + "&ticket=" + ticket + "&tid=" + getTidFromCookie();
        try {
            // alert(ticket);
            double_screen_obj.ExternOpenUrl(url);
            //显示叫号信息30秒后返回到人员信息页面
            setTimeout("showUserInfo()", 30000);
        } catch (e) {
        }
    }
}

//打开双屏评价页面
function openDscreenEval() {
    //在双屏打开评价页面
    if (evalType == 'SCREEN') {
        var url = basePath + "client/seat/dscreenEval?rand=" + Math.random();
        try {
            double_screen_obj.ExternOpenUrl(url);
        } catch (e) {
        }
    }
}

//打开双屏批量处理中页面
function openDscreenBatchHandle() {
    //在双屏打开评价页面
    if (evalType == 'SCREEN') {
        var url = basePath + "client/seat/dscreenBatchHandle?branchId=" + branchId + "&rand=" + Math.random();
        try {
            double_screen_obj.ExternOpenUrl(url);
        } catch (e) {
        }
    }
}

/**
 * 录入票号与纳税人相关联的工作量
 */
function lurugongzuoliang() {
    var tid = getTidFromCookie();
    var url = basePath + "client/seat/lurugzl?tid=" + tid + "&rand=" + Math.random();
    showModDialog(url, 660, 300, false);
}