
<%@page import="main.CfgHandler"%>
<footer>
    <a target="_blank" href="https://www.marocnst.ma/">CopyRight &COPY; <%= CfgHandler.YEAR + " " + CfgHandler.CLIENT %></a>
    <p><%= CfgHandler.APP + " v" + CfgHandler.VERSION%></p>
</footer>
<div class="modal fade" id="settingsModal" tabindex="-1" aria-labelledby="settingsModalLabel" aria-hidden="true">
    <div class="modal-dialog ">
        <div class="modal-content text-white" style="background-color: #508CA4">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Les Paramètres</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="ip">Host (IP):</label>
                    <input type="text" id="ip" class="form-control" placeholder="0.0.0.0"/>
                </div>
                <div class="form-group">
                    <label for="port">Port:</label>
                    <input type="number" id="port" class="form-control" min="1"/>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-success" id="settingsSaveBtn">Sauvegarder</button>
                <button type="button" class="btn btn-danger" data-dismiss="modal" id="settingsCloseBtn">Fermer</button>
            </div>
        </div>
    </div>
</div>