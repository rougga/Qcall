<%@page import="java.util.Objects"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ taglib uri = "http://java.sun.com/jsp/jstl/core" prefix = "c" %>
<%
    if (Objects.equals(session.getAttribute("status"), "0")) {
       response.sendRedirect("./index.jsp");
    }
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
        <script src="./js/lib/evaluation.js"></script>
        <link href="./css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
        <link href="./css/body.css" rel="stylesheet" type="text/css"/>
        <script src="./js/lib/bootstrap.bundle.min.js"></script>
        <script src="./js/script.js"></script>
        <script src="./js/home.js"></script>

        <script type="text/javascript">
            var windowId = "${windowId}";
            var userId = "${userId}";
            var pauseCount = "${pauseCount}";
            var ip = "${ip}";
            window.win_quit = function () {
                setLogout();
            };
            var eval_tool_fac = "${eval_tool_fac}";
        </script>
    </head>
    <body class="bg-dark">
        <div class="container-lg body p-0 min-vh-100">
            <div>
                <%@include file="./addon/navbar.jsp" %>
            </div>
            <div class="d-md-flex">
                <div id="console" class="col-12 col-md-9">
                    <div class="col-12 my-4 py-4" id="displayPanel">
                        <h1 class="text-dark text-center" id="current_ticket"></h1>
                        <h2 id="ticket_state_bar" class="text-dark text-center">---</h2>
                        <h4 id="nsr_state_bar" class="text-center text-dark"></h4>
                        <h4 id="ticket_time" class="text-dark text-center">---</h4>
                        <h2 class="text-center">
                            Timer ：
                            <span style="display:none" id="timer_" class="text-danger text-center"></span>
                            <span id="timer_mask" class="text-danger text-center">0 sec</span>
                        </h2>
                        <h5 class="text-dark text-center">Totale Traité: <span id="todayUserDeal">0</span></h5>
                    </div>
                    <div class="col-12 p-2" id="controlPanel">
                        <div id="next" class="w-100">
                            <a class="btn btn-lg bg-costum text-white border w-100 py-4 my-2" id="call_btn">
                                <img src="./img/icon/call.png" class="pb-1 m-0"/> Suivant
                            </a>
                            <a class="btn btn-lg bg-costum text-white border w-100 py-4 my-2" id="finish_btn">
                                <img src="./img/icon/deal.png" class="pb-1 m-0"/> Suivant
                            </a>
                        </div>
                        <div id="tasks" class="">
                        </div>
                        <div id="otherBtn" class="w-100">
                            <!-- Call State -->
                            <div class="d-flex">
                                <a class="btn  bg-costum  text-white  px-0 py-2 m-1 " id="abandonCall_btn" style="width: 33%"> 
                                    <img src="./img/icon/recall.png" class="pb-1 m-0"/> Rappel
                                </a>
                                <a class="btn  bg-costum  text-white px-0 py-2  m-1 " id="continue_btn" style="width: 33%">
                                    <img src="./img/icon/continue.png" class="pb-1 m-0"/> Continue
                                </a>
                                <a class="btn bg-costum text-white  px-0 py-2  m-1 " id="specialCall_btn" style="width: 33%"> 
                                    specific
                                </a>
                            </div>
                            <!-- Deal State -->
                            <div class="d-flex">
                                <a class="btn bg-costum text-white  px-0 py-2  m-1 " id="abandon_btn" style="width: 33%">
                                    <img src="./img/icon/giveup.png" class="pb-1 m-0"/> Absent
                                </a>
                                <a class="btn bg-costum text-white  px-0 py-2  m-1 " id="transfer_btn" style="width: 33%">
                                    <img src="./img/icon/trans.png" class="pb-1 m-0"/> Transfer
                                </a>
                                <a class="btn bg-costum text-white  px-0 py-2  m-1 " id="suspend_btn" style="width: 33%">
                                    <img src="./img/icon/interrupt.png" class="pb-1 m-0"/> Interrompre
                                </a>
                            </div>
                            
                            <div class="d-flex">
                                <a class="btn bg-costum text-white  px-0 py-2  mx-auto " id="reCall_btn" style="width: 33%"> 
                                    <img src="./img/icon/call.png" class="pb-1 m-0"/> Additional
                                </a>
                            </div>
                        </div>

                        <!-- removed step
                        <a class="btn btn-lg bg-costum p-4 text-white border m-2" id="start_btn">
                            <img src="./img/icon/call.png" class="pb-1 m-0"/> Début
                        </a>
                        -->
                        <div class="mx-auto d-md-flex justify-content-md-center col-12">

                            <a class="btn btn-warning m-1" id="return_btn">
                                return.turn
                            </a>
                            <a class="btn btn-dark m-1" id="doubleScreen_btn">
                                double.screen
                            </a>
                            <a class="btn btn-dark m-1" id="singleScreen_btn"> 
                                single.screen
                            </a>
                            <a class="btn btn-dark m-1" id="screenShot_btn">
                                screenshots
                            </a>
                        </div>

                        <div>
                            <span>Auto:</span>
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
                            <label>
                                <input type="checkbox" id="enabel_auto_call" value="Y"
                                       style="vertical-align: middle;" ${au_ck} ${au_dis} /> 
                            </label>

                        </div>
                    </div>
                    <div id="pause_icon" style="display:none" class="col-12 m-4">
                        <img src="./img/icon/pause-128-black.png" class="img-fluid mx-auto d-block">
                    </div>
                </div>
                <div  id="scrollDiv" class="col-12 col-md-3 pt-2">
                    <ul id="biz_list_" class=" list-group ">

                    </ul>
                </div>
            </div>
            <div>
                <%@include file="addon/footer.jsp" %>
            </div>

        </div>
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
       // basePath = "http://<%=request.getLocalAddr() %>:8888/server/";
        basePath = getPath().base;
        //loginUrl = "http://<%=request.getLocalAddr() %>:8888/Qcall/";
        loginUrl= getPath().login;
        evalType = '${eval_type}';
        autoDeal = '${auto_deal}';
        autoDeal = autoDeal === '' ? 0 : autoDeal;
        autoCallTime = '${auto_call_time}';
        autoCallTime = autoCallTime === '' ? 10 : autoCallTime;
        autoCallTime = autoCallTime * 1000;
        call_wait_time = "${call_wait_time}" === "" ? 0 : '${call_wait_time}';
        call_wait_time = call_wait_time * 1;
        fvts_client_tag = '${fvts_client_tag}';
        enableEval = "${enable_eval}";
        userId = "${userId}";
        record_items = "${record_items}";
        timeoutSec = '${eval_timeout}';
        timeoutSec = timeoutSec === '' ? 5 : timeoutSec;
        evalLevel = "${evalLevel}";
        machineAccount_tag = "${machine_account}";
        luruGZL_tag = "${DEAL_WITH_NSR}";
        pauseSubItem = "${pasue_subitem}";
        branchId = "${branchId}";
        showTransferConfirm = "${SHOW_TRANSFER_CONFIRM}";

        $("#scrollDiv").Scroll({line: 1, speed: 1000, timer: 5000});
        //$('.menu a[id!="stopMenuA"]').bind('click', select_menu);
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

    function open_ticket_win() {
        var pars = "branchId=${branchId}&areaId=${areaids}";
        var tik_url = basePath+"/client/ticket.do?guide=seat&" + pars;
        window.open(tik_url, "_ticket_win", "height=650, width=1024, toolbar= no, menubar=no, scrollbars=no, resizable=no, location=no, status=no,left=100,top=20");
    }
</script>
