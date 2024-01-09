<%@page import="java.sql.SQLException"%>
<%@page import="java.sql.ResultSet"%>
<%@page import="org.apache.jasper.tagplugins.jstl.core.ForEach"%>
<%@page import="ma.rougga.nst.modal.Service"%>
<%@page import="java.util.ArrayList"%>
<%@page import="ma.rougga.nst.controller.ServiceController"%>
<%@page import="main.PgConnection"%>
<%@page import="java.net.InetAddress"%>
<%@page import="java.util.Objects"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ taglib uri = "http://java.sun.com/jsp/jstl/core" prefix = "c" %>
<%
    if (Objects.equals(session.getAttribute("status"), "0")) {
        response.sendRedirect("./index.jsp");
    }
    ArrayList<Service> services = null;
%>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <title><%= CfgHandler.APP %> - Console</title>
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
        <script src="./js/addon.js"></script>
        <script type="text/javascript">
            var windowId = "${windowId}";
            var userId = "${userName}";
            var pauseCount = "${pauseCount}";
            var ip = "${ip}";
            let pp = "${pp}";
            let windowName = "${SEAT_WINSTR}";
            window.win_quit = function () {
                setLogout();
            };
            var eval_tool_fac = "${eval_tool_fac}";
        </script>
    </head>
    <body >
        <div class="container-xl body p-0 min-vh-100">
            <div>
                <%@include file="./addon/navbar.jsp" %>
            </div>
            <div class="alert alert-danger alert-dismissible fade show" role="alert" id="err">
                <strong id="errText"></strong>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="d-md-flex">
                <div id="console" class="col-12 col-md-9 p-2 m-0">
                    <div class="col-12 p-0 rounded border border-dark" id="displayPanel">
                        <!-- Dropdown to select a window to call the tickets to -->
                        <div class="col-12 d-flex p-2 justify-content-center">

                            <label for="windowSelectForCall" id="reminderWindowSelect" data-toggle="popover" data-trigger="focus" data-placement="top" data-content="Choisissez un guichet !!" class="mr-1 font-weight-bold text-center align-items-center"><img src="img/desktop-2-24.png" alt=""/> Quichet:</label>
                            <select id="windowSelectForCall" class="col-8" class="form-control form-control-lg align-items-center">
                                <option value='' selected disabled >Choisissez un guichet ...</option>
                                <%
                                    try {

                                        PgConnection con = new PgConnection();
                                        ResultSet r = con.getStatement().executeQuery("select id,name,win_number,status from t_window where status=1 order by win_number;");
                                        while (r.next()) {
                                            if (r.getInt("status") == 1) {
                                %>

                                <option value="<%=r.getString("id")%>" data-name="<%=r.getString("name")%>" data-number="<%=r.getInt("win_number")%>"><%=r.getString("name")%></option>
                                <%
                                        }
                                    }
                                } catch (ClassNotFoundException | SQLException ex) {
                                %> <script>console.log("SERVER: <%= ex.getMessage()%>");</script> <%
                                    }
                                %>

                            </select>
                            <div class="spinner-border text-secondary" role="status" id="guichetLoadIcon">
                                <span class="sr-only">Loading...</span>
                            </div>
                        </div>
                    </div>
                    <!<!-- comment -->
                    <h1 class="text-dark text-center font-weight-bolder" id="current_ticket"></h1>
                    <!<!-- comment -->
                    <h2 id="ticket_state_bar" class="text-dark text-center">---</h2>
                    <!<!-- comment -->
                    <h4 id="nsr_state_bar" class="text-center text-dark"></h4>
                    <!<!-- comment -->
                    <h4 id="ticket_time" class="text-dark text-center">---</h4>
                    <!-- Time counter -->
                    <h2 class="text-center">
                        Compteur ：
                        <span style="display:none" id="timer_" class="text-danger text-center font-digital"></span>
                        <span id="timer_mask" class="text-danger text-center font-digital">00:00</span>
                    </h2>
                    <!-- Total deal count -->
                    <h5 class="text-dark text-center ">Totale Traité: <span id="todayUserDeal">0</span></h5>
                    <!-- Dropdown to select service to call tickets to -->
                    <div class="col-12 d-flex p-2 justify-content-center">

                        <label for="serviceId" class="mr-1 font-weight-bold text-center align-items-center text-secondary"><img src="img/services-24.png" alt=""/> Service:</label>
                        <select id="serviceId" class="col-8" class="form-control form-control-lg align-items-center">
                            <option value="0">Tous les services accessibles</option>
                            <%
                                try {

                                    PgConnection con = new PgConnection();
                                    ServiceController sc = new ServiceController(con.getStatement());
                                    services = sc.getAll();
                                    for (Service service : services) {
                                        if (service.getStatus() == 1) {
                            %>

                            <option value="<%=service.getId()%>" label="<%= service.getName()%>"><%=service.getName()%></option>
                            <%
                                    }
                                }
                            } catch (Exception ex) {
                            %> <script>console.log("SERVER: <%= ex.getMessage()%>");</script> <%
                                }
                            %>
                        </select>
                    </div>
                    <div class="col-12 p-0 pt-2" id="controlPanel">
                        <div id="otherBtn" class="w-100">

                            <!-- Deal State -->

                            <div class="d-flex">
                                <!-- Pause -->
                                <a class="btn btn-dark text-white  px-0 py-2  mx-auto " onclick="setStop();return false;" style="width: 33%"> 
                                    <img src="./img/icon/pause-16-white.png" class="pb-1 m-0"/> Pause
                                </a>
                                <a class="btn bg-costum text-white  px-0 py-2  mx-auto " id="reCall_btn" style="width: 33%"> 
                                    <img src="./img/icon/clipboard-16-white.png" class="pb-1 m-0"/> Additional
                                </a>
                                <!-- deconnexion -->
                                <a class="btn btn-dark text-white  px-0 py-2  mx-auto " onclick="setLogoff(0);return false;" style="width: 33%"> 
                                    <img src="./img/icon/logout-16-white.png" class="pb-1 m-0"/> Déconnexion
                                </a>
                            </div>
                            <div class="d-flex">
                                <a class="btn bg-costum text-white  px-0 py-2  m-1 " id="abandon_btn" style="width: 33%">
                                    <img src="./img/icon/giveup.png" class="pb-1 m-0"/> Absent
                                </a>
                                <a class="btn bg-costum text-white  px-0 py-2  m-1 " id="transfer_btn" data-toggle="modal" data-target="#transModal" style="width: 33%">
                                    <img src="./img/icon/trans.png" class="pb-1 m-0"/> Transfer
                                </a>
                                <a class="btn bg-costum text-white  px-0 py-2  m-1 " id="suspend_btn" style="width: 33%">
                                    <img src="./img/icon/interrupt.png" class="pb-1 m-0"/> Interrompre
                                </a>
                            </div>
                            <!-- Call State -->
                            <div class="d-flex">
                                <a class="btn  bg-costum  text-white  px-0 py-2 m-1 disabled" id="abandonCall_btn" style="width: 33%"> 
                                    <img src="./img/icon/recall.png" class="pb-1 m-0"/> Rappel
                                </a>
                                <a class="btn  bg-costum  text-white px-0 py-2  m-1 disabled" id="continue_btn" style="width: 33%">
                                    <img src="./img/icon/continue.png" class="pb-1 m-0"/> Continue
                                </a>
                                <a class="btn bg-costum text-white  px-0 py-2  m-1 disabled"  id="specialCall_btn" style="width: 33%"> 
                                    <img src="./img/icon/pin-16-white.png" class="pb-1 m-0"/> Spécifique
                                </a>
                            </div>
                        </div>

                        <!-- removed step
                        <a class="btn btn-lg bg-costum p-4 text-white border m-2" id="start_btn">
                            <img src="./img/icon/call.png" class="pb-1 m-0"/> Début
                        </a>
                        -->

                        <div id="next" class="w-100">
                            <button class="btn btn-lg bg-costum text-white border w-100 py-4 my-2" id="call_btn">
                                <img src="./img/icon/call.png" class="pb-1 m-0"/> Suivant
                            </button>
                            <a class="btn btn-lg bg-costum text-white border w-100 py-4 my-2" id="finish_btn">
                                <img src="./img/icon/deal.png" class="pb-1 m-0"/> Suivant
                            </a>
                        </div>
                        <div id="tasks" class=" d-flex align-content-center">
                        </div>
                        <!-- 
                        <div class="bg-danger mx-auto d-flex justify-content-center align-content-center">
                            <span class="font-weight-bold text-white p-2 rounded">Appele automatique:</span>
                            
                            <input type="checkbox" id="enabel_auto_call" value="Y" class="mt-1"
                                   style="width: 30px;height: 30px;" ${au_ck} ${au_dis} /> 

                        </div>
                        -->

                    </div>
                    <div id="pause_icon" style="display:none" class="w-100 my-4">
                        <h1 class="text-center">EN PAUSE</h1>
                        <img src="./img/icon/pause-128-black.png" class="img-fluid mx-auto d-block">
                        <a class="btn btn-lg bg-costum text-white border w-100 py-4 my-2" onclick="setOnline();
                                return false;">
                            <img src="img/icon/online.png"/> Online
                        </a>
                    </div>
                </div>
                <div  id="scrollDiv" class="col-12 col-md-3 pt-2">
                    <h6 >Tickets en Attendant: <span  class='badge badge-success bg-costum badge-pill' id="totalTicketWaiting"></span></h6>
                    <ul id="biz_list_" class=" list-group ">

                    </ul>
                </div>
            </div>
            <div>
                <%@include file="addon/footer.jsp" %>
            </div>
            <div>
                <!-- Modal spescific call-->
                <div class="modal fade" id="setCostumModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Appel d'un service spécifique</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <div class="form-group">
                                    <label for="serviceDialog">Service:</label>
                                    <select class="form-control" id="serviceDialog">
                                        <%
                                            for (Service service : services) {

                                                if (service.getStatus() == 1) {
                                        %>

                                        <option value="<%=service.getId()%>" label="<%= service.getName()%>"><%=service.getName()%></option>
                                        <%
                                                }
                                            }
                                        %>
                                    </select>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>
                                <button type="button" class="btn btn-primary" id="setCostumService">Appel</button>
                            </div>
                        </div>
                    </div>

                </div>
                <!-- Modal transfer-->
                <div class="modal fade" id="transModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Transfert: </h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <div class="form-group">
                                    <label for="serviceDialog">Service:</label>
                                    <select class="form-control" id="serviceDialogTrans">
                                        <%
                                            for (Service service : services) {

                                                if (service.getStatus() == 1) {
                                        %>

                                        <option value="<%=service.getId()%>" label="<%= service.getName()%>"><%=service.getName()%></option>
                                        <%
                                                }
                                            }
                                        %> 
                                    </select>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>
                                <button type="button" class="btn btn-primary" id="transBtn">Transférer</button>
                            </div>
                        </div>
                    </div>
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
        //basePath = "http://<%=request.getLocalAddr()%>:8888/server/";
        basePath = getPath().base;
        // loginUrl = "http://<%=request.getLocalAddr()%>:8888/Qcall/";
        loginUrl = getPath().login;
        evalType = '${eval_type}';
        autoDeal = '${auto_deal}';
        autoDeal = autoDeal === '' ? 1 : autoDeal;
        autoCallTime = '${auto_call_time}';
        autoCallTime = autoCallTime === '' ? 4 : autoCallTime;
        autoCallTime = autoCallTime * 1000;
        call_wait_time = "${call_wait_time}" === "" ? 0 : '${call_wait_time}';
        call_wait_time = call_wait_time * 1;
        fvts_client_tag = '${fvts_client_tag}';
        enableEval = "${enable_eval}";
        userId = "${userName}";
        record_items = "${record_items}";
        timeoutSec = '${eval_timeout}';
        timeoutSec = timeoutSec === '' ? 5 : timeoutSec;
        evalLevel = "${evalLevel}";
        machineAccount_tag = "${machine_account}";
        luruGZL_tag = "${DEAL_WITH_NSR}";
        pauseSubItem = "${pasue_subitem}";
        branchId = "${branchId}";
        showTransferConfirm = "${SHOW_TRANSFER_CONFIRM}";
        //$('.menu a[id!="stopMenuA"]').bind('click', select_menu);
        init();
        //seting autoCall checkbox to checked if auto call activated

        $("#alertBox").hide();
        $("#windowSelectForCall").val(windowId);
        // filling service <select>  with services in the window
        updateServiceSelect();
        
        
    <c:if test='${auto_call == "1"}'>
        <c:set var="au_ck" value="checked"></c:set>
        <c:set var="au_dis" value="disabled"></c:set>
        <c:set var="au_title" value="${server.auto.title2}"></c:set>
        $(function () {
            auto_call_tag = true;
            setTimeout(function () {
                var MSG1 = new CLASS_MSN_MESSAGE("autoCallOn", 300, 160, "",
                        "<spring:message code='server.ticket.tip'/> ", "<spring:message code='server.ticket.timeout1'/> <br/><br/><spring:message code='server.ticket.timeout2'/> <span style='color:red'>${auto_call_time==null?10:auto_call_time}S</span><spring:message code='server.ticket.timeout3'/> ", "_blank");
                MSG1.show();
            }, 15000);
            $("#enabel_auto_call").prop("checked", true);
            // $("#enabel_auto_call").prop("disabled", "disabled");
        });
    </c:if>
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
        var tik_url = basePath + "/client/ticket.do?guide=seat&" + pars;
        window.open(tik_url, "_ticket_win", "height=650, width=1024, toolbar= no, menubar=no, scrollbars=no, resizable=no, location=no, status=no,left=100,top=20");
    }

</script>
