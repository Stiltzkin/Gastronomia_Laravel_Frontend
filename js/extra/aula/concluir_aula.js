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
      // $.when(validaToken()).done(function() {
      postAjax(null, urlData);
      // })
    }
  )
});