<nav class="navbar navbar-expand-lg navbar-dark " style="background-color: #0A8754;">
    <a class="navbar-brand" href="#">Qcall</a>

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


        <ul class="navbar-nav">
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle active" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <b id="userInfo">${userName}</b>
                    @
                    <small>${SEAT_WINSTR}</small>
                    <img src="./img/icon/online.png" id="statusImg"/>
                </a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                    <a href="javascript:void(0);" onclick="queryTicket();return false;" class="dropdown-item font-weight-bold appHover">
                        <img src="./img/icon/history.png"/> Historique
                    </a> 
                    <a href="javascript:void(0);" onclick="setBiz();return false;" onfocus="blur()" class="dropdown-item font-weight-bold appHover"/>
                    <img src="./img/icon/random.png"/> Call customize
                    </a> 
                    <a href="javascript:void(0);" onclick="openSetBizWindow();return false;"
                       onfocus="blur()"  class="dropdown-item font-weight-bold appHover"/>
                    <img src="./img/icon/star.png"/> Service
                    </a> 
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
</nav>
      

                            <c:if test='${ENABLE_PICK_BIZ_CALL != "0"}'>

                            </c:if>
                            <c:if test='${SET_BIZ_BY_WIN != "yes"}'>

                            </c:if>