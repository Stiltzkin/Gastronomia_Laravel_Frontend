// =========== AGENDAR AULA =========== //
$('#addAula').on('click', '#agendarButton', function() {
  limpaMensagens();
  idData = $('#form_addAula').find('.id_aula').val();
  load_url();
  var aulaSerialized = $('#form_addAula').serializeArray();
  var aulaReceitasSerialized = $('#form_aula_receitas').serializeArray();
  var receitasOrganizadas = organizaAulaReceita(aulaSerialized, aulaReceitasSerialized);

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
    error: function(response) {
      var errosIngrediente = response.responseJSON.erros_ingredientes;
      var errosAula = response.responseJSON.errosAula;

      var ulNode = document.createElement("ul");

      for (var i = 0; i < errosIngrediente.length; i++) {
        var liNode = document.createElement("li");
        var textNode = document.createTextNode(errosIngrediente[i]);

        liNode.appendChild(textNode);
        document.getElementById("mensagens-erro-aula").appendChild(liNode);
      }
    }
  });
});

function organizaAulaReceita(aulaSerialized, aulaReceitasSerialized) {
  var id = 0;

  for (var i = 0; i < aulaReceitasSerialized.length; i++) {
    if (i % 2 == 0) {
      aulaSerialized.push({
        name: 'receitas[' + id + '][id_receita]',
        value: aulaReceitasSerialized[i].value
      });
      aulaSerialized.push({
        name: 'receitas[' + id + '][quantidade_receita]',
        value: aulaReceitasSerialized[i + 1].value
      });
      id++;
    }
  }
  return aulaSerialized;
}

// ============== DESAGENDAR AULA ============ //
$(".aulas").on("click", ".botaoDesagendarAula", function() {
  idData = $(this).closest("tr").data("id");
  load_url();
  urlData = desagendarAula;

  swal({
      title: "Desagendar esta aula?",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "red",
      confirmButtonText: "Desagendar!",
      closeOnConfirm: false,
    },
    function() {
      $.ajax({
        type: "POST",
        url: urlData,
        success: function() {
          swal({
              title: "Aula Desagendada com sucesso.",
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
            type: response.responseJSON.message,
            confirmButtonText: "Ok",
            confirmButtonColor: "#DD6B55",
          })
        }
      })
    })
})