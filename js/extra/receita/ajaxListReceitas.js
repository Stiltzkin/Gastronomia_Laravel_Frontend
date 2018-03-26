// ==================== GET ===================== //
for (var i = 0; i < listArray.length; i++) {
  if (listArray[i].key == "listReceita") {
    var listReceita = listArray[i].value;
  }
  if (listArray[i].key == "listIngrediente") {
    var listIngrediente = listArray[i].value;
  }
  if (listArray[i].key == "listUnidadeMedida") {
    var listUnidadeMedida = listArray[i].value;
  }
  if (listArray[i].key == "listClassificacao") {
    var listClassificacao = listArray[i].value;
  }
  if (listArray[i].key == "listCategoria") {
    var listCategoria = listArray[i].value;
  }
}

var tipo = "receita";
// chamado em paginate.js
var urlShowReceitas = getUrl(tipo);

var paginate, jsonIngrediente, jsonUnidade, jsonClassificacao, jsonCategoria;
var urlNames = ["receita_paginate", "listIngrediente", "unidade", "listClassificacao", "listCategoria"];
var urlValues = [urlShowReceitas, listIngrediente, listUnidadeMedida, listClassificacao, listCategoria];

// $.when(validaToken()).done(function() {
$.when(getAjax(urlNames[0], urlValues[0]), getAjax(urlNames[1], urlValues[1]), getAjax(urlNames[2], urlValues[2]), getAjax(urlNames[3], urlValues[3]), getAjax(urlNames[4], urlValues[4])).done(function(paginate, jsonIngrediente, jsonUnidade, jsonClassificacao, jsonCategoria) {
  var jsonPaginateReceita = paginate.data;
  mostraReceitas(jsonIngrediente, jsonUnidade, jsonClassificacao, jsonCategoria, jsonPaginateReceita);

  //chamado em paginate.js
  salvaUrlPaginas(paginate);
  botoesPaginacao(paginate);

  window.gjsonPaginateReceita = jsonPaginateReceita;
  window.gjsonUnidade = jsonUnidade;
  window.gjsonCategoria = jsonCategoria;
  window.gjsonClassificacao = jsonClassificacao;
})
// })

// ================== LISTAR RECEITAS =================== // Ok
function mostraReceitas(jsonIngrediente, jsonUnidade, jsonClassificacao, jsonCategoria, jsonPaginateReceita) {

  for (var i = 0; i < jsonPaginateReceita.length; i++) {
    load_url();

    var row = $('<tr class="id-receita" data-id="' + jsonPaginateReceita[i].id_receita + '"></tr>');
    var buttonEdit = '<td><button type="button" class="btn btn-xs editReceita"><i class="fa fa-edit"></i></button></td>';
    var buttonDelete = '<td><button type="button" id="buttonDeletar" class="btn btn-danger btn-xs excluir" ><i class="fa fa-trash-o"></i></button></td>';
    var buttonView = '<td><button type="button" class="btn btn-default btn-xs visualizar"><i class="fa fa-eye" aria-hidden="true"></i></span></button></td>';

    $("#tableReceitas").append(row); //this will append tr element to table... keep its reference for a while since we will add cels into it
    row.append($('<td><a href="#" onclick=onclickDetalhes(this)>' + jsonPaginateReceita[i].nome_receita + '</a></td>'));
    //createReceita + jsonReceita[i].id_receita
    for (var j = 0; j < jsonClassificacao.length; j++) {
      if (jsonPaginateReceita[i].id_classificacao == jsonClassificacao[j].id_classificacao) {
        row.append($("<td>" + jsonClassificacao[j].descricao_classificacao + "</td>"));
      }
    }

    for (var k = 0; k < jsonCategoria.length; k++) {
      if (jsonPaginateReceita[i].id_categoria == jsonCategoria[k].id_categoria) {
        row.append($("<td>" + jsonCategoria[k].descricao_categoria + "</td>"));
      }
    }
    row.append(buttonEdit);
    row.append(buttonDelete);
    row.append(buttonView);
  }
}

// ===================== DELETE RECEITAS ===================== // Ok
$('.lista-receita').on('click', '#buttonDeletar', function() {
  // seleciona a 'tr' da receita especifico
  var thisTr = $(this).closest('tr');
  // pega a id da receita localizado no html
  idData = thisTr.data('id');
  excluir_receita(idData, thisTr);
});

$('#search').on('click', '.excluir', function() {
  // seleciona a 'tr' do ingrediente especifico
  var thisTr = $(this).closest('tr');
  // pega a id do ingrediente localizado no html
  idData = thisTr.data('id');
  excluir_receita(idData, thisTr);
})

function excluir_receita(idData, thisTr) {
  load_url();
  swal({
      title: "Tem certeza que deseja deletar este Receita?",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Deletar!",
      closeOnConfirm: false,
    },
    function() {
      // $.when(validaToken()).done(function() {
      postAjax(null, deleteReceita);
      // })
    }
  )
}

// ============== VISUALIZAR RECEITA DETALHES =================== //
$(".lista-receita").on('click', '.visualizar', function() {
  $("#ingredientesList").empty();
  var thisTr = $(this);

  if (typeof(window.gjsonUnidade) === undefined || window.gjsonUnidade == null || typeof(window.gjsonPaginateReceita) === undefined || window.gjsonPaginateReceita == null) {
    var paginate, jsonUnidade;
    var urlNames = ["receita_paginate", "unidade"];
    var urlValues = [urlShowReceitas, listUnidadeMedida];

    // $.when(validaToken()).done(function() {
    $.when(getAjax(urlNames[0], urlValues[0]), getAjax(urlNames[1], urlValues[1])).done(function(paginate, jsonUnidade) {
      var jsonPaginateReceita = paginate.data;
      mostraDetalhesReceita(jsonPaginateReceita, jsonUnidade, thisTr);
    })
    // })
  } else {
    var jsonPaginateReceita = window.gjsonPaginateReceita;
    var jsonUnidade = window.gjsonUnidade;
    mostraDetalhesReceita(jsonPaginateReceita, jsonUnidade, thisTr);
  }

  function mostraDetalhesReceita(jsonPaginateReceita, jsonUnidade, thisTr) {
    var id_receita = thisTr.closest('tr').data('id');
    // sessionStorage.setItem('this_receita', id_receita);
    for (var i = 0; i < jsonPaginateReceita.length; i++) {
      if (id_receita == jsonPaginateReceita[i].id_receita) {
        var pivot = jsonPaginateReceita[i].pivot;
        for (var j = 0; j < pivot.length; j++) {
          var id = jsonPaginateReceita[i].pivot[j].pivot.id_ingrediente;
          load_url();

          var tr = $('<tr id="listaIngredientes" data-id=" + id + "></tr>');
          var nome_ingrediente = "<td>" + jsonPaginateReceita[i].pivot[j].nome_ingrediente + "</td>";
          var quantidade_ingrediente = "<td>" + jsonPaginateReceita[i].pivot[j].pivot.quantidade_bruta_receita_ingrediente + "</td>";

          for (k = 0; k < jsonUnidade.length; k++) {
            if (jsonUnidade[k].id_unidade_medida == jsonPaginateReceita[i].pivot[j].id_unidade_medida) {
              var unidade = "<td>" + jsonUnidade[k].simbolo_unidade_medida + "</td>";
            }
          }

          $(nome_ingrediente).appendTo(tr);
          $(quantidade_ingrediente).appendTo(tr);
          $(unidade).appendTo(tr);
          $('#ingredientesList').append(tr);
        }
      }
    }
    $("#receitaId").modal('show');
  }
});

function onclickDetalhes(estaReceita) {
  var id_receita = $(estaReceita).closest('tr').data('id');
  sessionStorage.setItem('id_receita', id_receita);

  window.location.href = 'http://localhost:80/Gastronomia_Frontend/html/receita-detalhes.html';
}