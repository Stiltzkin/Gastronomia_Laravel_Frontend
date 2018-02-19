$('#addAula').on('click', '#agendarButton', function() {
    idData = $('#form_addAula').find('.id_aula').val();
    load_url();
    var aulaSerialized = $('#form_addAula').serializeArray();

    var urlData = agendarAula;
    $.ajax({
        type: "POST",
        url: urlData,
        dataType: "json",
        data: aulaSerialized,
        success: function() {
            swal({
                    title: "Aula agendada com sucesso.",
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