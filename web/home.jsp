<%@page import="java.util.Objects"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
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
        <link href="./css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
        <link href="./css/body.css" rel="stylesheet" type="text/css"/>
        <script src="./js/lib/bootstrap.bundle.min.js"></script>
        <script src="./js/home.js"></script>
    </head>
    <body>
        <div class="container-md">
            <div class="head ">
                <%@include file="./addon/navbar.jsp" %>
            </div>
            <div class="body col-12 col-md-6 rounded mx-auto mt-4 pt-4 ">
                <div>
                    <h1 class="text-center">Num. : <span class="text-white font-weight-bold" id="ticket_state_bar">-----</span></h1>
                    <h2 class="text-center">En attente:<span class="text-white" id="waiting">--</span></h2>
                    <div>
                        <h3>Service: </h3>
                        <select class="form-control">
                            <option>Service</option>
                        </select>
                    </div>
                    <h3 id="timer_">-- </h3>
                </div>
                <div>
                    <a class="btn btn-lg btn-primary m-2" href="#" id="reCall_btn">Recall</a>
                    <a class="btn btn-lg btn-danger m-2" href="#">Absente</a>
                    <a class="btn btn-lg btn-warning m-2" href="#">Pause ||</a>
                    <a class="btn btn-lg btn-success m-2"  id="call_btn">Suivant ></a> 
                </div>
            </div>
            <div>
                
            </div>
        </div>
    </body>
</html>
