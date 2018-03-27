// menu drop down nao some quando clickar dentro dele
$('.dropdown-menu input, .dropdown-menu label, #search-btn').click(function(e) {
  e.stopPropagation();
});

$('#search-btn').on('click', function() {
  if (document.getElementById('filterRec').checked) {
    for (var i = 0; i < listArray.length; i++) {
      if (listArray[i].key == "listReceita") {
        var listReceita = listArray[i].value;
      }
    }

    var jsonReceita;
    var urlNames = ["listReceita"];
    var urlValues = [listReceita];

    // $.when(getAjax(urlNames[0], urlValues[0])).done(function(jsonReceita) {
    search(jsonReceita);
    // })
  }

  if (document.getElementById('filterIng').checked) {
    for (var i = 0; i < listArray.length; i++) {
      if (listArray[i].key == "listIngrediente") {
        var listIngrediente = listArray[i].value;
      }
    }

    var jsonIngrediente;
    var urlNames = ["listIngrediente"];
    var urlValues = [listIngrediente];

    // $.when(getAjax(urlNames[0], urlValues[0])).done(function(jsonIngrediente) {
    search(jsonIngrediente);
    // })
  }
})

// chamado no html
// garante que ao selecionar ingredientes, o get dos ingredientes seja feito
function getIngredientes() {
  for (var i = 0; i < listArray.length; i++) {
    if (listArray[i].key == "listUnidadeMedida") {
      var listUnidadeMedida = listArray[i].value;
    }
    if (listArray[i].key == "listIngrediente") {
      var listIngrediente = listArray[i].value;
    }
  }

  var jsonUnidade, jsonIngrediente;
  var urlNames = ["listIngrediente", "unidade"];
  var urlValues = [listIngrediente, listUnidadeMedida];

  if (sessionStorage.getItem("jsonIngrediente") == null || sessionStorage.getItem("jsonUnidade") == null) {
    $.when(getAjax(urlNames[0], urlValues[0]), getAjax(urlNames[1], urlValues[1])).done(function(jsonIngrediente, jsonUnidade) {
      sessionStorage.setItem("jsonIngrediente", JSON.stringify(jsonIngrediente));
      sessionStorage.setItem("jsonUnidade", JSON.stringify(jsonUnidade));
    })
  }
}

// chamado no html
// garante que ao selecionar receitas, o get das receitas seja feito
function getReceitas() {
  for (var i = 0; i < listArray.length; i++) {
    if (listArray[i].key == "listReceita") {
      var listReceita = listArray[i].value;
    }
    if (listArray[i].key == "listCategoria") {
      var listCategoria = listArray[i].value;
    }
    if (listArray[i].key == "listClassificacao") {
      var listClassificacao = listArray[i].value;
    }
  }

  var jsonReceita, jsonCategoria, jsonClassificacao;
  var urlNames = ["listReceita", "listCategoria", "listClassificacao"];
  var urlValues = [listReceita, listCategoria, listClassificacao];

  if (sessionStorage.getItem("jsonReceita") == null || sessionStorage.getItem("jsonCategoria") == null || sessionStorage.getItem("jsonClassificacao") == null) {
    $.when(getAjax(urlNames[0], urlValues[0]), getAjax(urlNames[1], urlValues[1]), getAjax(urlNames[2], urlValues[2])).done(function(jsonReceita, jsonCategoria, jsonClassificacao) {
      sessionStorage.setItem("jsonReceita", JSON.stringify(jsonReceita));
      sessionStorage.setItem("jsonCategoria", JSON.stringify(jsonCategoria));
      sessionStorage.setItem("jsonClassificacao", JSON.stringify(jsonClassificacao));
    })
  }
}

function search() {
  // limpa a lista
  $('.searchList').remove();

  if (document.getElementById('myInput').value == "") {
    // se o campo de busca estiver vazio, mostra conteudo prnicipal ...
    var reciclaHtml = document.getElementById('conteudo_principal');
    reciclaHtml.style.display = 'block';
    // ... e esconde o search
    var mostraSearch = document.getElementById('listaSearch');
    mostraSearch.style.display = 'none';
  } else {
    // se nao estiver vazio, esconde conteudo prnicipal ...
    var reciclaHtml = document.getElementById('conteudo_principal');
    reciclaHtml.style.display = 'none';
    // ... e mostra o seaerch
    var mostraSearch = document.getElementById('listaSearch');
    mostraSearch.style.display = 'block';
  }

  // ============ Busca Ingredientes ============ //
  if (document.getElementById('filterIng').checked) {
    // limpa a thead da pesquisa passada
    $('.thead_busca').remove();

    var json_1 = JSON.parse(sessionStorage.getItem("jsonIngrediente"));
    var json_2 = JSON.parse(sessionStorage.getItem("jsonUnidade"));

    // Header da tabela
    var headerIng = '<h3 class="box-title ">Ingredientes</h3>';
    $('.search_header').html(headerIng);

    // Cria a thead da tabela
    var htmlThead = $('<tr class="thead_busca"></tr>');
    $('<th>Ingrediente</th>').appendTo(htmlThead);
    $('<th>Calorias em 100g</th>').appendTo(htmlThead);
    $('<th>Aproveitamento</th>').appendTo(htmlThead);
    $('<th>Valor Total do Ingrediente</th>').appendTo(htmlThead);
    $('<th>Qtd Atual</th>').appendTo(htmlThead);
    $('<th>Unidade</th>').appendTo(htmlThead);
    $('<th></th>').appendTo(htmlThead);
    $('<th></th>').appendTo(htmlThead);
    $('<th></th>').appendTo(htmlThead);
    $('<th></th>').appendTo(htmlThead);
    // imprime a thead na tela
    $('.htmlHead').html(htmlThead);

    var input, upper;
    // Pega o valor digitado
    input = $('#myInput').val();
    // deixa o valor digitado em caixa alta (para nao ficar case sensitive)
    upper = input.toUpperCase();

    // criando botoes adicionar e subtrair
    var botaoAdd = '<td><button type="button" class="btn btn-xs addButton"><i class="fa fa-plus"></i></button></td>';
    var botaoSubtract = '<td><button type="button" class="btn btn-danger btn-xs subButton"><i class="fa fa-minus"></i></button></td>';

    $.each(json_1, function(index, value) {
      var valueUpper = value.nome_ingrediente.toUpperCase();
      if (upper == '') {
        return;
      }
      if (valueUpper.startsWith(upper)) {
        // cria uma lista
        var htmlIngList = $('<tr data-id="' + value.id_ingrediente + '" class="searchList" > < /tr>');
        $('<td><a href="#" class="hipertextColor" >' + value.nome_ingrediente + '</a></td>').appendTo(htmlIngList);
        $('<td>' + value.quantidade_calorica_ingrediente + '</td>').appendTo(htmlIngList);
        $('<td>' + value.aproveitamento_ingrediente + '</td>').appendTo(htmlIngList);
        $('<td>' + value.valor_ingrediente + '</td>').appendTo(htmlIngList);
        $('<td>' + value.quantidade_estoque_ingrediente + '</td>').appendTo(htmlIngList);

        $.each(json_2, function(indexUnidade, valUnidade) {
          if (valUnidade.id_unidade_medida == value.id_unidade_medida) {
            $('<td>' + valUnidade.simbolo_unidade_medida + '</td>').appendTo(htmlIngList);
          }
        })

        $(botaoAdd).appendTo(htmlIngList);
        $(botaoSubtract).appendTo(htmlIngList);
        $('<td><button class="editar">Editar</button></td>').appendTo(htmlIngList);
        $('<td><button type="button" class="btn btn-xs btn-danger excluir_ing"><i class="fa fa-trash"></i></button></td>').appendTo(htmlIngList)
        $('.htmlIngList').append(htmlIngList);
      }
    })
  }

  // ============ Busca Receitas ============ //
  if (document.getElementById('filterRec').checked) {
    // limpa a thead da pesquisa passada
    $('.thead_busca').remove();

    var json_1 = JSON.parse(sessionStorage.getItem("jsonReceita"));
    var json_2 = JSON.parse(sessionStorage.getItem("jsonCategoria"));
    var json_3 = JSON.parse(sessionStorage.getItem("jsonClassificacao"));

    // Header da tabela
    var headerRec = '<h3 class="box-title ">Receitas</h3>';
    $('.search_header').html(headerRec);

    // Cria a thead da tabela
    var htmlThead = $('<tr class="thead_busca"></tr>');
    $('<th>Receita</th>').appendTo(htmlThead);
    $('<th>Classificação</th>').appendTo(htmlThead);
    $('<th>Categoria</th>').appendTo(htmlThead);
    $('<th></th>').appendTo(htmlThead);
    $('<th></th>').appendTo(htmlThead);
    $('<th></th>').appendTo(htmlThead);
    // imprime a thead na tela
    $('.htmlHead').html(htmlThead);


    var input, upper;
    // limpa a lista
    $('.searchList').remove();
    // Pega o valor digitado
    input = $('#myInput').val();
    // deixa o valor digitado em caixa alta (para nao ficar case sensitive)
    upper = input.toUpperCase();

    for (var i = 0; i < json_1.length; i++) {
      var valueUpper = json_1[i].nome_receita.toUpperCase();
      if (upper == '') {
        return;
      }
      if (valueUpper.startsWith(upper)) {
        // cria uma lista
        var htmlIngList = $('<tr class="searchList" data-id="' + json_1[i].id_receita + '"></tr>');
        $('<td><a href="#" class="hipertextColor" >' + json_1[i].nome_receita + '</a></td>').appendTo(htmlIngList);
        for (var j = 0; j < json_3.length; j++) {
          if (json_1[i].id_classificacao == json_3[j].id_classificacao) {
            $('<td><a href="#" class="hipertextColor" >' + json_3[j].descricao_classificacao + '</a></td>').appendTo(htmlIngList);
          }
        }

        for (var k = 0; k < json_2.length; k++) {
          if (json_1[i].id_categoria == json_2[k].id_categoria) {
            $('<td><a href="#" class="hipertextColor" >' + json_2[k].descricao_categoria + '</a></td>').appendTo(htmlIngList);
          }
        }

        $('<td><button class="editar">Editar</button></td>').appendTo(htmlIngList);
        $('<td><button type="button" class="btn btn-xs btn-danger excluir"><i class="fa fa-trash"></i></button></td>').appendTo(htmlIngList)
        $('.htmlIngList').append(htmlIngList);
      }
    }
  }
}