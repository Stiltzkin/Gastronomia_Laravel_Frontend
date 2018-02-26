// menu drop down nao some quando clickar dentro dele
$('.dropdown-menu input, .dropdown-menu label, #search-btn').click(function(e) {
    e.stopPropagation();
});

// garante que ao selecionar ingredientes, o get dos ingredientes seja feito
function getIngredientes() {
    for (var i = 0; i < listArray.length; i++) {
        if (listArray[i].key == "listUndiadeMedida") {
            var listUnidadeMedida = listArray[i].value;
        }
        if (listArray[i].key == "listIngrediente") {
            var listIngrediente = listArray[i].value;
        }
    }

    if (document.getElementById('filterIng').checked) {
        if (typeof jsonIngrediente === 'undefined' || typeof jsonUnidade === 'undefined') {
            $.getJSON(listIngrediente, function(jsonObjectIngrediente) {
                jsonIngrediente = jsonObjectIngrediente.data;
                $.getJSON(listUnidadeMedida, function(jsonObjectUnidade) {
                    jsonUnidade = jsonObjectUnidade;
                    search();
                })
            })
        }
    } else {
        search();
    }
}

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

    if (typeof jsonReceita === 'undefined' || typeof jsonCategoria === 'undefined' || typeof jsonClassificacao === 'undefined') {
        $.getJSON(listReceita, function(jsonObjectReceitas) {
            jsonReceita = jsonObjectReceitas.data;
            $.getJSON(listClassificacao, function(jsonObjectClassificacao) {
                jsonClassificacao = jsonObjectClassificacao.data;
                $.getJSON(listCategoria, function(jsonObjectCategoria) {
                    jsonCategoria = jsonObjectCategoria.data;
                    search();
                })
            })
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

        // ============ Busca Ingredientes ============ //
        if (document.getElementById('filterIng').checked) {
            // limpa a thead da pesquisa passada
            $('.thead_busca').remove();

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

            $.each(jsonIngrediente, function(index, value) {
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

                    $.each(jsonUnidade, function(indexUnidade, valUnidade) {
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

            for (var i = 0; i < jsonReceita.length; i++) {
                var valueUpper = jsonReceita[i].nome_receita.toUpperCase();
                if (upper == '') {
                    return;
                }
                if (valueUpper.startsWith(upper)) {
                    // cria uma lista
                    var htmlIngList = $('<tr class="searchList" data-id="' + jsonReceita[i].id_receita + '"></tr>');
                    $('<td><a href="#" class="hipertextColor" >' + jsonReceita[i].nome_receita + '</a></td>').appendTo(htmlIngList);
                    for (var j = 0; j < jsonClassificacao.length; j++) {
                        if (jsonReceita[i].id_classificacao == jsonClassificacao[j].id_classificacao) {
                            $('<td><a href="#" class="hipertextColor" >' + jsonClassificacao[j].descricao_classificacao + '</a></td>').appendTo(htmlIngList);
                        }
                    }

                    for (var k = 0; k < jsonCategoria.length; k++) {
                        if (jsonReceita[i].id_categoria == jsonCategoria[k].id_categoria) {
                            $('<td><a href="#" class="hipertextColor" >' + jsonCategoria[k].descricao_categoria + '</a></td>').appendTo(htmlIngList);
                        }
                    }

                    $('<td><button class="editar">Editar</button></td>').appendTo(htmlIngList);
                    $('<td><button type="button" class="btn btn-xs btn-danger excluir"><i class="fa fa-trash"></i></button></td>').appendTo(htmlIngList)
                    $('.htmlIngList').append(htmlIngList);
                }
            }
        }
    }
}

$('#search-btn').on('click', function() {
    if (document.getElementById('filterRec').checked) {
        $.getJSON(listReceita, function(jsonObjectReceitas) {
            jsonReceita = jsonObjectReceitas;
            search();
        })
    }
    if (document.getElementById('filterIng').checked) {
        $.getJSON(listIngrediente, function(jsonObjectIngrediente) {
            jsonIngrediente = jsonObjectIngrediente;
            search();
        })
    }
})