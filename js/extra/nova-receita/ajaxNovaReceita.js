for (var i = 0; i < listArray.length; i++) {
    if (listArray[i].key == "listReceita") {
        var listReceita = listArray[i].value;
    }
    if (listArray[i].key == "listIngrediente") {
        var listIngrediente = listArray[i].value;
    }
    if (listArray[i].key == "listUndiadeMedida") {
        var listUnidadeMedida = listArray[i].value;
    }
    if (listArray[i].key == "listClassificacao") {
        var listClassificacao = listArray[i].value;
    }
    if (listArray[i].key == "listCategoria") {
        var listCategoria = listArray[i].value;
    }
}

// get Classificacao e Categoria
if (typeof jsonObjectClassificacao === 'undefined' || typeof jsonObjectCategoria === 'undefined') {
    // get da tabela de unidades
    $.getJSON(listClassificacao, function(jsonObjectClassificacao) {
        jsonClassificacao = jsonObjectClassificacao.data;
        $.getJSON(listCategoria, function(jsonObjectCategoria) {
            jsonCategoria = jsonObjectCategoria.data;
            mostraClasseCate();
            dropdownIngredientes();
        })
    })
} else {
    mostraClasseCate();
    dropdownIngredientes();
}



// Monta lista de Classificacao e Categoria
function mostraClasseCate() {
    //$('#select2').find('option').
    for (var i = 0; i < jsonCategoria.length; i++) {
        $('#categoria').append("<option value=" + jsonCategoria[i].id_categoria + ">" + jsonCategoria[i].descricao_categoria + "</option>");
    }
    for (var j = 0; j < jsonClassificacao.length; j++) {
        $('#classificacao').append("<option value=" + jsonClassificacao[j].id_classificacao + ">" + jsonClassificacao[j].descricao_classificacao + "</option>");
    }
}

// POST CATEGORIA // Sem validação
function postCategoria() {
    // seleciona o formulario, vai ser enviado serializado em 'data'
    var form = $('#form-addCategoria').serialize();
    load_url();

    $.ajax({
        type: "POST",
        url: createCategoria,
        dataType: "json",
        data: form,
        success: function() {
            $('.classCategoriaHeader').modal("hide");
            swal({
                    title: "Sucesso!",
                    text: "Categoria criado com sucesso!",
                    type: "success"
                },
                function() {
                    location.reload();
                }
            )
        },
        error: function() {
            $('#mensagens-erro').append('Problemas no cadastro da Categoria');
        }
    });
}


// POST CLASSIFICACAO // Sem validação
function postClassificacao() {
    // seleciona o formulario, vai ser enviado serializado em 'data'
    var form = $('#form-addClassificacao').serialize();
    load_url();

    $.ajax({
        type: "POST",
        url: createClassificacao,
        dataType: "json",
        data: form,
        success: function() {
            $('.classClassificacaoHeader').modal("hide");
            swal({
                    title: "Sucesso!",
                    text: "Classificação criada com sucesso!",
                    type: "success"
                },
                function() {
                    location.reload();
                }
            )
        },
        error: function() {
            $('#mensagens-erro').append('Problemas no cadastro da Classificação');
        }
    });
}

// Monta a table de ingredientes
function dropdownIngredientes() {

    if (typeof jsonObjectIngrediente === 'undefined' || typeof jsonObjectUnidade === 'undefined') {
        $.getJSON(listIngrediente, function(jsonObjectIngrediente) {
            jsonIngrediente = jsonObjectIngrediente.data;

            // get da tabela de unidades
            $.getJSON(listUnidadeMedida, function(jsonObjectUnidade) {
                jsonUnidade = jsonObjectUnidade.data;
                listIngredientes();
            })
        })
    } else {
        listIngredientes();
    };

    function listIngredientes() {
        for (var i = 0; i < jsonIngrediente.length; i++) {
            $('#nomeIngredientes').append("<option value=" + jsonIngrediente[i].id_ingrediente + ">" + jsonIngrediente[i].nome_ingrediente + "</option>");

            for (var j = 0; j < jsonUnidade.length; j++) {
                if (jsonIngrediente[i].id_unidade_medida == jsonUnidade[j].id_unidade_medida) {
                    $('#unidade').append("<option>" + jsonUnidade[j].simbolo_unidade_medida + "</option>");
                }
            }
        }
    }
}

// chama a pagina de nova-receita e envia a url da receita especifica
$('#tableReceitas').on('click', '.editReceita', function() {
    idData = $(this).closest('tr').data('id');
    load_url();

    sessionStorage.setItem("url", showReceita);

    window.location.href = 'http://localhost:80/Gastronomia_Frontend/html/nova-receita.html';
})
$('#search').on('click', '.editar', function() {
    alert('oi')
    idData = $(this).closest('tr').data('id');
    load_url();

    sessionStorage.setItem("url", showReceita);

    window.location.href = 'http://localhost:80/Gastronomia_Frontend/html/nova-receita.html';
})

// =========== AJAX POST PUT =========== //]
$('#salvarReceita').on('click', function() {
    load_url();
    url = createReceita;
    postReceita(url);
})

$('.box-center').on('click', '#editarReceita', function() {
    load_url();
    url = updateReceita
    postReceita(url);
})

function postReceita() {
    var receitaSerial = $('#formReceita').serializeArray();
    var receitaIngredienteSerial = $('#formIngredientes').serializeArray();

    // pega valores do nicEditor
    var nicE = new nicEditors.findEditor('area1');
    var nicText = nicE.getContent();

    var ingredientesOrganizado = organizaReceitaIngrediente(receitaSerial, receitaIngredienteSerial);

    ingredientesOrganizado.push({ name: 'modo_preparo_receita', value: nicText });
    console.log(ingredientesOrganizado)
    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        data: ingredientesOrganizado,
        success: function() {
            swal({
                    title: "Receita criada/editada com sucesso.",
                    type: "success"
                },
                function() {
                    location.reload();
                }
            )
        },
        error: function() {
            swal({
                title: "Problemas ao criar/editar receita",
                type: "error",
                confirmButtonText: "Ok",
                confirmButtonColor: "#DD6B55",
            })
        }
    });
}



function organizaReceitaIngrediente(receitaSerial, receitaIngredienteSerial) {
    var id = 0;

    for (var i = 0; i < receitaIngredienteSerial.length; i++) {
        if (i % 2 == 0) {
            receitaSerial.push({ name: 'ingredientes[' + id + '][id_ingrediente]', value: receitaIngredienteSerial[i].value });
            receitaSerial.push({ name: 'ingredientes[' + id + '][quantidade_bruta_receita_ingrediente]', value: receitaIngredienteSerial[i + 1].value });
            id++;
        }
    }
    return receitaSerial;
}