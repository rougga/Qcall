function getPath() {
    var ipSS = localStorage.getItem("ipSS");
    var portSS = localStorage.getItem("portSS");
    var pathSS = {};
    if (ipSS !== null || portSS !== null) {
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
});
