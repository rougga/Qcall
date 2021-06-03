function getPath() {
    var ipSS = localStorage.getItem("ipSS");
    var portSS = localStorage.getItem("portSS");
    var pathSS = {};
    if (ipSS !== null && portSS !== null) {
        pathSS.base = "http://" + ipSS + ":" + portSS + "/server/";
        pathSS.login = "http://" + ipSS + ":" + portSS + "/Qcall/";
        pathSS.mng = "http://" + ipSS + ":" + portSS + "/mng/";
        return pathSS;
    } else {
        $('#settingsModal').modal('toggle');
    }
}

function getIp() {
    return $("#ip").val();
}
function getPort() {
    return $("#port").val();
}
function setIp(ip) {
    $("#ip").val(ip);
}
function setPort(port) {
    $("#port").val(port);
}
function saveDataFromModal() {
    localStorage.setItem("ipSS", getIp());
    localStorage.setItem("portSS", getPort());
    console.log(`IP: ${getIp()} PORT: ${getPort()}`);
}
function loadDataToModal() {
    var ipSS = localStorage.getItem("ipSS");
    var portSS = localStorage.getItem("portSS");
    setIp(ipSS);
    setPort(portSS);
}

let taskInit = function (el) {
    if ($(el).find("input[type=checkbox]").prop('checked')) {
        $(el).find("input[type=checkbox]").prop('checked', false);
        $(el).find(".qte").val(0);
    } else {
        $(el).find("input[type=checkbox]").prop('checked', true);
        $(el).find(".qte").val(1);
    }
};
let checkTask = function (el) {
    if ($(el).prop('checked')) {
        $(el).parent("div").find(".qte").val(1);
    } else {
        $(el).parent("div").find(".qte").val(0);
    }
};
$(document).ready(function () {
    $("#settingsBtn").on('click', function () {
        loadDataToModal();
        $('#settingsModal').modal('toggle');
    });
    $("#settingsSaveBtn").on('click', function () {
        saveDataFromModal();
        $('#settingsModal').modal('toggle');
    });
    $("#settingsCloseBtn").on('click', function () {
        console.log(getPath());
    });
    $("#setCostumService").click(function () {
        let serviceId = $("#serviceDialog").val();
        $('#setCostumModal').modal('toggle');
        setBiz(serviceId);
    });
    $("#transBtn").click(function () {
        let t = $("#serviceDialogTrans").val();
        if (t == undefined || t == '') {
            alert('Please select a business transfer !');
            return;
        }
        let p = false;
        if ($('#pro_').attr('checked') == 'checked') {
            p = true;
        }
        var pars = {"type": "bizTrans", "id": t, "priority": p};
        $('#transModal').modal('toggle');
        transfer(undefined,false,pars);
    });
});
