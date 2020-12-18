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
    <body class="bg-dark">
        <div class="container-md body p-0 h-100">
            <div>
                <%@include file="./addon/navbar.jsp" %>
            </div>

            <div>
                <div class="col-12 col-md-9 mx-auto" >

                    <div class="col-12 p-2">       
                        <a href="javascript:void(0);" onclick="queryTicket();return false;" onfocus="blur()" class="btn btn-secondary">
                            Query
                        </a> 
                        <c:if test='${ENABLE_PICK_BIZ_CALL != "0"}'>
                            <a href="javascript:void(0);" onclick="setBiz();return false;" onfocus="blur()" class="btn btn-secondary"/>
                            Call customize
                            </a> 
                        </c:if>
                        <c:if test='${SET_BIZ_BY_WIN == "yes"}'>
                            <a href="javascript:void(0);" onclick="openSetBizWindow();return false;"
                               onfocus="blur()"  class="btn btn-secondary"/> Setup bus 
                            </a> 
                        </c:if>
                    </div>
                    <div class="col-12 my-4 py-4">
                        <h1 class="text-danger" id="current_ticket"></h1>
                        <h2 id="ticket_state_bar" class="text-danger">---</h2>
                        <span id="nsr_state_bar" style="color:red;"></span>
                    </div>


                    <div class="col-12 p-2">
                        <div id="pause_icon" style="display:none;float:left;vertical-align:bottom;">
                            Pause
                        </div>
                        <a class="btn btn-lg btn-success" id="call_btn"/> 
                        Call
                        </a>
                        <a class="btn btn-secondary" id="reCall_btn"/> 
                        additional
                        </a>
                        <a class="btn btn-danger" id="abandonCall_btn"/> 
                        abandonment
                        </a>
                        <a class="btn btn-secondary" id="specialCall_btn"/> 
                        specific
                        </a>
                        <a class="btn btn-primary" id="transfer_btn"/>
                        transfer
                        </a>
                        <a class="btn btn-danger" id="suspend_btn"/>
                        interrupt
                        </a>
                        <a class="btn btn-primary" id="continue_btn"/>
                        continue
                        </a>
                        <a class="btn btn-lg btn-success" id="start_btn"/>
                        start
                        </a>
                        <a class="btn btn-danger" id="abandon_btn"/>
                        give.up>
                        </a>
                        <a class="btn btn-lg btn-success" id="finish_btn"/>
                        complete
                        </a>
                        <a class="btn btn-warning" id="return_btn"/>
                        return.turn
                        </a>
                        <a class="btn btn-secondary" id="doubleScreen_btn"/>
                        double.screen
                        </a>
                        <a class="btn btn-secondary" id="singleScreen_btn"/> 
                        single.screen
                        </a>
                        <a class="btn btn-secondary" id="screenShot_btn"/>
                        screenshots
                        </a>
                    </div>
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




                    <h2>
                        Timer ：
                        <span style="color:red;display:none" id="timer_"></span>
                        <span style="color:red;" id="timer_mask">--</span>
                    </h2>



                    <div  id="scrollDiv">
                        <ul id="biz_list_" class=" list-group ">

                        </ul>
                    </div>
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
        basePath = "http://192.168.1.103:8888/server/";
        //basePath = getPath().base;
        loginUrl = "http://192.168.1.103:8888/Qcall/";
        //loginUrl= getPath().login;
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

    function getPath(){
        var ipSS = localStorage.getItem("ipSS");
        var portSS = localStorage.getItem("portSS");;
        var pathSS = {};
        if(!ipSS){
            pathSS.base = "http://"+ipSS+":"+portSS+"/server/";
            pathSS.login = "http://"+ipSS+":"+portSS+"/Qcall/";
            pathSS.mng = "http://"+ipSS+":"+portSS+"/mng/";
            return pathSS;
        }else{
         console.log("open setting dialog");   
        }
    }

    
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
