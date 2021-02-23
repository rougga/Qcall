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

var ticketId = "";
var userInfoWindow;
var loginUrl = "";
var basePath = "";
var scrollTick;
var freshBizTick;

var evalType = "";
var autoCallTime = 10000;
var autoDeal = 0;
var fvts_client_tag;
var call_wait_time = 0;


var enableEval = 1;
var record_items = 0;


var screenEvalWin;

var userId;


window.isExit = false;


var eval_inter;

var double_screen_obj;

var dealTimeWarn = 0;

var sys_error = $.i18n.prop('server.system.fail');

var pauseSubItem = "0";

var autoCall_Timer;

var flag;


var branchId;


var wxTag = 0;

var refresh_biz_delay = 5000;


function init() {
    initButton();
    bindEvent2Button();


    op_tag = default_sta;
    setButton();

    if (evalType == 'SCREEN') {
        double_screen_obj = $("#double_screen")[0];

        screen_tag = doubleScreen_sta;
        setScreenButton();
    }
    // showUserInfo();

    if (fvts_client_tag == "app") {
        $('#menu_out').hide();
    }


    reFreshBiz(windowId, userId, 0);
    flag = 0;
    freshBizTick = setInterval("reFreshBiz(windowId,userId,flag)", refresh_biz_delay);


    //var evalObj = getEvaluation("evalFac");

    var evalObj = getEvaluationByToolFac(eval_tool_fac);
    if (evalObj != null) {
        evalObj.setStars(5);
    }
    recoverTkt();

    $.cookie("eval_val", null);


    setInterval("timerTick()", 1000);
}


function recoverTkt() {
    var r = $.cookie("fvts_seat_ticket");
    var t_status = "";
    if (r != null) {
        r = JSON.parse(r);
        if (r.ticket_id == undefined || r.ticket_id == "") {
            return;
        } else {
            var lastDate = $.cookie('last_tickedate');
            if (lastDate == new Date().getDate()) {
                alert($.i18n.prop('server.last.time.error'));
                var data = {'tid': r.tid};
                $.ajax({
                    url: basePath + 'client/seat/recoverTicket',
                    type: 'post',
                    data: data,
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
            autoTrans = "," + $.i18n.prop('server.automatic.transfer');
        }
        setTicketStateBar(r.ticket_id + "," + r.biz_name + "," + r.type_name
                + autoTrans);
    }
}


function showUserInfo() {
    if (evalType == 'SCREEN') {
        var url = basePath + "client/seat/userInfo?rand=" + Math.random()
                + "&userId=" + userId;
        try {
            var r = double_screen_obj.ExternOpenUrl(url);

            screen_tag = doubleScreen_sta;
            setScreenButton();
        } catch (e) {
        }
    }
}


function call(tid) {

    if (autoCall_Timer != null) {
        clearTimeout(autoCall_Timer);
    }

    if (isLockProcess(call_sta) || (tid == 'auto' && $("#pause_icon").is(":hidden") === false)) {
        setTicketStateBar($.i18n.prop('server.call.fail'));
        return;
    } else {
        lockProcess(call_sta);
    }

    if (op_tag == 1 || op_tag == 10) {
        if (tid != 'auto') {
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
        url: basePath + 'client/seat/call',
        type: 'post',
        data: pars,
        success: function (r) {
            if (r.error != undefined && r.error != '') {
                setTicketStateBar(r.error);
            } else {
                dealTimeWarn = 0;
                if (r.dealTimeWarn) {
                    dealTimeWarn = r.dealTimeWarn * 60;
                }
                t_clock('start');
                op_tag = call_sta;
                setButton();
                saveTicket2Cookie(r);
                $('#current_ticket').text(r.ticket_id);
                var autoTrans = "";
                if (r.auto_trans && r.biz_type_id != r.auto_trans) {
                    autoTrans = "," + $.i18n.prop('server.automatic.transfer');
                }
                setTransferedTag('N');
                setTicketStateBar(r.biz_name + ","
                        + r.type_name + autoTrans);
                setNsrStateBar(r.id_card_name, r.id_card_info_id)
                let pars2 = pars;
                pars2.id_user = userId;
                $.ajax({
                    url: loginUrl + 'QCall/api/getInfo',
                    type: 'post',
                    data: pars2,
                    success: function (r) {
                        $('').html(r.ticketTime);
                        $('').html(r.dealCount);
                    }
                });

                /* if (autoDeal == 1) {
                 deal();
                 } */
                deal();
                openDscreenCall(r.ticket_id);


                if (auto_call_tag) {
                    var MSG1 = new CLASS_MSN_MESSAGE("autoCall", 300, 160, "",
                            $.i18n.prop('server.auto.call.reminder'), $.i18n.prop('server.enable.automatic.call') + "<span style='color: red'>" + r.ticket_id + "</span>", "_blank");
                    MSG1.show();
                }
            }
        },
        error: function () {
            setTicketStateBar(sys_error);
        },
        complete: function () {
            unlockProcess();
        }
    });
}


function showNsrMessage(tid) {
    var msgUrl = basePath + "client/seat/queryNsrMsgs?ticketId=" + tid + "&rand=" + Math.random();
    showModDialog(msgUrl, 600, 380);
}

function queryIsCa(sbh) {
    var url = basePath + 'client/ticket/isCaUser?rand=' + Math.random();
    var par = {};
    par.nsrsbh = sbh;
    $.getJSON(url, par, function (d) {
        if (d != undefined && d.isCaUser) {
            var str = $('#nsr_state_bar marquee').text();
            $('#nsr_state_bar marquee').text($.i18n.prop('server.CA.auth.user') + "," + str);
        }
    });
}


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

            openDscreenCall($.cookie('fvts_seat_ticketId'));
        }
    });
}

function abandonCall() {
    op_tag = abandon_sta;
    var url = basePath + "client/seat/abandonCall?action=load&rand="
            + Math.random();
    var ti = showModDialog(url, 600, 420);
    if (ti != undefined) {
        var str = ti.split("_");
        url = basePath + "client/seat/abandonCall?action=do&rand=" + Math.random();
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
                    dealTimeWarn = r.dealTimeWarn * 60;
                }
                setTransferedTag('N');
                t_clock('start');
                op_tag = call_sta;
                setButton();
                saveTicket2Cookie(r);
                $('#current_ticket').text(r.ticketId);
                setTicketStateBar(r.ticket_id + "," + r.biz_name + ","
                        + r.type_name);

                if (autoDeal == 1) {
                    deal();
                }
                openDscreenCall(r.ticketId);
            }
        });
    }
}


function specialCall() {
    op_tag = specialCall_sta;
    var url = basePath + "client/seat/specialCall?action=load&rand="
            + Math.random();
    var ti = showModDialog(url, 550, 420);
    if (ti != undefined) {
        url = basePath + "client/seat/specialCall?action=do&rand=" + Math.random();
        var par = {};
        par.tid = ti;
        $.get(url, par, function (r) {
            if (r.error != undefined && r.error != '') {
                setTicketStateBar(r.error);
            } else {
                dealTimeWarn = 0;
                if (r.dealTimeWarn) {
                    dealTimeWarn = r.dealTimeWarn * 60;
                }
                t_clock('start');
                op_tag = call_sta;
                setButton();
                saveTicket2Cookie(r);
                $('#current_ticket').text(r.ticket_id);
                setTicketStateBar(r.ticket_id + "," + r.biz_name + ","
                        + r.type_name);

                if (autoDeal == 1) {
                    deal();
                }
                openDscreenCall(r.ticket_id);
            }
        });
    }
}

function seccall() {
    op_tag = seccall_sta;
    var url = basePath + "client/seat/seccall?action=load&rand="
            + Math.random();
    var ti = showModDialog(url, 400, 160);
    if (ti != undefined) {
        url = basePath + "client/seat/seccall?action=do&rand=" + Math.random();
        var par = {};
        par.tid = ti;
        $.get(url, par, function (r) {
            if (r.error != undefined && r.error != '') {
                setTicketStateBar(r.error);
            } else {
                setTicketStateBar($.i18n.prop('server.second.call.success'))
                $.cookie('fvts_seat_tid', ti);
                setButton();
            }
        });
    }
}

function transfer(tag, needFin) {
    var seccallTran = false;
    needFin = (!needFin ? true : needFin);
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
        if (bizid.type == "bizTrans") {
            url = basePath + "client/seat/transfer?action=bizTrans&rand="
                    + Math.random();
            par.tId = getTidFromCookie();
            par.bizId = bizid.id;
            par.priority = bizid.priority;
        } else if (bizid.type == "winTrans") {
            url = basePath + "client/seat/transfer?action=winTrans&rand="
                    + Math.random();
            par.tId = getTidFromCookie();
            par.winId = bizid.id;
            par.priority = bizid.priority;
        }
        $.getJSON(url, par, function (r) {
            t_clock('stop');
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


function suspend() {
    var tid = getTidFromCookie();
    var url = 'tid=' + tid;
    if (isLockProcess(suspend_sta)) {
        return;
    } else {
        lockProcess(suspend_sta);
    }

    $.ajax({
        url: basePath + "client/seat/suspend",
        type: 'post',
        data: url,
        success: function (r) {
            unlockProcess();
            if (r.error != undefined && r.error != '') {
                setTicketStateBar(r.error);

            } else {
                t_clock('stop');
                op_tag = suspend_sta;
                setButton();
                autoCall();
                showUserInfo();
            }
        },
        error: function () {
            unlockProcess();
            setTicketStateBar(sys_error);
        }
    });
}


function continued() {
    op_tag = continued_sta;
    setButton();
    var url = basePath + "client/seat/suspendCall?action=load&rand="
            + Math.random();
    var ti = showModDialog(url, 550, 420);
    if (ti != undefined) {
        var str = ti.split("_");
        url = basePath + "client/seat/suspendCall?action=do&rand=" + Math.random();
        var par = {};
        par.id = str[0];
        par.tBizTypeId = str[1];
        $.get(url, par, function (r) {
            if (r.error != undefined && r.error != '') {
                setTicketStateBar(r.error);

            } else {
                dealTimeWarn = 0;
                if (r.dealTimeWarn) {
                    dealTimeWarn = r.dealTimeWarn * 60;
                }
                setTransferedTag('N');
                t_clock('start');
                op_tag = call_sta;
                setButton();
                saveTicket2Cookie(r);
                $('#current_ticket').text(r.ticket_id);
                setTicketStateBar(r.ticket_id + "," + r.biz_name + ","
                        + r.type_name);
                if (autoDeal == 1) {
                    deal();
                }
            }
        });
    }
}

function doubleScreen() {
    // dsc.doubleScr();
    try {
        double_screen_obj.DualScreen();
    } catch (e) {
    }
    screen_tag = doubleScreen_sta;
    setScreenButton();
}

function singleScreen() {
    // dsc.singleScr();
    try {
        double_screen_obj.SingleScreen();
    } catch (e) {
    }
    screen_tag = singleScreen_sta;
    setScreenButton();
}


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
        url: basePath + "client/seat/refuseDeal",
        type: 'post',
        data: url,
        success: function (t) {
            if (t) {
                abandon();
            }
        }
    });
}


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
     
     if (t != null) {
     var idCardId = t.id;
     if (idCardId != null && idCardId != "") {
     var modelUrl = basePath + "client/seat/showIdCardInfo?idCardId=" + idCardId + "&tid="+tid+"&action=load&rand=" + Math.random();
     
     var result = showModDialog(modelUrl, 850, 520);
     if (result == '1') {
     doStartCall();
     } else if (result == "0") {
     doRefuseDeal();
     }
     } else { 
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
    if (!tid) {
        return;
    }
    if (isLockProcess(start_sta)) {
        return;
    } else {
        lockProcess(start_sta);
    }


    wxTag = 0;

    $.ajax({
        url: basePath + "client/seat/deal",
        type: 'post',
        //async:false,
        data: url,
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
        error: function () {
            unlockProcess();
            setTicketStateBar(sys_error);
        }
    });
}


function finish() {
    var tid = getTidFromCookie();
    if (!tid) {
        return;
    }

    if (record_items == '1' && machineAccount_tag != "1" && luruGZL_tag != "1") {
        evaluation(setBizItemCount);
    } else {
        evaluation(finishAction);
    }
}

function evaluation(func) {
    var evalRet = -1;
    if (enableEval == 1 && wxTag != 1) {
        if (evalType == "BUTTON") {
            //var obj = getEvaluation('evalFac');
            var obj = getEvaluationByToolFac(eval_tool_fac);
            if (obj == null) {
                func(-1);
            } else {
                obj.receive(timeoutSec, func);
            }
        } else if (evalType == "SCREEN") {
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
    } else {
        func(-1);
    }
}

function setBizItemCount(evalRet) {
    var tkid = getTidFromCookie();

    var urlshow = basePath + 'client/seat/finishBiz?action=show&tid=' + tkid
            + "&rand=" + Math.random();
    var msg = showModDialog(urlshow, 900, 460);
    if ("success" == msg) {
        finishAction(evalRet);
    } else if ("none" == msg) {
        if (confirm($.i18n.prop('server.effort.fail'))) {
            finishAction(evalRet);
        } else {
            //$(document).unmask();
        }
    } else {
        // $(document).unmask();
    }
}

function finishAction(evalRet) {
    var tid = getTidFromCookie();
    if (!tid) {
        return;
    }
    var url = basePath + 'client/seat/finish?tid=' + tid + "&evalRet=" + evalRet
            + "&rand=" + Math.random();
    $.get(url, function (r) {
        if (r.error != undefined && r.error != '') {
            setTicketStateBar(r.error);
        } else {
            unlockProcess();
            t_clock('stop');
            op_tag = finish_sta;
            setButton();
            autoCall();
            trans();
        }
    });
    //$(document).unmask();
    palyThanks();
}

function trans() {
    var transfered = getTransferedTag();
    if (transfered == 'Y') {

        return;
    }
    var autotrans = getAutotransFromCookie();
    if (autotrans != undefined && autotrans != '') {
        var url = "client/seat/getBizInfo?bizId=" + autotrans + "&rand="
                + Math.random();
        $.get(url, function (r) {
            if (r.name != undefined) {
                var result = true;
                if (showTransferConfirm && showTransferConfirm == "yes") {
                    result = confirm($.i18n.prop('server.auto.transferred.business') + '【' + r.name + '】？');
                }
                if (result) {
                    var priority = false;//confirm($.i18n.prop('server.banks.priority'));
                    var biz = {};
                    biz.type = "bizTrans";
                    biz.id = autotrans;
                    biz.priority = priority;
                    transfer(biz, false);
                }
            }
        });
    }
}


function abandon() {
    //alert(111);
    var tid = getTidFromCookie();
    if (!tid) {
        return;
    }
    var url = 'tid=' + tid;
    if (isLockProcess(abandon_sta)) {
        return;
    } else {
        lockProcess(abandon_sta);
    }
    $.ajax({
        url: basePath + "client/seat/abandon",
        type: "post",
        data: url,
        success: function (r) {
            unlockProcess();
            t_clock('stop');
            if (r.error != undefined && r.error != '') {
                setTicketStateBar(r.error);
            } else {
                op_tag = abandon_sta;
                setButton();
                autoCall();
                showUserInfo();
            }
        },
        error: function () {
            unlockProcess();
            setTicketStateBar(sys_error);
        }
    });
}


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
    luruGZL_btn = $("#luruGZL");
}

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


function setButton() {

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
            machineAccount_btn.hide();
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
            machineAccount_btn.hide();
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
            machineAccount_btn.show();
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
            machineAccount_btn.hide();
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
            machineAccount_btn.hide();
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
            machineAccount_btn.hide();
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
    url += "&lang=" + getNowLanguage();
    return window.open(url, window, param);
    /*if (model==false) {
     return window.showModelessDialog(url, window, param);
     }else
     {
     }*/
}


function showNotice(n_id) {
    var url = 'client/seat/showNotice?action=show&noticeId=' + n_id;
    showModDialog(url, 400, 380);
}


function queryTicket() {
    var url = basePath + "client/seat/queryTicket?action=load&rand="
            + Math.random();
    showModDialog(url, 720, 420);
}


function setBiz() {
    var url = basePath + "client/seat/setBiz?rand=" + Math.random();
    var tid = showModDialog(url, 400, 300);
    if (tid != undefined && tid != "") {
        call(tid);
    }
}

function pickNotice() {
    var url = basePath + "client/seat/pickNotice?rand=" + Math.random();
    showModDialog(url, 400, 280);
}

function setOnline() {
    var url;
    if ($("#ticket_state_bar").text() == $.i18n.prop('json.msg.unableCall3') ||
            $("#ticket_state_bar").text() == '---'
            ) {
        url = basePath + "client/online?rand=" + Math.random() + "&status=1";
    } else {
        url = basePath + "client/online?rand=" + Math.random() + "&status=0";
    }
    $.get(url, function (r) {
        if (r.error != '') {
            setTicketStateBar($.i18n.prop('public.operate.fail'));
        }
        togglePaus();
        $('#statusImg').attr('src', './img/icon/online.png');
        if (evalType == 'SCREEN') {
            var url = basePath + "client/seat/userInfo?rand=" + Math.random() + "&userId=" + userId;

            try {
                double_screen_obj.ExternOpenUrl(url);
            } catch (e) {
            }
        }
    });
}

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
    $('#statusImg').attr('src', './img/icon/pause.png');
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
        if (evalType == 'SCREEN') {
            var url = basePath + "client/seat/dscreenPause?rand=" + Math.random();
            try {
                double_screen_obj.ExternOpenUrl(url);
            } catch (e) {
            }
        }
    });
}


function setLogoff(status) {
    flag = 1;
    clearInterval(freshBizTick);
    var url = basePath + "client/logout";
    $.ajax({
        url: url,
        type: "post",
        async: false,
        data: {"status": status},
        success: function () {
            //window.location.href = loginUrl;

            //changing status to disconected
            $.post("./ChangeStatus", {status: 0}, function (data) {
                window.location = "./index.jsp";
            });
        },
        error: function () {
            window.location.href = loginUrl;
        }
    });

}

function setLogout() {
    flag = 1;
    clearInterval(freshBizTick);
    var url = basePath + "client/logout";
    $.ajax({
        url: url,
        type: "post",
        async: false,
        data: {"status": status},
        success: function () {
            window.opener = null;
            window.open('', '_self');
            window.close();
        },
        error: function () {
            window.opener = null;
            window.open('', '_self');
            window.close();
        }
    });
}

function saveTicket2Cookie(t) {

    $.cookie('fvts_seat_tid', '');
    $.cookie('fvts_seat_ticketId', '');
    $.cookie('fvts_seat_callLanguage', '');
    $.cookie('fvts_seat_bizType', '');
    $.cookie('fvts_seat_autotrans', '');
    $.cookie('fvts_seat_transfered', 'N');
    $.cookie('fvts_seat_nsrdzdah', '');

    $.cookie('fvts_seat_tid', t.tid);
    $.cookie('fvts_seat_ticketId', t.ticket_id);
    $.cookie('fvts_seat_callLanguage', t.call_language);
    $.cookie('fvts_seat_bizType', t.biz_type_id);
    if (t.biz_type_id != t.auto_trans) {
        $.cookie('fvts_seat_autotrans', t.auto_trans);
    }
    $.cookie('last_tickedate', new Date().getDate(), {expires: 0.1});
    $.cookie("fvts_seat_ticket", JSON.stringify(t), {expires: 0.1});
    $.cookie('fvts_seat_nsrdzdah', t.nsrdzdah);
}


function getTidFromCookie() {
    return $.cookie('fvts_seat_tid');
}


function getAutotransFromCookie() {
    return $.cookie('fvts_seat_autotrans');
}


function setTransferedTag(tag) {
    $.cookie('fvts_seat_transfered', tag);
}

function getTransferedTag() {
    return $.cookie('fvts_seat_transfered');
}

function setTicketStateBar(info) {
    $('#ticket_state_bar').text(info);
    if (info == "---") {
        setNsrStateBar("---");
    }
    if ($.i18n.prop('public.operate.fail') == info) {
        $.cookie("fvts_seat_ticket", null);
    }
}


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

function setSeatStateBar(info) {
    $('#seat_state_bar').text(info);
}


function setAutoCallTag() {
    if ($(this).is(':checked')) {
        auto_call_tag = true;
    } else {
        auto_call_tag = false;
    }
}

function autoCall(immediate) {
    if (autoCall_Timer != null) {
        clearTimeout(autoCall_Timer);
    }
    if (auto_call_tag && $("#pause_icon").is(":hidden") == true) {
        autoCall_Timer = setTimeout("call('auto')", autoCallTime);
    }
}

var biz_length;
var iswait;
function reFreshBiz(windowId, userId, flag) {
    var url = basePath + "client/seat/refreshBiz?rand=" + Math.random();
    $.getJSON(url, function (r) {
        var l = $('#biz_list_');
        if (r != undefined) {
            if (biz_length != undefined && r.length != biz_length) {
                var MSG1 = new CLASS_MSN_MESSAGE("bizChange", 300, 160, "",
                        $.i18n.prop('server.ticket.tip'), $.i18n.prop('server.window.ability'), "_blank");
                MSG1.show();
            }
            biz_length = r.length;
            l.empty();
            var show = false;
            $.each(r, function (i, d) {
                var html = "<li class='list-group-item d-flex justify-content-between align-items-center font-weight-bold'>"
                        + "<span  class='badge badge-success bg-costum badge-pill ' title=" + $.i18n.prop('server.now.waiting.number') + ">"
                        + (d.waitcount < 0 ? 0 : d.waitcount)
                        + "</span>"
                        + d.bizname
                        ;


                if (d.nextticket) {
                    html = html + "<span title=" + $.i18n.prop('page.tickettype.next.number') + ">"
                            + d.nextticket
                            + "</span>";
                }
                html = html + "</li>";

                l.append(html);
                if (Number(d.waitcount) > 0) {
                    show = true;
                }
            });
            // alert('before:'+iswait);
            if (show && !iswait) {
                iswait = true;
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


function returnCallSta() {
    op_tag = default_sta;
    setButton();
}

function togglePaus(tag) {
    if (tag === 1) {
        $('#pause_icon').show();
        $('#controlPanel').hide();
        $('#displayPanel').hide();

        if (autoCall_Timer !== null) {
            clearTimeout(autoCall_Timer);
        }
    } else {
        $('#pause_icon').hide();
        $('#controlPanel').show();
        $('#displayPanel').show();
    }
}


function playWelcome() {

    if (enableEval == 1) {
        if (evalType == "BUTTON") {
            //var evalObj = getEvaluation("evalFac");
            var evalObj = getEvaluationByToolFac(eval_tool_fac);
            if (evalObj != null) {
                evalObj.welcome();
            }
        } else if (evalType == "SCREEN") {
            try {
                document.getElementById('Welcome').controls.play();
            } catch (e) {
            }
        }
    }
}


function palyEval() {
    try {
        document.getElementById('Evaluate').controls.play();
    } catch (e) {
        // alert(e.message);
    }
}

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


function startReadEval(callback) {
    eval_inter = setInterval(readEval(callback), 1000);
    openDscreenEval();
    try {
        double_screen_obj.Finish();
    } catch (e) {
    }
}


function stopReadEval() {
    clearInterval(eval_inter);
    $.cookie("eval_val", null, {expires: 1});
    try {
        double_screen_obj.PingJia();
    } catch (e) {
    }
}

var et = timeoutSec;


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
var $timer = document.getElementById("timer_");
var $timer_mask = document.getElementById("timer_mask");
var countTime = false;

function t_clock(t) {
    if (t == 'start') {
        $($timer).html('1');
        tim = 1;
        $($timer).show();
        $($timer_mask).hide();
        countTime = true;
    } else if (t == 'stop') {
        if (auto_call_tag == true) {
            $($timer).html(autoCallTime / 1000);
        }
        tim = 1;

        if (auto_call_tag == false) {
            $($timer).hide();
            $($timer_mask).show();
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
    if (auto_call_tag == true && countTime == false) {
        $($timer).html(autoCallTime / 1000 - tim);
        if (autoCallTime / 1000 - tim == 0) {
            $($timer).hide();
            $($timer_mask).show();
        }
    } else {
        $($timer).html(tim);
    }
    if (tim >= dealTimeWarn && dealTimeWarn > 0 && countTime == true) {
        var mes = "";
        mes += $.i18n.prop('server.business.long.time') + "<font color='red'>" + (dealTimeWarn / 60)
                + "</font>" + $.i18n.prop('server.min') + "</div>";
        var MSG1 = new CLASS_MSN_MESSAGE("warningInfo", 350, 120, "", $.i18n.prop('server.warning.message'),
                mes, "_blank", function () {
                    return false;
                });
        MSG1.show();

        dealTimeWarn = 0;
    }
    if (countTime == true && auto_call_tag == true && tim == call_wait_time && op_tag == call_sta) {
        abandon();
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

function lockProcess(btnid) {
    process_btn = btnid;
}

function unlockProcess() {
    process_btn = '';
}


function isLockProcess(btnid) {
    if (process_btn == btnid) {
        setTicketStateBar($.i18n.prop('server.in.operation'));
    }
    return process_btn == btnid;
}

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

function toMachineAccount() {
    var tid = getTidFromCookie();
    var url = basePath + "client/seat/machineAccount?tid=" + tid + "&rand=" + Math.random();
    showModDialog(url, 720, 420, false);
}


function exportMachineAccount() {
    var url = basePath + "client/seat/machineAccount?action=to_export&rand=" + Math.random();
    showModDialog(url, 650, 260);
}


function buluMachineAccount() {
    var url = basePath + "client/seat/machineAccount?tid=&rand=" + Math.random();
    showModDialog(url, 720, 420);
}


function openDscreenCall(ticket) {

    if (evalType == 'SCREEN') {
        var url = basePath + "client/seat/dscreenCall?rand=" + Math.random() + "&ticket=" + ticket + "&tid=" + getTidFromCookie();
        try {
            // alert(ticket);
            double_screen_obj.ExternOpenUrl(url);

            setTimeout("showUserInfo()", 30000);
        } catch (e) {
        }
    }
}


function openDscreenEval() {

    if (evalType == 'SCREEN') {
        var url = basePath + "client/seat/dscreenEval?rand=" + Math.random();
        try {
            double_screen_obj.ExternOpenUrl(url);
        } catch (e) {
        }
    }
}


function openDscreenBatchHandle() {

    if (evalType == 'SCREEN') {
        var url = basePath + "client/seat/dscreenBatchHandle?branchId=" + branchId + "&rand=" + Math.random();
        try {
            double_screen_obj.ExternOpenUrl(url);
        } catch (e) {
        }
    }
}

function lurugongzuoliang() {
    var tid = getTidFromCookie();
    var url = basePath + "client/seat/lurugzl?tid=" + tid + "&rand=" + Math.random();
    showModDialog(url, 660, 300, false);
}