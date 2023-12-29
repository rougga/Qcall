<%@page contentType="text/html" pageEncoding="UTF-8"%>
<nav class="navbar navbar-expand-lg navbar-dark " style="background-color: #0A8754;">
    <a class="navbar-brand" href="#">
        <img src="./img/fav.png" width="30" height="30" alt="">
  </a>
    </a>

    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
        <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="collapsibleNavbar">
        <ul class="navbar-nav mr-auto">
            <li class="nav-item active" id="home">
                <a class="nav-link font-weight-bold" href="/Qcall/home.jsp">
                    <span class="fas fa-home font-weight-bold"></span> Accueil
                </a>
            </li>

            <li class="nav-item" id="topics">
                <a class="nav-link font-weight-bold" href="">
                    <span class="far fa-file-alt"></span> Aide
                </a>
            </li> 
        </ul>

        <ul class="navbar-nav mr-auto">
            <li class="nav-item" >
                <span class="nav-link font-weight-bold secondary-color-disabled" id="navDate">Lundi 22/12/2023</span> 
            </li>

            <li class="nav-item mr-4" >
                <span class="nav-link font-weight-bold secondary-color " id="navTime">00:00</span> 
            </li>

            <li class="nav-item" >
                <div class="toggle-darkmode d-flex align-items-center">
                    <img src="./img/icon/sun-24.png" />
                    <input type="checkbox" id="toggle-switch" />
                    <label for="toggle-switch"><span class="screen-reader-text">Toggle Color Scheme</span></label>
                    <img src="./img/icon/moon-2-24.png" />
                </div>
            </li> 
        </ul>

        <ul class="navbar-nav">
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle active" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <b id="userInfo">${userName}</b>
                    @
                    <small id="windowNameNavDisplay">${SEAT_WINSTR}</small>
                    <img src="./img/icon/online.png" id="statusImg"/>
                </a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                    <a href="javascript:void(0);" onclick="queryTicket();return false;" class="dropdown-item font-weight-bold appHover">
                        <img src="./img/icon/history.png"/> Historique
                    </a> 
                    <a href="#" onfocus="blur()" class="dropdown-item font-weight-bold appHover " data-toggle="modal" data-target="#setCostumModal"/>
                    <img src="./img/icon/random.png"/> Appel spécifique

                    </a> 
                    <a href="javascript:void(0);" onclick="openSetBizWindow();return false;"
                       onfocus="blur()"  class="dropdown-item font-weight-bold appHover disabled"/>
                    <img src="./img/icon/star.png"/> Service
                    </a> 


                    <div class="dropdown-divider"></div>
                    <div class="dropdown-item font-weight-bold   d-flex justify-content-between">
                        <img src="./img/icon/autoCall-16.png"/>
                        <span class="font-weight-bold  rounded" style="height: 30px;">Appel auto:</span>
                        <input type="checkbox" id="enabel_auto_call" value="Y" class=""
                               style="width: 30px;height: 30px;" /> 
                    </div>


                    <div class="dropdown-divider"></div>

                    <a class="dropdown-item font-weight-bold  appHover" href="javascript:void(0);" id="settingsBtn" ><img src="./img/icon/setting-black.png"/> Paramètres</a>

                    <div class="dropdown-divider"></div>

                    <a class="dropdown-item font-weight-bold appHover" href="javascript:void(0);" onclick="setOnline();return false;">
                        <img src="./img/icon/online.png"/> Enligne
                    </a>
                    <a class="dropdown-item font-weight-bold appHover" href="javascript:void(0);" onclick="setStop();return false;">
                        <img src="./img/icon/pause.png"/> Pause
                    </a>
                    <a class="dropdown-item font-weight-bold appHover" href="javascript:void(0);" onclick="setLogoff(0);return false;">
                        <img src="./img/icon/logout.png"/> Déconnexion
                    </a>
                </div>
            </li>

        </ul>
    </div> 
    <script>
        // dark mode switch
        $("#toggle-switch").on("change", function () {
            if (this.checked) {
                $(".body").addClass("dark-mode");
            } else {
                $(".body").removeClass("dark-mode");
            }
        });
        let timeUpdater = setInterval(updateTime(), 500);
        function updateTime() {
            let currentdate = new Date().toLocaleTimeString('fr', {
                hour: "numeric",
                minute: "numeric"});
            $("#navTime").text(currentdate);
            currentdate = new Date().toLocaleDateString()
            $("#navDate").text(currentdate);
        }
    </script>
</nav>


<c:if test='${ENABLE_PICK_BIZ_CALL != "0"}'>

</c:if>
<c:if test='${SET_BIZ_BY_WIN != "yes"}'>

</c:if>