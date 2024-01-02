$(document).ready(function () {
    $("#err").hide();
    $("#errClose").on('click', function () {
        $("#err").hide();
    });

    $("#submit").on('click', function () {
        var url = getPath().base + "client/login";
        var par = {};
        par.username = $("#username").val();
        par.password = $("#password").val();
        par.branchId = $("#branchId").val();
        par.windowText = $("#windowText").val();
        par.rand = Math.random();
        par.window = $("#window").val();
        par.host = localStorage.getItem("ipSS");
        par.port = localStorage.getItem("portSS");

        $.post(url, par, function (data) {
            if (data.indexOf("login_center") >= 0) {
                $("#err").show();
                $("#errText").html("L'identifiant ou le mot de passe est incorrect");
                console.log("Connection to pdjh BACKEND IS FAILED!!");
            } else {
                console.log("Connected to pdjh BACKEND, redirecting to home page...");
                par.status = 1;
                $.post("./ChangeStatus", par, function (data) {
                    window.location = "./home.jsp";
                });
            }
        });
    });
});