function getNowLanguage() {
    var nowLanguage = "fr";
    if (document.cookie != null) {
        var array = document.cookie.split(";");
        for (var i = 0; i < array.length; i++) {
            if (array[i].search("HonyiProLanguage") != -1) {
                var a = array[i].split("=");
                if (a.length > 0) {
                    nowLanguage = a[1];
                }
            }
        }
    }
    return nowLanguage;
}

function initLanguage() {
    var nowLanguage = getNowLanguage();
     nowLanguage = "fr";
    jQuery.i18n.properties({
        name: ['view'], 
        path: 'i18n/i18n/',
        mode: 'map', 
        language: nowLanguage,
        callback: function () {
             //console.log(nowLanguage);
            // alert($.i18n.prop('server.management'))
        }
    });
}

initLanguage();
