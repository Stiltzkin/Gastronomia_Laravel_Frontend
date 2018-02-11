// ==================== GET ===================== //
// armazena os objetos json de ingrediente e unidade para ser usado em outros locais
//window.jsonReceita;
var jsonReceita;
var jsonClassificacao;
var jsonCategoria;
var jsonIngrediente;
var jsonUnidade;

// get da tabela de ingredientes
if (typeof jsonReceita === 'undefined' || typeof jsonObjectClassificacao === 'undefined' || typeof jsonObjectCategoria === 'undefined') {
    $.getJSON('http://localhost:8000/api/receitas/list', function (jsonObjectReceita) {
        jsonReceita = jsonObjectReceita;

        // get da tabela de unidades
        $.getJSON('http://localhost:8000/api/classificacao/list', function (jsonObjectClassificacao) {
            jsonClassificacao = jsonObjectClassificacao;


            $.getJSON('http://localhost:8000/api/categoria/list', function (jsonObjectCategoria) {
                jsonCategoria = jsonObjectCategoria;
                mostraReceitas();
            })
        })
    })
} else {
    mostraReceitas();
};


// ================== LISTAR RECEITAS =================== // Ok
function mostraReceitas() {
    // roda a lista de ingredientes
    $.each(jsonReceita, function (indexReceita, valReceita) {
        // roda a lista de unidades
        $.each(jsonClassificacao, function (indexClassificacao, valClassificacao) {

            $.each(jsonCategoria, function (indexCategoria, valCategoria) {
                // compara as id de unidade das tabelas ingredientes e unidade e armazena a key 'descricao' da tabela unidade na variavel unidade
                if (valReceita.id_classificacao == valClassificacao.id_classificacao) {
                    if (valReceita.id_categoria == valCategoria.id_categoria) {
                        var row = $('<tr class="id-receita" data-id="' + valReceita.id_receita + '"></tr>');
                        var buttonEdit = '<td><button type="button" class="btn btn-md" data-toggle="modal" data-target="#editReceita"><i class="fa fa-edit"></i></button></td>';
                        var buttonDelete = '<td><button type="button" id="buttonDeletar" class="btn btn-danger btn-md excluir" ><i class="fa fa-trash-o"></i></button></td>';
                        var buttonView = '<td><button type="button" id="visualizar" class="btn btn-default btn-md" data-toggle="modal" data-target="#receitaId" ><i class="fa fa-eye" aria-hidden="true"></i></span> Visualizar Receita </button></td>';

                        $("#tableReceitas").append(row); //this will append tr element to table... keep its reference for a while since we will add cels into it
                        row.append($("<td>" + valReceita.nome_receita + "</td>"));
                        row.append($("<td>" + valClassificacao.descricao_classificacao + "</td>"));
                        row.append($("<td>" + valCategoria.descricao_categoria + "</td>"))
                        row.append(buttonEdit);
                        row.append(buttonDelete);
                        row.append(buttonView);
                    }
                }
            });
        });
    });
}

// ===================== DELETE RECEITAS ===================== // Ok
$('.lista-receita').on('click', '#buttonDeletar', function () {
    // seleciona a 'tr' da receita especifico
    var thisTr = $(this).closest('tr');
    // pega a id da receita localizado no html
    var idData = thisTr.data('id');
    excluir_receita(idData, thisTr);
});

$('#listaSearch').on('click', '#buttonDeletar', function () {
    // seleciona a 'tr' do ingrediente especifico
    var thisTr = $(this).closest('tr');
    // pega a id do ingrediente localizado no html
    var idData = thisTr.data('id');
    excluir_receita(idData, thisTr);
})

function excluir_receita(idData, thisTr) {
    swal({
            title: "Tem certeza que deseja deletar este Receita?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Deletar!",
            closeOnConfirm: false,
        },
        function () {
            $.ajax('http://localhost:8000/api/receitas/delete/' + idData + '', {
                type: 'DELETE',
                data: {
                    "id_receita": idData
                },
                dataType: 'json',
                success: function () {
                    swal({
                            title: "Receita removida com sucesso!",
                            type: "success",
                        }),
                        // remove o ingrediente da lista no html
                        $(thisTr).remove();
                },
                error: function () {
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


$.getJSON("url", data,
    function (data, textStatus, jqXHR) {

    }
);

$("#visualizar").click(function (e) { 
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