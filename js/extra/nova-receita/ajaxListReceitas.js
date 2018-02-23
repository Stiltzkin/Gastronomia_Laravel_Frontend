// ==================== GET ===================== //

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

var tipo = "receita";
var urlShowReceitas = getUrl(tipo);

// get da tabela de ingredientes
var paginate;
if (typeof jsonReceita === 'undefined' || typeof jsonObjectClassificacao === 'undefined' || typeof jsonObjectCategoria === 'undefined') {
    $.getJSON(urlShowReceitas, function(jsonObjectReceita) {
        jsonReceita = jsonObjectReceita.data.data;
        paginate = jsonObjectReceita.data;

        // get da tabela de unidades
        $.getJSON(listClassificacao, function(jsonObjectClassificacao) {
            jsonClassificacao = jsonObjectClassificacao.data;

            $.getJSON(listCategoria, function(jsonObjectCategoria) {
                jsonCategoria = jsonObjectCategoria.data;
                mostraReceitas();
                salvaUrlPaginas(paginate);
                botoesPaginacao(paginate);
            })
        })
    })
} else {
    mostraReceitas();
    salvaUrlPaginas(paginate);
    botoesPaginacao(paginate);
};


// ================== LISTAR RECEITAS =================== // Ok
function mostraReceitas() {

    for (var i = 0; i < jsonReceita.length; i++) {
        var row = $('<tr class="id-receita" data-id="' + jsonReceita[i].id_receita + '"></tr>');
        var buttonEdit = '<td><button type="button" class="btn btn-md editReceita"><i class="fa fa-edit"></i></button></td>';
        var buttonDelete = '<td><button type="button" id="buttonDeletar" class="btn btn-danger btn-md excluir" ><i class="fa fa-trash-o"></i></button></td>';
        var buttonView = '<td><button type="button" id="visualizar" class="btn btn-default btn-md" data-toggle="modal" data-target="#receitaId" ><i class="fa fa-eye" aria-hidden="true"></i></span></button></td>';

        $("#tableReceitas").append(row); //this will append tr element to table... keep its reference for a while since we will add cels into it
        row.append($("<td>" + jsonReceita[i].nome_receita + "</td>"));

        for (var j = 0; j < jsonClassificacao.length; j++) {
            if (jsonReceita[i].id_classificacao == jsonClassificacao[j].id_classificacao) {
                row.append($("<td>" + jsonClassificacao[j].descricao_classificacao + "</td>"));
            }
        }

        for (var k = 0; k < jsonCategoria.length; k++) {
            if (jsonReceita[i].id_categoria == jsonCategoria[k].id_categoria) {
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

$('#listaSearch').on('click', '#buttonDeletar', function() {
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
            $.ajax(deleteReceita, {
                type: 'POST',
                success: function() {
                    swal({
                            title: "Receita removida com sucesso!",
                            type: "success",
                        }),
                        // remove o ingrediente da lista no html
                        $(thisTr).remove();
                },
                error: function() {
                    swal({
                        title: "Problemas ao remover a Receita",
                        type: "error",
                    })
                },
            })
        }
    )
}

// ============== VISUALIZAR RECEITA DETALHES =================== //


// $.getJSON("url", data,
//     function(data, textStatus, jqXHR) {

//     }
// );

$("#visualizar").click(function(e) {
    e.preventDefault();
    $("#receitaId").modal('show');
});
// function viewReceita () {
//     $.getJSON("url", data,
//         function (data, textStatus, jqXHR) {

//         }
//     );
// }

// ===================== EDITAR RECEITA ======================== //