if (sessionStorage.getItem("url") !== null) {
  for (var i = 0; i < listArray.length; i++) {
    if (listArray[i].key == "listUndiadeMedida") {
      var listUnidadeMedida = listArray[i].value;
    }
  }
  var jsonUnidade;
  $.getJSON(listUnidadeMedida, function(unidadeObject) {
    jsonUnidade = unidadeObject.data;
  })

  // Editar receita
  var url = sessionStorage.getItem("url");

  var receitaSpecifica;
  $.getJSON(listUnidadeMedida, function(jsonObjectUnidade) {
    jsonUnidade = jsonObjectUnidade.data;
    $.getJSON(url, function(showReceita) {
      receitaSpecifica = showReceita.data;

      idData = receitaSpecifica.id_receita;
      main(jsonUnidade, receitaSpecifica);
      sessionStorage.clear();
    })
  })

}

function main(jsonUnidade, receitaSpecifica) {
  // === autofill header === //
  var header = '<h1>Editar ' + receitaSpecifica.nome_receita + '</h1>'
  $('.content-header').html(header);

  // === autofill nome_receita === //
  var nome = '<input type="text" class="form-control" name="nome_receita" id="inputReceita" placeholder="Nome da Receita" value="' + receitaSpecifica.nome_receita + '">';
  $('#nome').html(nome);

  // === autoset classificacao/categoria === //
  setTimeout(function() {
    $('#classificacao').val(receitaSpecifica.id_classificacao).trigger('change');
    $('#categoria').val(receitaSpecifica.id_categoria).trigger('change');
  }, 200);

  // === autofill modo_de_preparo === //
  var ed = receitaSpecifica.modo_preparo_receita;
  CKEDITOR.instances['editor'].setData(ed);
  // nicEditors.findEditor('area1').setContent(ed);

  // === autofill ingredientes === ///
  var htmlDelIngButton = '<td class="botao-excluir"><button type="button" class="excluir">Excluir</button></td>';

  var pivot = receitaSpecifica.pivot;
  for (var i = 0; i < pivot.length; i++) {
    var htmlListIngredientes = $('<tr data-id="' + pivot[i].id_ingrediente + '"></tr>');
    $('<td class="info-nome"><input hidden="" type="text" name="ingredienteId" value="' + pivot[i].id_ingrediente + '"><p>' + pivot[i].nome_ingrediente + '</p></td>').appendTo(htmlListIngredientes);
    $('<td class="info-quantidade"><input hidden="" class="qtdIngrediente" type="text" name="quantidade_ingrediente" value="' + pivot[i].pivot.quantidade_bruta_receita_ingrediente + '"><p>' + pivot[i].pivot.quantidade_bruta_receita_ingrediente + '</p></td>').appendTo(htmlListIngredientes);

    for (var j = 0; j < jsonUnidade.length; j++) {
      if (jsonUnidade[j].id_unidade_medida == pivot[i].id_unidade_medida) {
        $('<td class="info-unidade"><p>' + jsonUnidade[j].simbolo_unidade_medida + '</p></td>').appendTo(htmlListIngredientes);
      }
    }

    $(htmlDelIngButton).appendTo(htmlListIngredientes);

    // joga na tela
    $(htmlListIngredientes).appendTo('.lista_ingredientes');

    // receitaArray é criado em validacao_receitas_da_aula.js para não poder incluir receita ja incluso na aula
    ingredienteArray.push((pivot[i].id_ingrediente).toString());
  }

  // === Altera botao SALVAR -> EDITAR === //
  var btnEditar = '<button type="button" onclick="CKupdate(); updateReceita()" class="btn btn-success col-md-1 col-md-offset-5">Editar</button>'
  $('.box-center').html(btnEditar);
}

function CKupdate() {
  for (instance in CKEDITOR.instances)
    CKEDITOR.instances[instance].updateElement();
}