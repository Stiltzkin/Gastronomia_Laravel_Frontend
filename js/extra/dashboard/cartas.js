$(document).ready(function() {
  // var listArray = listArray();

  for (var i = 0; i < listArray.length; i++) {
    if (listArray[i].key == "listAula") {
      var listAula = listArray[i].value;
    }
    if (listArray[i].key == "listIngrediente") {
      var listIngrediente = listArray[i].value;
    }
  }
  var jsonAula, jsonIngrediente;
  var urlNames = ["listAula", "listIngrediente"];
  var urlValues = [listAula, listIngrediente];

  // $.when(validaToken()).done(function() {
  $.when(getAjax(urlNames[0], urlValues[0]), getAjax(urlNames[1], urlValues[1])).done(function(jsonAula, jsonIngredientes) {
    calculaValores(jsonAula, jsonIngredientes);

  })
  // })
})

function calculaValores(jsonAula, jsonIngredientes) {
  // ========== Cartas Aulas ==========
  var countAulasCriadas, countAulasAgendadas;
  // contadores
  var j = 0;
  var k = 0;

  var htmlAulasCriadas = '<h3>0</h3>';
  var htmlAulasAgendadas = '<h3>0</h3>';
  for (var i = 0; i < jsonAula.length; i++) {
    if (jsonAula[i].aula_agendada == 0) {
      j++
      htmlAulasCriadas = '<h3>' + j + '</h3>';
    }
    if (jsonAula[i].aula_agendada == 1 && jsonAula[i].aula_concluida == 0) {
      k++
      htmlAulasAgendadas = '<h3>' + k + '</h3>';
    }
    if (jsonAula[i].aula_agendada == 1 && jsonAula[i].aula_concluida == 1 && i == 0) {
      htmlAulasAgendadas = '<h3>' + i + '</h3>';
    }
  }

  $('.numAulasCriadas').html(htmlAulasCriadas + "<p>Total de Aulas Planejadas</p>");
  $('.numAulasAgendadas').html(htmlAulasAgendadas + "<p>Total de Aulas Agendadas</p>");

  // ========== Carta Valor Estoque ==========
  var valorEstoque = 0
  $.each(jsonIngredientes, function(indexIngredientes, valIngredientes) {
    var valorIngrediente = parseFloat(valIngredientes.valor_ingrediente);
    var qtdIngrediente = parseFloat(valIngredientes.quantidade_estoque_ingrediente);
    var valTotalIngrediente = valorIngrediente * qtdIngrediente;

    valorEstoque = valorEstoque + valTotalIngrediente;
  })
  htmlValorEstoque = '<h3>R$ ' + valorEstoque + '</h3>';
  $('.valorEstoque').html(htmlValorEstoque + "<p>Valor do Estoque</p>");

}