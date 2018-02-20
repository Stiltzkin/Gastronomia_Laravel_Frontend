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
};


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
            jsonIngrediente = jsonObjectIngrediente.data.data;

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

$('#tableReceitas').on('click', '.editReceita', function() {
    idData = $(this).closest('tr').data('id');
    load_url();

    window.location.href = 'http://localhost:80/Gastronomia_Frontend/html/nova-receita.html';

    for (var i = 0; i < jsonReceita.length; i++) {
        if (jsonReceita[i].id_receita == idData) {
            var nome = jsonReceita[i].nome_receita;
        }

    }
    alert(nome)
    var nome_receita = '<input type="text" class="form-control" name="nome_receita" id="inputReceita" placeholder="Nome da Receita" value="' + nome + '">';
    $(nome_receita).appendTo('#nome');
})