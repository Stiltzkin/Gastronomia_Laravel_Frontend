$('.aulas').on('click', '.botaoAulaConcluida', function() {
    idData = $('#form_addAula').find('.id_aula').val();
    load_url();
    var urlData = concluirAula;
    $.ajax({
        type: "POST",
        url: urlData,
        success: function() {
            swal({
                    title: "Aula concluida com sucesso.",
                    type: "success",
                },
                function() {
                    location.reload(true);
                }
            )
        },
        error: function(message) {
            swal({
                    title: message,
                    type: "error",
                    confirmButtonText: "Ok",
                    confirmButtonColor: "#DD6B55",
                },
                function() {
                    location.reload(true);
                }
            )
        }
    });
});