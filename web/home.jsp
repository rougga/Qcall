<%@page import="java.util.Objects"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
    if (Objects.equals(session.getAttribute("status"), "0")) {
       response.sendRedirect("./index.jsp");
    }
    String basePath = "http://localhost:8888/server/";
    String mngPath = "http://localhost:8888/mng";

%>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <title>QCall</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="icon" type="image/png" href="./img/favicon-32x32.png">
        <script src="./js/lib/jquery.js"></script>
        <script src="./js/lib/jquery.cookie.js"></script>
        <script src="./js/lib/jquery.scroll.js"></script>
        <script src="./js/lib/json2.js"></script>
        <script src="./js/lib/jquery.i18n.properties-1.0.9.js"></script>
        <script src="./js/lib/I18nUtil.js"></script>
        <script src="./js/lib/message.js"></script>
        <script src="./js/lib/warning.js"></script>
        <script src="./js/seat/evaluation.js"></script>
        <link href="./css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
        <link href="./css/body.css" rel="stylesheet" type="text/css"/>
        <script src="./js/lib/bootstrap.bundle.min.js"></script>
        <script src="./js/home.js"></script>
        <script type="text/javascript">
            var windowId = "${windowId}";
            var userId = "${userId}";
            var pauseCount = "${pauseCount}";
            var ip = "${ip}";
            window.win_quit = function () {
                setLogout();
            }   
            var eval_tool_fac = "${eval_tool_fac}";
        </script>
    </head>
    <body>
    <body>
        <div class="box" >
            <div class="col-12 pt-4 mt-4" id="topmenu" >
                <h5 class="text-white">Utilisateur ：${userName}，Guichet ：${SEAT_WINSTR}</h5>
                <a href="javascript:void(0);" class="btn btn-warning btn-sm" onclick="setOnline();return false;">
                    ONLINE
                </a>
                <a id="stopMenuA" href="javascript:void(0);" class="btn btn-warning btn-sm" onclick="setStop();return false;">
                    PAUSE
                </a>
                <a href="javascript:void(0);" class="btn btn-warning btn-sm" onclick="setLogoff(0);return false;">
                    Deconnexion
                </a>
            </div>
            
            <a href="javascript:void(0);" onclick="queryTicket();return false;" onfocus="blur()" style="color:blue;">
                Query
            </a> |
            <c:if test='${ENABLE_PICK_BIZ_CALL != "0"}'>
                <a href="javascript:void(0);" onclick="setBiz();return false;" onfocus="blur()"
                   style="color:blue;" title="<spring:message code="server.call.customize.tip"/> ">Call customize</a> |
            </c:if>
            <c:if test='${SET_BIZ_BY_WIN == "yes"}'>
                <a href="javascript:void(0);" onclick="openSetBizWindow();return false;"
                   onfocus="blur()" style="color:blue;"
                   title="<spring:message code="server.setup.business.tip"/> Setup bus </a> |
            </c:if>
            <c:if test='${SHOW_MNGLINK_ON_CLIENT == "yes"}'>
                <a href="<%=mngPath%>" target="_blank"
                   onfocus="blur()"
                   style="color:blue;" title="<spring:message code="server.management.background.tip"/> mng bg </a>
            </c:if>
            <div class="icon">
                <div id="pause_icon" style="display:none;float:left;vertical-align:bottom;">
                    Pause
                </div>
                <a class="btn btn-primary" id="call_btn" title="<spring:message code="server.call.tip"/> 
                Call
                </a>
                <a class="btn btn-primary" id="reCall_btn" title="<spring:message code="server.additional.call.tip"/> 
                additional
                </a>
                <a class="btn btn-primary" id="abandonCall_btn" title="<spring:message code="server.abandonment.call.tip"/> 
                abandonment
                </a>
                <a class="btn btn-primary" id="specialCall_btn" title="<spring:message code="server.specific.call.tip"/> 
                specific
                </a>
                <a class="btn btn-primary" id="transfer_btn" title="<spring:message code="server.banks.transfer.tip"/>
                transfer
                </a>
                <a class="btn btn-primary" id="suspend_btn" title="<spring:message code="server.interrupt.deal.tip"/>
                interrupt
                </a>
                <a class="btn btn-primary" id="continue_btn" title="<spring:message code="server.continue.dea.tip"/>
                continue
                </a>
                <a class="btn btn-primary" id="start_btn" title="<spring:message code="server.start.tip"/>
                start
                </a>
                <a class="btn btn-primary" id="abandon_btn" title="<spring:message code="server.give.up.ticket.tip"/>
                give.up>
                </a>
                <a class="btn btn-primary" id="finish_btn" title="<spring:message code="server.complete.tip"/>
                complete
                </a>
                <a class="btn btn-primary" id="return_btn" title="<spring:message code="server.return.turn.tip"/>
                return.turn
                </a>
                <a class="btn btn-primary" id="doubleScreen_btn" style="display:none;"
                   title="<spring:message code="server.double.screen.tip"/>
                double.screen
                </a>
                <a class="btn btn-primary" id="singleScreen_btn" style="display:none;"
                   title="<spring:message code="server.single.screen.tip"/> 
                single.screen
                </a>
                <a class="btn btn-primary" id="screenShot_btn" title="<spring:message code="server.screenshots.tip"/>
                screenshots
                </a>
            </div>
            <h1 class="text-danger" id="current_ticket">
            </h1>
            <div class="gdtxt" id="scrollDiv" style="width:94%;">
                <ul id="biz_list_" style="margin:0;padding:0;">
                </ul>&nbsp;
            </div>
        </div>
        <h4 id="ticket_state_bar" style="color:red;">---</h4>
        Auto:
    <c:if test='${auto_call == "1"}'>
        <c:set var="au_ck" value="checked"></c:set>
        <c:set var="au_dis" value="disabled"></c:set>
        <c:set var="au_title" value="${server.auto.title2}"></c:set>
        <script>
            $(function () {
                auto_call_tag = true;
                setTimeout(function () {
                    var MSG1 = new CLASS_MSN_MESSAGE("autoCallOn", 300, 160, "",
                        "<spring:message code='server.ticket.tip'/> ", "<spring:message code='server.ticket.timeout1'/> <br/><br/><spring:message code='server.ticket.timeout2'/> <span style='color:red'>${auto_call_time==null?10:auto_call_time}S</span><spring:message code='server.ticket.timeout3'/> ", "_blank");
                    MSG1.show();
                }, 15000);
            });
        </script>
    </c:if>
    <td style="width: 90px;" title="${au_title}">
        <label><input type="checkbox" id="enabel_auto_call" value="Y"
                      style="vertical-align: middle;" ${au_ck} ${au_dis} /><spring:message code="server.auto.call"/> </label>
    </td>

    <spring:message code="server.other.msg"/> ：

    <span id="nsr_state_bar" style="color:red;"></span>

    <h2>
        Timer ：
        <span style="color:red;display:none" id="timer_"></span>
        <span style="color:red;" id="timer_mask">--</span>
    </h2>

    <c:if test='${eval_type == "BUTTON"}'>
        <c:if test='${eval_tool_fac == "raymonpjq"}'>
            <object id="raymonpjq"
                    classid="clsid:3C364DD9-CD5B-44BB-8F1E-CBFE12ED090A"
                    codebase="${pageContext.request.contextPath}/plugins/RaymonPJQ.ocx#version=1,0,0,0"
                    width=0
                    height=0
                    align="left"
                    hspace=0
                    vspace=0
                    >
            </object>
        </c:if>
    </c:if>
    <c:if test='${eval_type == "SCREEN"}'>
        <object id="double_screen"
                classid="clsid:0C80B923-779C-4749-88AF-DC9AD478B0AF"
                width=0
                height=0
                align="left"
                hspace=0
                vspace=0
                ></object>
    </c:if>

</body>
</html>
<script type="text/javascript">
   /* $.ajaxSetup({
        global  : false,
        complete: function (XMLHttpRequest, textStatus) {
            var sessionstatus = XMLHttpRequest.getResponseHeader("sessionStatus"); //通过XMLHttpRequest取得响应头，sessionstatus，
            if (sessionstatus == "timeout") {
                try {
                    var MSG1 = new CLASS_MSN_MESSAGE("timeout", 300, 160, "",
                        "<spring:message code="server.ticket.tip"/> ", "<spring:message code="server.ticket.error1"/>", "_blank");
                    MSG1.show();
                } catch (e) {
                }
                //如果超时就处理 ，指定要跳转的页面
                clearInterval(freshBizTick);
                setTimeout(function () {
                    window.location.href = loginUrl;
                }, 5000);
            }
        },
        error   : function (XMLHttpRequest, textStatus, errorThrown) {
            setTicketStateBar("<spring:message code="server.ticket.error2"/> ");//在状态栏显示
        }
    });*/

    $(function () {
        basePath = "<%=basePath%>";
        loginUrl = "<%=basePath%>client/login";
        evalType = '${eval_type}';
        autoDeal = '${auto_deal}';
        autoDeal = autoDeal === '' ? 0 : autoDeal;
        autoCallTime = '${auto_call_time}';
        autoCallTime = autoCallTime === '' ? 10 : autoCallTime;
        autoCallTime = autoCallTime * 1000;//转换成毫秒
        call_wait_time = "${call_wait_time}" === "" ? 0 : '${call_wait_time}';
        call_wait_time = call_wait_time * 1;
        fvts_client_tag = '${fvts_client_tag}';
        enableEval = "${enable_eval}";
        userId = "${userId}";
        record_items = "${record_items}";
        timeoutSec = '${eval_timeout}';
        timeoutSec = timeoutSec === '' ? 5 : timeoutSec;
        evalLevel = "${evalLevel}";
        //是否启动台帐
        machineAccount_tag = "${machine_account}";
        luruGZL_tag = "${DEAL_WITH_NSR}";

        //是否存在暂停子选项
        pauseSubItem = "${pasue_subitem}";
        //大厅ID
        branchId = "${branchId}";

        //自动转移时弹出确认框
        showTransferConfirm = "${SHOW_TRANSFER_CONFIRM}";

        $("#scrollDiv").Scroll({line: 1, speed: 1000, timer: 5000});
        //暂停按钮不注册该事件
        $('.menu a[id!="stopMenuA"]').bind('click', select_menu);
        init();
    });

    function MM_showHideLayers() { //v9.0
        var i, p, v, obj, args = MM_showHideLayers.arguments;
        for (i = 0; i < (args.length - 2); i += 3)
            with (document)
                if (getElementById && ((obj = getElementById(args[i])) !== null)) {
                    v = args[i + 2];
                    if (obj.style) {
                        obj = obj.style;
                        v = (v === 'show') ? 'visible' : (v === 'hide') ? 'hidden' : v;
                    }
                    obj.visibility = v;
                }
    }

    function hide_menu() {
        setTimeout("MM_showHideLayers('topmenu','','hide')", 200);
    }

    var icon_src = '${pageContext.request.contextPath}/style/client/seat/images/';

    function select_menu() {
        var n = $(this).attr('class');
        $('#sta_icon').attr('src', icon_src + n + '.gif');
    }

    function open_ticket_win() {
        var pars = "branchId=${branchId}&areaId=${areaids}";
        var tik_url = "${pageContext.request.contextPath}/client/ticket.do?guide=seat&" + pars;
        window.open(tik_url, "_ticket_win", "height=650, width=1024, toolbar= no, menubar=no, scrollbars=no, resizable=no, location=no, status=no,left=100,top=20");
    }
</script>
