$('.listaAulasAgendadas').on('click', '.excluir_concluida', function () {
    idData = $(this).closest('tr').data('id');

    if (typeof jsonReceitaIngrediente === 'undefined' || typeof jsonIngrediente === 'undefined') {
        $.getJSON(listReceitaIngrediente, function (jsonObjectReceitaIngrediente) {
            jsonReceitaIngrediente = jsonObjectReceitaIngrediente;
            $.getJSON(listIngrediente, function (jsonObjectIngrediente) {
                jsonIngrediente = jsonObjectIngrediente;
                mainDelete()
            })
        })
    } else {
        mainDelete()
    }

    function mainDelete() {
        // chamado em concluir_aula.js
        var receitaArr = populaReceitaArr();
        var ingredienteArr = populaIngredienteArr(receitaArr[0]);
        var qtdTotalUsada = calculos(receitaArr[0], receitaArr[1], ingredienteArr[0], ingredienteArr[1]);

        var reservaFinalArr = calculoDelete(qtdTotalUsada[2], qtdTotalUsada[0]);
        var jsonDelete = montaJsonDelete(reservaFinalArr, ingredienteArr[0]);

        ajaxIngredienteDelete(jsonDelete, ingredienteArr[0]);
    }

    function calculoDelete(reservaAtual, qtdIngredienteDaAula) {
        var reservaFinal = [];
        for (var i = 0; i < reservaAtual.length; i++) {
            reservaFinal.push(reservaAtual[i] - qtdIngredienteDaAula[i]);
        }
        return reservaFinal;
    }

    function montaJsonDelete(reservaFinalArr, ingredienteIdArr) {
        var deleteSerialArr = [];

        for (var j = 0; j < ingredienteIdArr.length; j++) {
            $.map(jsonIngrediente, function (valIngrediente) {
                if (valIngrediente.id_ingrediente == ingredienteIdArr[j]) {

                    // chamado em concluir_aula.js
                    var jsonDelete = new criaSerialize();

                    jsonDelete.push({
                        name: 'id_ingrediente',
                        value: valIngrediente.id_ingrediente
                    }, {
                        name: 'nome_ingrediente',
                        value: valIngrediente.nome_ingrediente
                    }, {
                        name: 'quantidade_calorica_ingrediente',
                        value: valIngrediente.quantidade_calorica_ingrediente
                    }, {
                        name: 'aproveitamento_ingrediente',
                        value: valIngrediente.aproveitamento_ingrediente
                    }, {
                        name: 'quantidade_estoque_ingrediente',
                        value: 0
                    }, {
                        name: 'quantidade_reservada_ingrediente',
                        value: reservaFinalArr[j]
                    }, {
                        name: 'valor_ingrediente',
                        value: valIngrediente.valor_ingrediente
                    }, {
                        name: 'motivo_retirada_estoque',
                        value: valIngrediente.motivo_retirada_estoque
                    }, {
                        name: 'id_unidade_medida',
                        value: valIngrediente.id_unidade_medida
                    })
                    deleteSerialArr.push(jsonDelete);
                }
            })
        }
        return deleteSerialArr;
    }
})

function ajaxIngredienteDelete(jsonDelete, ingredienteIdArr) {
    var idDataTemp = idData;

    swal({
            title: "Deletar esta aula?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim",
            closeOnConfirm: false,
        },
        function () {
            if (jsonDelete.length == 0) {
                ajaxAula();
            }

            for (var i = 0; i < jsonDelete.length; i++) {
                idData = ingredienteIdArr[i]

                load_url();

                $.ajax(updateIngrediente, {
                    type: 'POST',
                    data: jsonDelete[i],
                    dataType: 'json',
                    success: function () {
                        console.log('updateingrediente')
                        ajaxAula();
                    },
                    error: function () {
                        swal({
                            title: "Problemas no update dos ingredientes da aula",
                            type: "error",
                            confirmButtonText: "Ok",
                            confirmButtonColor: "#DD6B55",
                        })
                    }
                })
            }

            function ajaxAula() {
                idData = idDataTemp;

                load_url();

                $.ajax(deleteAula, {
                    type: 'DELETE',
                    data: {
                        "id_aula": idData
                    },
                    dataType: 'json',
                    success: function () {
                        swal({
                                title: "Aula removido com sucesso!",
                                type: "success",
                            },
                            function () {
                                location.reload();
                            }
                        )
                    },
                    error: function () {
                        swal({
                            title: "Problemas ao remover a aula",
                            type: 'error',
                        })
                    },
                })
            }
        })

}