// ==================== GET ===================== //
$(document).ready(function() {
    if (typeof(sessionStorage.getItem('pg')) === undefined || sessionStorage.getItem('pg') == null) {
        sessionStorage.setItem('pg', 1);
    }
    if (typeof(sessionStorage.getItem('qtd')) === undefined || sessionStorage.getItem('qtd') == null) {
        sessionStorage.setItem('qtd', 15);
    }

    var pg = sessionStorage.getItem('pg');
    var qtd = sessionStorage.getItem('qtd');

    // chamado em urls.js
    var urlShowIngrediente;
    if (sessionStorage.getItem('urlShowIngrediente') == null) {
        urlShowIngrediente = show(pg, qtd);
    } else {
        urlShowIngrediente = sessionStorage.getItem('urlShowIngrediente');
    }


    for (var i = 0; i < listArray.length; i++) {
        if (listArray[i].key == "listUndiadeMedida") {
            var listUnidadeMedida = listArray[i].value;
        }
    }

    var paginate;
    if (typeof jsonPaginateIngrediente === 'undefined' || typeof jsonObjectUnidade === 'undefined') {
        $.getJSON(urlShowIngrediente, function(jsonObjectIngrediente) {
            jsonPaginateIngrediente = jsonObjectIngrediente.data.data;
            paginate = jsonObjectIngrediente.data;

            $.getJSON(listUnidadeMedida, function(jsonObjectUnidade) {
                jsonUnidade = jsonObjectUnidade.data;
                mostraIngredientes();
                salvaUrlPaginas(paginate);
                botoesPaginacao(paginate);
            })
        })
    } else {
        mostraIngredientes();
        botoesPaginacao(paginate);
    };
})

// chamado em select de estoque.html
function paginate() {
    var e = document.getElementById("paginateQtd");
    var qtd = e.options[e.selectedIndex].value;
    sessionStorage.setItem('qtd', qtd);
    location.reload();
}

function mostraIngredientes() {
    // cria os botoes dos ingredientes
    var botaoAdd = '<td><button type="button" class="btn btn-xs addButton"><i class="fa fa-plus"></i></button></td>';
    var botaoSubtract = '<td><button type="button" class="btn btn-danger btn-xs subButton"><i class="fa fa-minus"></i></button></td>';
    var botaoExcluir = '<td><button type="button" class="btn btn-xs btn-danger excluir_ing"><i class="fa fa-trash"></i></button></td>';
    var botaoEditar = '<td><button class="editar" type="button">Editar</button></td>';

    // roda a lista de ingredientes
    $.each(jsonPaginateIngrediente, function(indexIngrediente, valIngrediente) {
        // roda a lista de unidades
        $.each(jsonUnidade, function(indexUnidade, valUnidade) {
            // compara as id de unidade das tabelas ingredientes e unidade e armazena a key 'descricao' da tabela unidade na variavel unidade
            if (valUnidade.id_unidade_medida == valIngrediente.id_unidade_medida) {

                // cria a 'tr' de cada ingrediente para ficar em formato de lista
                var htmlList = $('<tr class="id-ingrediente" data-id="' + valIngrediente.id_ingrediente + '"></tr>');

                // cria as 'td' com os valores do ingreiente E joga as 'td' dentro da 'tr' htmlList (<tr><td>  </td></tr>)
                $('<td class="nome_ingrediente">' + valIngrediente.nome_ingrediente + '</td>').appendTo(htmlList);
                $('<td class="quantidade_calorica">' + valIngrediente.quantidade_calorica_ingrediente + '</td>').appendTo(htmlList);
                $('<td class="aproveitamento">' + valIngrediente.aproveitamento_ingrediente + '</td>').appendTo(htmlList);
                $('<td class="valor_ingrediente"> R$ ' + valIngrediente.valor_ingrediente + '</td>').appendTo(htmlList);
                $('<td class="quantidade_estoque">' + valIngrediente.quantidade_estoque_ingrediente + '</td>').appendTo(htmlList);
                $('<td class="quantidade_reservada">' + valIngrediente.quantidade_reservada_ingrediente + '</td>').appendTo(htmlList);
                $('<td class="unidade_medida">' + valUnidade.simbolo_unidade_medida + '</td>').appendTo(htmlList);
                $(botaoAdd).appendTo(htmlList);
                $(botaoSubtract).appendTo(htmlList);
                $(botaoEditar).appendTo(htmlList);
                $(botaoExcluir).appendTo(htmlList);

                // imprime na tela os ingredientes e os botoes
                $(htmlList).appendTo('.tabela-ingrediente');
            }
        });
    });
}
// ===================== POST PUT é chamado em validacao-ingrediente.js ===================== //
function postJson() {
    // seleciona o formulario, vai ser enviado serializado em 'data'
    var form = $('#form-addIngrediente');
    // pega id do ingrediente (se vazio = POST, se tem algo = PUT)
    idData = $('.id').val();

    // serializa o formulario
    var formArray = form.serializeArray();

    load_url();

    if (idData == 0) {
        var urlData = createIngrediente;
        var text = "incluido";
    } else {
        var urlData = updateIngrediente;
        var text = "editado";
    }

    $.ajax({
        type: "POST",
        url: urlData,
        dataType: "json",
        data: formArray,
        success: function() {
            $('.aulas').modal("hide");
            swal({
                    title: "Sucesso!",
                    text: "Ingrediente " + text + " com sucesso!",
                    type: "success"
                },
                function() {
                    location.reload();
                }
            )
        },
        error: function() {
            $('#mensagens-erro').append('Problemas no cadastro do ingrediente');
        }
    });
};

// ===================== DELETE ===================== //
$('.lista-ingredientes').on('click', '.excluir_ing', function() {
    // seleciona a 'tr' do ingrediente especifico
    var thisTr = $(this).closest('tr');
    // pega a id do ingrediente localizado no html
    idData = thisTr.data('id');
    excluir_ingrediente(thisTr);
});

$('#listaSearch').on('click', '.excluir_ing', function() {
    // seleciona a 'tr' do ingrediente especifico
    var thisTr = $(this).closest('tr');
    // pega a id do ingrediente localizado no html
    idData = thisTr.data('id');
    excluir_ingrediente(thisTr);
})

function excluir_ingrediente(thisTr) {
    load_url();
    swal({
            title: "Tem certeza que deseja deletar este ingrediente?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Deletar!",
            closeOnConfirm: false,
        },
        function() {
            $.ajax(deleteIngrediente, {
                type: 'POST',
                success: function() {
                    swal({
                            title: "Ingrediente removido com sucesso!",
                            type: "success",
                        }),
                        // remove o ingrediente da lista no html
                        $(thisTr).remove();
                },
                error: function() {
                    swal({
                        title: "Problemas ao remover o ingrediente",
                        type: "error",
                    })
                },
            })
        }
    )
}

function botoesPaginacao(paginate) {
    if (paginate.prev_page_url == null) {
        var previous = '<li class="page-item disabled"><a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true ">&laquo;</span><span class="sr-only ">Previous</span></a></li>'
    } else {
        var previous = '<li class="page-item"><a class="page-link" href="#" onclick="prevOnClick()" aria-label="Previous"><span aria-hidden="true ">&laquo;</span><span class="sr-only ">Previous</span></a></li>'
    }

    var current = '<li class="page-item"><a class="page-link " href="#">' + paginate.current_page + '</a></li>'

    if (paginate.next_page_url == null) {
        var next = '<li class="page-item disabled"><a class="page-link " href="#" aria-label="Next "><span aria-hidden="true ">&raquo;</span><span class="sr-only ">Next</span></a></li>'
    } else {
        var next = '<li class="page-item"><a class="page-link" href="#" onclick="nextOnClick()" aria-label="Next "><span aria-hidden="true ">&raquo;</span><span class="sr-only "></span></a></li>'
    }
    $(previous).appendTo('.pagination');
    $(current).appendTo('.pagination');
    $(next).appendTo('.pagination');
}

function nextOnClick() {
    sessionStorage.setItem('urlShowIngrediente', sessionStorage.getItem('nextUrl'));

    location.reload();
}

function prevOnClick() {
    sessionStorage.setItem('urlShowIngrediente', sessionStorage.getItem('prevUrl'));
    location.reload();
}

function salvaUrlPaginas(paginate) {
    var nextUrl = paginate.next_page_url;
    var prevUrl = paginate.prev_page_url;

    sessionStorage.setItem('nextUrl', nextUrl);
    sessionStorage.setItem('prevUrl', prevUrl);
}