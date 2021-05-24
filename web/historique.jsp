<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.List"%>
<%@page import="java.sql.ResultSet"%>
<%@page import="main.PgConnection"%>
<%@page import="java.util.ArrayList"%>
<%@page import="java.util.Date"%>
<%@ taglib uri = "http://java.sun.com/jsp/jstl/core" prefix = "c" %>
<%!
    public String getFormatedTime(Float Sec) {
        int hours = (int) (Sec / 3600);
        int minutes = (int) ((Sec % 3600) / 60);
        int seconds = (int) (Sec % 60);
        return String.format("%02d:%02d:%02d", hours, minutes, seconds);
    }

%>
<%
    String[] cols = new String[]{ "Service", "Numéro", "Heure edition ticket", "Heure appel", "Heure début de traitement", "Heure fin traitement", "Guichet", "Employé", "Durée attente", "Durée traitement", "Statut"};
        
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        String date1 = format.format(new Date());
        String date2 = format.format(new Date());
        List<ArrayList<String>> table2 = new ArrayList<>();
        String SQL = "SELECT  "
                + "b.name as service, "
                + "t.ticket_id, "
                + "to_char(t.ticket_time,'DD-MM-YYYY HH24:MI:SS') as ticket_time, "
                + "to_char(t.call_time,'DD-MM-YYYY HH24:MI:SS') as call_time, "
                + "to_char(t.start_time,'DD-MM-YYYY HH24:MI:SS') as start_time, "
                + "to_char(t.finish_time,'DD-MM-YYYY HH24:MI:SS') as finish_time, "
                + "w.name guichet, "
                + "u.name username, "
                + "DATE_PART('epoch'::text, t.call_time - t.ticket_time)::numeric as da, "
                + "DATE_PART('epoch'::text, t.finish_time - t.start_time)::numeric as dt, "
                + "t.status "
                + "from t_ticket t "
                + "left join t_biz_type b on t.biz_type_id=b.id "
                + "left join t_window w on t.deal_win=w.id "
                + "left join t_user u on t.deal_user=u.id "
                + "where to_date(to_char(t.ticket_time,'YYYY-MM-DD'),'YYYY-MM-DD')  BETWEEN TO_DATE('" + date1 + "','YYYY-MM-DD') AND TO_DATE('" + date2 + "','YYYY-MM-DD') and t.call_time is not null"
                + ";";
        try{
        PgConnection con = new PgConnection();
        ResultSet r = con.getStatement().executeQuery(SQL);
        while (r.next()) {
            ArrayList row = new ArrayList();
            row.add(r.getString("service"));
            row.add(r.getString("ticket_id"));
            row.add(r.getString("ticket_time"));
            row.add(r.getString("call_time"));
            row.add(r.getString("start_time"));
            row.add(r.getString("finish_time"));
            row.add(r.getString("guichet"));
            row.add(r.getString("username"));
            row.add(getFormatedTime(r.getFloat("da")));
            row.add(getFormatedTime(r.getFloat("dt")));
            String stat = "";
            switch (r.getString("status")) {
                case "0":
                    stat = "<span class='text-center text-white bg-secondary p-1'>En Attente</span>";
                    break;
                case "1":
                    stat = "<span class='text-center text-white bg-primary p-1'>En Appel</span>";
                    break;
                case "2":
                    stat = "<span class='text-center text-white bg-warning text-dark p-1'>Absent</span>";
                    break;
                case "3":
                    stat = "<span class='text-center text-white bg-info p-1'>En traitement</span>";
                    break;
                case "4":
                    stat = "<span class='text-center text-white bg-success p-1'>Traité</span>";
                    break;
                case "5":
                    stat = "<span class='text-center text-white bg-danger p-1'>Interrupt</span>";
                    break;
                case "6":
                    stat = "<span class='text-center text-white bg-danger p-1'>Abnormal ticket</span>";
                    break;
                case "7":
                    stat = "<span class='text-center text-white bg-danger p-1'>No sign of WeChat</span>";
                    break;
                case "8":
                    stat = "<span class='text-center text-white bg-danger p-1'>Failure of verification</span>";
                    break;
            }
            row.add(stat);
            table2.add(row);
        }

        con.closeConnection();
        }
        catch(Exception e){%>
            <%= e.getMessage() %><%
        }
  
    
%>

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


                <h2 class="text-center p-4">Historique :</h2>

                <table class="table table-light table-bordered table-striped  table-responsive" style="font-size: 0.7em;">
                    <a class="float-right btn btn-link text-white" id="plus">PLUS >></a>
                    <thead class="text-white" style="background-color: #0A8754;">
                        <tr class="">
                            <c:forEach var="col" items="<%=cols%>" varStatus="status">
                                <th class="col  text-wrap text-center align-middle"><c:out value="${col}"/></th>
                                </c:forEach>
                        </tr>
                    </thead>
                    <tbody  class="font-weight-bold ">

                        <%
                            if (table2!= null && table2.size()>0) {
                                for (int i = 0; i < table2.size(); i++) {
                        %>
                        <tr class="db1 ">
                                <% for (int j = 0; j < table2.get(i).size(); j++) {%>
                            <td class="text-center border-dark <%= j + 1%>" class=""><%= table2.get(i).get(j)%></td>
                            <%}%>
                        </tr>
                        <%
                                }
                            }
                        %>


                    </tbody>
                </table>

            </div>
        </div>
    </body>
</html>
