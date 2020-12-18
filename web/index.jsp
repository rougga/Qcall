<%@page import="java.sql.SQLException"%>
<%@page import="java.sql.ResultSet"%>
<%@page import="main.PgConnection"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="icon" type="image/png" href="./img/favicon-32x32.png">
        <script src="./js/lib/jquery.js"></script>
        <link href="./css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
        <script src="./js/lib/bootstrap.bundle.min.js"></script>
        <title>Connexion</title>
    </head>
    <body class="bg-dark">
        <div class="container-md ">
            <div>
                <a href="javascript:void(0);"><img src="img/setting.png"/></a> 
            </div>
            <div class="col-12 col-md-6 mx-auto">
                <h1 class="text-center text-white">MY YOUSSEF</h1>
                <h4 class="text-white">Connexion:</h4>
                <form action="Login" method="POST" class="form text-white">
                    <div class="form-group">
                        <label for="username"><img src="img/user.png" alt=""/> Utilisateur:</label>
                        <input type="text" id="username" class="form-control"/>
                    </div>
                    <div class="form-group">
                        <label for="password"><img src="img/pass.png" alt=""/> Mot de passe:</label>
                        <input type="password" id="password" class="form-control"/>
                    </div>
                    <div class="form-group">
                        <label for="window"><img src="img/guichet.png" alt=""/> Guichet:</label>
                        <select id="window" class="form-control form-control-lg">
                            <%
                                try{
                        
                                PgConnection con = new PgConnection();
                                ResultSet r = con.getStatement().executeQuery("select id,name,win_number,status from t_window order by win_number;");
                                while(r.next()){
                                    if(r.getInt("status")==1){
                            %>

                            <option value="<%=r.getString("id")%>" label="<%=r.getString("name")%>"><%=r.getString("name")%></option>
                            <%
                        }
                    }
                    } catch (ClassNotFoundException | SQLException ex) {
            
                    }
                            %>

                        </select>
                    </div>
                    <input type="hidden" id="branchId" class="form-control"/>
                    <input type="hidden" id="windowText" value="Guichet 11" class="form-control"/>
                    <button type="button" id="submit" class="btn btn-primary btn-lg float-right"><img src="img/login.png"/> Connexion</button>
                </form>
            </div>
            <div>
                <%@include file="addon/footer.jsp" %>
            </div>
        </div>

    </body>
    <script>
        $(document).ready(function() {
            var ip = "192.168.1.103";
            var port ="8989";
            $("#submit").on('click',function() {
                
                var url="http://"+ip+":8888/server/client/login";
                var par ={};
                par.username=$("#username").val();
                par.password=$("#password").val();
                par.branchId=$("#branchId").val();
                par.windowText=$("#window option:selected").html();
                par.rand=Math.random();
                par.window=$("#window").val();
                
                
                $.post(url,par,function(data) {
                    if(data.indexOf("login_center")>=0){
                        console.log("FAIL !!");
                    }else{
                        console.log("Connected");
                        par.status=1;
                        $.post("./ChangeStatus",par,function(data) {
                            window.location="./home.jsp";
                       });
                    }
                });
                
                
            });
        });
    </script>
</html>
