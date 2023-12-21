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
        <link href="./css/index.css" rel="stylesheet" type="text/css"/>
        <script src="./js/lib/bootstrap.bundle.min.js"></script>
        <script src="./js/script.js"></script>
        <script src="./js/login.js"></script>
        <title>Connexion</title>
    </head>
    <body class="bg-dark">
        <div class="container-md ">
            <div class="alert alert-danger alert-dismissible fade show m-4" role="alert" id="err">
                <strong id="errText"></strong>
                <button type="button" class="close" id="errClose" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="col-12 col-md-6 mx-auto mt-4 bg-dark pb-1 rounded">
                <h1 class="text-center text-white"><img src="img/qcall.png" class="img-fluid"/></h1>
                <h4 class="text-white">Connexion:</h4>
                <form action="Login" method="POST" class="form text-white">
                    <div class="form-group">
                        <label for="username"><img src="img/user.png" alt=""/> Utilisateur:</label>
                        <input type="text" id="username" class="form-control p-4"/>
                    </div>
                    <div class="form-group">
                        <label for="password"><img src="img/pass.png" alt=""/> Mot de passe:</label>
                        <input type="password" id="password" class="form-control p-4"/>
                    </div>
                    <div class="form-group">
                        <label for="window"><img src="img/guichet.png" alt=""/> Connecté temporairement à Guichet: </label>
                            <%
                                try {

                                    PgConnection con = new PgConnection();
                                    ResultSet r = con.getStatement().executeQuery("select id,name,win_number,status from t_window where status = 1 order by win_number;");
                                    if (r.next()) {
                            %>

                            <input value="<%=r.getString("id")%>" type="hidden" id="window"/>
                            <span class="badge badge-pill badge-info"><%=r.getString("name")%></span>
                            <input type="hidden" id="windowText" value="<%=r.getString("name")%>"/>
                            <%

                                }
                            } catch (ClassNotFoundException | SQLException ex) {
                            %> <script>console.log("SERVER: <%= ex.getMessage()%>");</script> <%
                                }
                            %>
                    </div>
                    <input type="hidden" id="branchId" class="form-control"/>
                    <div class="form-group">
                        <button type="button" id="submit" class="btn bg-costum btn-lg text-white"><img src="img/login.png" alt=""/> Connexion</button>
                        <a href="#" id="settingsBtn" class="btn btn-secondary mx-2 btn-lg "><img src="img/setting.png" alt=""/></a>

                    </div>
                    
                </form>
            </div>
            <div>
                <%@include file="addon/footer.jsp" %>
            </div>
        </div>

    </body>
</html>
