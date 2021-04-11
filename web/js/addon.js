let setTasks = function () {
    let ids = [];
    let pars3 = {};
    pars3.tid = getTidFromCookie();
    $('input[name="task"]:checked').each(function () {
        pars3.id_task = $(this).val();
        pars3.qte = $(this).parent("div").find(".qte").val();

        $.ajax({
            url: './SetTaskToTicket',
            type: 'post',
            data: pars3,
            success: function (r) {
                console.log(pars3);
            }
        });
    });
};
