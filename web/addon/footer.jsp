
<!-- Modal -->
<div class="modal fade" id="settings" tabindex="-1" aria-labelledby="settingsModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Les Paramètres</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form action="./Settings" method="POST">
                    <div class="form-group">

                        <label for="exampleInputEmail1">Cible (Moyenne d'attente) :</label>
                        <div class="form-row">
                            <div class="col">
                                <input type="number" class="form-control" id="" name="cibleAH" placeholder="Hr" min="0">
                            </div>
                            <div class="col">
                                <input type="number" class="form-control" id="" name="cibleAM" placeholder="Min" min="0" >
                            </div>
                            <div class="col"><input type="number" class="form-control" id="" name="cibleAS" placeholder="Sec" min="0" >
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="exampleInputPassword1">Cible (Moyenne de traitement):</label>
                        <div class="form-row">
                            <div class="col"> 
                                <input type="number" class="form-control" id="" name="cibleTH" placeholder="Hr" min="0">
                            </div>
                            <div class="col"> 
                                <input type="number" class="form-control" id="" name="cibleTH"  placeholder="Min" min="0">
                            </div>
                            <div class="col">
                                <input type="number" class="form-control" id="" name="cibleTH"  placeholder="Sec" min="0">
                            </div>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-success">Sauvegarder</button>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger" data-dismiss="modal">Fermer</button>
            </div>
        </div>
    </div>
</div>