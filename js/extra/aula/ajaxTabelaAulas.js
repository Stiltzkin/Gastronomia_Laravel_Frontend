// ==================== GET ===================== //

for (var i = 0; i < listArray.length; i++) {
  if (listArray[i].key == "listAula") {
    var listAula = listArray[i].value;
  }
  if (listArray[i].key == "listReceita") {
    var listReceita = listArray[i].value;
  }
  if (listArray[i].key == "listPeriodo") {
    var listPeriodo = listArray[i].value;
  }
}

var jsonAula, jsonPeriodo, jsonReceita;
var urlNames = ["listAula", "listReceita", "listPeriodo"];
var urlValues = [listAula, listReceita, listPeriodo];

// if (typeof(sessionStorage.getItem("jsonAula")) === undefined || sessionStorage.getItem("jsonAula") == null || typeof(sessionStorage.getItem("jsonReceita")) == undefined || sessionStorage.getItem("jsonReceita") == null || typeof(sessionStorage.getItem("jsonAula")) == undefined || sessionStorage.getItem("jsonPeriodo") == null) {
// $.when(validaToken()).done(function() {
$.when(getAjax(urlNames[0], urlValues[0]), getAjax(urlNames[1], urlValues[1]), getAjax(urlNames[2], urlValues[2])).done(function(jsonAula, jsonReceita, jsonPeriodo) {
  getTabela(jsonAula, jsonReceita, jsonPeriodo);

  // sessionStorage.setItem("jsonReceita", jsonReceita);
  // sessionStorage.setItem("jsonAula", jsonAula);
  // sessionStorage.setItem("jsonPeriodo", jsonPeriodo);
})
// })
// } else {
//   jsonAula = sessionStorage.getItem("jsonAula");
//   jsonReceita = sessionStorage.getItem("jsonReceita");
//   jsonPeriodo = sessionStorage.getItem("jsonPeriodo");
//   getTabela(jsonAula, jsonReceita, jsonPeriodo);
// }



function getTabela(jsonAula, jsonReceita, jsonPeriodo) {

  // geração de botoes
  var botaoExcluir = '<td><button type="button" class="btn btn-xs btn-danger excluir"><i class="fa fa-trash"></i></button></td>';
  var botaoEditar = '<td><button class="btn btn-xs editar" type="button"><i class="fa fa-edit"></i></button></td>';
  var botaoAgendarAula = '<td><button class="botaoAgendarAula" type="button">Agendar Aula</button></td>';
  var botaoDesagendarAula = '<td><button class="botaoDesagendarAula" type="button">Desagendar Aula</button></td>';
  var botaoAulaConcluida = '<td><button class="botaoAulaConcluida" type="button">Aula Concluida</button></td>';
  var botaoDetalhes = '<td><button type="button" class="btn btn-xs botaoDetalhes"><i class="fa fa-eye"></i></button></td>';

  // chamado em xunxo.js
  var jsonAulaReceita = pivotAula(jsonAula, jsonPeriodo);

  $.each(jsonAula, function(indexAula, valAula) {
    for (var i = 0; i < jsonAulaReceita.length; i++) {
      // conta o numero de receitas na aula

      var countReceitas = jsonAulaReceita[i].receitas.length;
      if (countReceitas == 0 || typeof(countReceitas) === 'undefined') {
        countReceitas = 0;
      }

      if (valAula.id_aula == jsonAulaReceita[i].id_aula) {
        // cria a 'tr' de cada aula para ficar em formato de lista
        var htmlList = $('<tr class="id-aula" data-id="' + valAula.id_aula + '"></tr>');

        // cria as 'td' com os valores da aula E joga as 'td' dentro da 'tr' htmlList (<tr><td>  </td></tr>)
        $('<td hidden class="id_aula">' + valAula.id_aula + '</td>').appendTo(htmlList);
        $('<td class="nome_aula">' + valAula.nome_aula + '</td>').appendTo(htmlList);
        $('<td class="descricao_aula">' + valAula.descricao_aula + '</td>').appendTo(htmlList);
        $('<td class="dia_da_aula">' + valAula.data_aula + '</td>').appendTo(htmlList);
        $('<td class="periodo">' + jsonAulaReceita[i].periodo_aula + '</td>').appendTo(htmlList);
        $('<td class="num_receitas">' + countReceitas + '</td>').appendTo(htmlList);

        // joga os botoes detalhes e excluir dentro da 'tr'
        $(botaoDetalhes).appendTo(htmlList);

        // se aula_agendada = false, a aula NAO ESTA agendada
        if (valAula.aula_agendada == false) {
          $(botaoExcluir).appendTo(htmlList);
          $(botaoEditar).appendTo(htmlList);
          $(botaoAgendarAula).appendTo(htmlList);
          $(htmlList).appendTo('.listaAulasPlanejadas');
        }
        // se aula_agendada = true, aula ESTA AGENDADA
        if (valAula.aula_agendada == true && valAula.aula_concluida == false) {
          $('<td><button type="button" class="btn btn-xs btn-danger excluir_concluida"><i class="fa fa-trash"></i></button></td>').appendTo(htmlList);
          $(botaoDesagendarAula).appendTo(htmlList);
          $(botaoAulaConcluida).appendTo(htmlList);
          $(htmlList).appendTo('.listaAulasAgendadas');
        }
        // se aula_agendada = true E se aula_concluida = true, aula ESTA CONCLUIDA
        if (valAula.aula_agendada == true && valAula.aula_concluida == true) {
          // .aulaConcluidaList esta localizado em aulas-concluidas.html
          $(botaoExcluir).appendTo(htmlList);
          $(htmlList).appendTo('.aulaConcluidaList');
        }
      }
    }
  })
}

// ===================== POST PUT ===================== //
$('#addAula').on('click', '#saveButton', function() {
  // var formAula = $('#form_addAula');

  // pega id da aula (se vazio = POST, se tem algo = PUT)
  idData = $('#form_addAula').find('.id_aula').val();
  load_url();
  var aulaSerialized = $('#form_addAula').serializeArray();
  var aulaReceitasSerialized = $('#form_aula_receitas').serializeArray();

  var receitasOrganizadas = organizaAulaReceita(aulaSerialized, aulaReceitasSerialized);

  if (idData == 0 || typeof(idData) === 'undefined') {
    var urlData = createAula;
  } else {
    var urlData = updateAula;
  }

  // $.when(validaToken()).done(function() {
  postAjax(receitasOrganizadas, urlData);
  // })
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

// ===================== DELETE ===================== //
$('.aulas').on('click', '.excluir_concluida', function() {
  var thisTr = $(this).closest('tr');
  idData = thisTr.data('id');

  deletarAula(thisTr, idData);
})

$('.aulas').on('click', '.excluir', function() {
  var thisTr = $(this).closest('tr');
  idData = thisTr.data('id');

  deletarAula(thisTr, idData);
})

function deletarAula(thisTr, idData) {
  load_url();

  swal({
      title: "Tem certeza que deseja deletar esta aula?",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Deletar!",
      closeOnConfirm: false,
    },
    function() {
      // $.when(validaToken()).done(function() {
      postAjax(null, deleteAula);
      // })
    }
  );
}


// === === === === === == CLONAR AULA === === === === === === == //
$('#verAula').on('click', '.clonar', function() {
  idData = $(this).closest('.modal-body').find('.receitasQuantidade').find('tr').data('id');
  load_url();

  // $.when(validaToken()).done(function() {
  postAjax(null, clonarAula);
  // })
})