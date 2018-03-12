$('.aulas').on('click', '.botaoAulaConcluida', function() {
  idData = $(this).closest("tr").data("id");
  load_url();
  var urlData = concluirAula;

  swal({
      title: "Conclur esta aula?",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "lightblue",
      confirmButtonText: "Concluir!",
      closeOnConfirm: false,
    },
    function() {
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
        error: function(response) {
          swal({
              title: "Erro",
              type: "error",
              confirmButtonText: "Ok",
              confirmButtonColor: "#DD6B55",
            },
            function() {
              location.reload(true);
            }
          )
        }
      })
    }
  )
});