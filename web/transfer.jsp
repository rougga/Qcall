<%@page import="ma.rougga.nst.modal.Service"%>
<%@page import="ma.rougga.nst.controller.ServiceController"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.List"%>
<%@page import="java.sql.ResultSet"%>
<%@page import="main.PgConnection"%>
<%@page import="java.util.ArrayList"%>
<%@page import="java.util.Date"%>
<%@ taglib uri = "http://java.sun.com/jsp/jstl/core" prefix = "c" %>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <title>QCall</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="icon" type="image/png" href="./img/favicon-32x32.png">
        <script src="./js/lib/jquery.js"></script>
        <script src="./js/lib/jquery.scroll.js"></script>
        <script src="./js/lib/json2.js"></script>
        <script src="./js/lib/jquery.i18n.properties-1.0.9.js"></script>
        <script src="./js/lib/I18nUtil.js"></script>
        <link href="./css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
        <link href="./css/body.css" rel="stylesheet" type="text/css"/>
        <script src="./js/lib/bootstrap.bundle.min.js"></script>
        <script>
            function trans() {
                var t = $('#serviceDialog').val();
                if (t == undefined || t == '') {
                    alert('Please select a business transfer !');
                    return;
                }
                var p = false;
                if ($('#pro_').attr('checked') == 'checked') {
                    p = true;
                }
                var pars = {"type": "bizTrans", "id": t, "priority": p};
                tran
                window.close();
            }
        </script>
    </head>
    <body>
        <div class="container-fluid p-0">
            <div class="body">
                <%                     if (request.getParameter("err") != "" && request.getParameter("err") != null) {

                %>
                <%= "<div class='alert alert-danger alert-dismissible fade show' role='alert'><b>"
                        + request.getParameter("err")
                        + "</b><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div>"%>
                <%
                    }
                %>


                <h2 class="text-center p-4">Transfert :</h2>
                <select class="form-control" id="serviceDialog">
                    <%
                        try{
                            PgConnection con = new PgConnection();
                            ServiceController sc = new ServiceController(con.getStatement());
                            ArrayList<Service> services = sc.getAll();
                            for (Service service : services){
                                if(service.getStatus()==1){
                    %>

                    <option value="<%=service.getId() %>" label="<%= service.getName() %>"><%=service.getName() %></option>
                    <%
                                }
                            }
                        } catch (Exception  ex) {
                    %> 
                    <p><%= ex.getMessage() %> </p> 
                    <%
                        }
                    %>
                </select>
                <button type="button" class="btn btn-primary" id="transBtn">Transférer</button>

            </div>
        </div>
    </body>
</html>
