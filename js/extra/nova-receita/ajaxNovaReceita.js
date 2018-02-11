// VARIAVEIS LOCAIS
var jsonClassificacao;
var jsonCategoria;
var jsonIngrediente;
var jsonUnidade;

// get Classificacao e Categoria
if (typeof jsonObjectClassificacao === 'undefined' || typeof jsonObjectCategoria === 'undefined') {
    // get da tabela de unidades
    $.getJSON('http://localhost:8000/api/classificacao/list', function (jsonObjectClassificacao) {
        jsonClassificacao = jsonObjectClassificacao;


        $.getJSON('http://localhost:8000/api/categoria/list', function (jsonObjectCategoria) {
            jsonCategoria = jsonObjectCategoria;
            mostraClasseCate();
        })
    })
} else {
    mostraClasseCate();
};


// Monta lista de Classificacao e Categoria
function mostraClasseCate() {
    //$('#select2').find('option').
    $.each(jsonCategoria, function (indexInCategoria, valueOfCategoria) {
        //var select = $('<select class="form-control select2" style="width: 100%;"></select>')
        $('#categoria').append("<option value=" + valueOfCategoria.id_categoria + ">" + valueOfCategoria.descricao_categoria + "</option>");
    });

    $.each(jsonClassificacao, function (indexInClassificacao, valueOfClassificacao) {
        $('#classificacao').append("<option value=" + valueOfClassificacao.id_classificacao + ">" + valueOfClassificacao.descricao_classificacao + "</option>");
    });
}

// POST CATEGORIA // Sem validação
function postCategoria() {
    // seleciona o formulario, vai ser enviado serializado em 'data'
    var form = $('#form-addCategoria');
    console.log(form.serialize())
    // pega id do ingrediente (se vazio = POST, se tem algo = PUT)
    // var id = $('.idCategoria').val();

    // serializa o formulario
    // var formArray = form.serializeArray();


    var urlData = "http://localhost:8000/api/categoria/create/";

    // console.log(form.serializeArray())
    $.ajax({
        type: "POST",
        url: urlData,
        dataType: "json",
        // contentType: "application/json; charset=utf-8",
        // headers: { "X-HTTP-Method-Override": "PUT" },
        data: form.serialize(),
        success: function () {
            $('.classCategoriaHeader').modal("hide");
            swal({
                    title: "Sucesso!",
                    text: "Categoria criado com sucesso!",
                    type: "success"
                },
                function () {
                    location.reload();
                }
            )
        },
        error: function () {
            $('#mensagens-erro').append('Problemas no cadastro da Categoria');
        }
    });
}
//});


// POST CLASSIFICACAO // Sem validação
function postClassificacao() {
    // seleciona o formulario, vai ser enviado serializado em 'data'
    var form = $('#form-addClassificacao');
    console.log(form.serialize())
    // pega id do ingrediente (se vazio = POST, se tem algo = PUT)
    // var id = $('.idCategoria').val();

    // serializa o formulario
    // var formArray = form.serializeArray();


    var urlData = "http://localhost:8000/api/classificacao/create/";

    // console.log(form.serializeArray())
    $.ajax({
        type: "POST",
        url: urlData,
        dataType: "json",
        // contentType: "application/json; charset=utf-8",
        // headers: { "X-HTTP-Method-Override": "PUT" },
        data: form.serialize(),
        success: function () {
            $('.classClassificacaoHeader').modal("hide");
            swal({
                    title: "Sucesso!",
                    text: "Classificação criada com sucesso!",
                    type: "success"
                },
                function () {
                    location.reload();
                }
            )
        },
        error: function () {
            $('#mensagens-erro').append('Problemas no cadastro da Classificação');
        }
    });
}




// get da tabela de ingredientes
if (typeof jsonObjectIngrediente === 'undefined' || typeof jsonObjectUnidade === 'undefined') {
    $.getJSON('http://localhost:8000/api/ingredientes/list/', function (jsonObjectIngrediente) {
        jsonIngrediente = jsonObjectIngrediente;

        // get da tabela de unidades
        $.getJSON('http://localhost:8000/api/unidadesmedida/list/', function (jsonObjectUnidade) {
            jsonUnidade = jsonObjectUnidade;
            mostraIngredientes();
        })
    })
} else {
    mostraIngredientes();
};


// Monta a table de ingredientes
function mostraIngredientes() {
    $.each(jsonIngrediente, function (indexIngrediente, valueOfIngrediente) {

        $.each(jsonUnidade, function (indexInUnidade, valueOfUnidade) {

            if (valueOfIngrediente.id_unidade_medida == valueOfUnidade.id_unidade_medida) {
                $('#nomeIngredientes').append("<option value=" + valueOfIngrediente.id_ingrediente + ">" + valueOfIngrediente.nome_ingrediente + "</option>");

                // $('#unidade').append("<option>" + valueOfUnidade.simbolo_unidade_medida + "</option>");
            }
        });
    });
}