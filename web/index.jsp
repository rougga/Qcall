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
    <body>
        <form action="Login" method="POST">
            <input type="text" id="username"/>
            <input type="password" id="password"/>
            <input type="hidden" id="branchId"/>
            <input type="hidden" id="windowText" value="Guichet 11"/>
            <input type="hidden" id="rand" value="0.5296503275708613"/>
            <select id="window">
                <option value="f75d14bf06c54197a7cc3552e598ee4c">Guichet 11</option>
            </select>
            <button type="button" id="submit">GO</button>
        </form>
    </body>
    <script>
        $(document).ready(function() {
            $("#submit").on('click',function() {
                var url="http://localhost:8888/server/client/login";
                var par ={};
                par.username=$("#username").val();
                par.password=$("#password").val();
                par.branchId=$("#branchId").val();
                par.windowText=$("#windowText").val();
                par.rand=$("#rand").val();
                par.window=$("#window").val();
                
                
                $.post(url,par,function(data) {
                    if(data.indexOf("login_center")>=0){
                        console.log("FAIL !!");
                    }else{
                        console.log("Connected");
                        //$.post("./ChangeStatus",{status:1,username:username},function(data) {
                           // window.location="./home.jsp";
                       //});
                    }
                });
                
                
            });
        });
    </script>
</html>
