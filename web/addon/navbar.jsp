<%@page import="java.util.Objects"%>
<nav class="navbar navbar-expand-lg navbar-dark " style="background-color: #004F2D;">
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
                    <b id="userInfo">${user}</b>
                </a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                    <a class="dropdown-item font-weight-bold navHover disabled" href="" >Paramètres</a>
                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item font-weight-bold navHover" href="javascript:void(0);" id="logOut">
                        Déconnexion
                    </a>
                </div>
            </li>

        </ul>
    </div> 
</nav>
