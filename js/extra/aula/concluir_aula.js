$('.aulas').on('click', '.botaoAulaConcluida', function () {
    // pega id da receita
    idData = $(this).closest('tr').data('id');

    if (typeof jsonReceitaIngrediente === 'undefined' || typeof jsonIngrediente === 'undefined') {
        $.getJSON(listReceitaIngrediente, function (jsonObjectReceitaIngrediente) {
            jsonReceitaIngrediente = jsonObjectReceitaIngrediente;
            $.getJSON(listIngrediente, function (jsonObjectIngrediente) {
                jsonIngrediente = jsonObjectIngrediente;
                mainFunction()
            })
        })
    } else {
        mainFunction()
    }

    function mainFunction() {
        var receitaArr = populaReceitaArr();
        // Obs: receitaArr[0] = array de Ids das receitas
        // Obs: receitaArr[1] = array de qtd de receitas usadas na aula

        var ingredienteArr = populaIngredienteArr(receitaArr[0]);
        // Obs: ingredienteArr[0] = array de Ids de ingrediente
        // Obs: ingredienteArr[1] = array de qtd de ingredientes usados numa receita

        var qtdEstoque = populaEstoqueArr(ingredienteArr[0]);

        var qtdTotalUsada = calculos(receitaArr[0], receitaArr[1], ingredienteArr[0], ingredienteArr[1]);
        // Obs: qtdTotalUsada[0] = array de qtd total de ingredientes que a aula irá usar
        // Obs: qtdTotalUsada[1] = array de reserva calculada, só mandar por ajax

        console.log(ingredienteArr[0], qtdTotalUsada[0])

        var json = montaJson(ingredienteArr[0], qtdTotalUsada[0], qtdTotalUsada[1]);
        // Obs: json[0] = array de ingredientes serializados
        // Obs: json[1] = aula serializado

        ajaxConcluirAula(json[0], json[1], ingredienteArr[0]);
    }
})

// Construtor de serializerArray
function criaSerialize() {
    var serial = $('#idNaoExiste').serializeArray();
    return serial;
}

function populaReceitaArr() {
    var receitaArr = [];
    var qtdReceita = [];

    $.map(jsonAulaReceita, function (valAulaReceita) {
        if (valAulaReceita.id_aula == idData) {
            receitaArr.push(valAulaReceita.id_receita);
            qtdReceita.push(valAulaReceita.quantidade_receita);
        }
    })
    return [receitaArr, qtdReceita];
}

function populaIngredienteArr(receitaIdArr) {
    var ingredienteArr = [];
    var qtdReceita = [];

    for (var i = 0; i < receitaIdArr.length; i++) {
        $.map(jsonReceitaIngrediente, function (valReceitaIngrediente) {
            if (valReceitaIngrediente.id_receita == receitaIdArr[i]) {
                ingredienteArr.push(valReceitaIngrediente.id_ingrediente);
                qtdReceita.push(valReceitaIngrediente.quantidade_bruta_receita_ingrediente);
            }
        })
    }
    return [ingredienteArr, qtdReceita];
}

function populaEstoqueArr(ingredienteIdArray) {
    var qtdEstoque = [];

    for (var i = 0; i < ingredienteIdArray.length; i++) {
        $.map(jsonIngrediente, function (valIngrediente) {
            qtdEstoque.push(valIngrediente.quantidade_estoque_ingrediente)
        })
    }
    return qtdEstoque;
}

function calculos(receitaIdArr, receitaQtdArr, ingredienteIdArr, qtdUsadaArr) {
    var qtdReceitaExtend = [];
    var qtdTotalUsar = [];
    var reserva = reserva();

    for (var i = 0; i < ingredienteIdArr.length; i++) {
        $.map(jsonReceitaIngrediente, function (valReceitaIngrediente) {
            if (receitaIdArr[i] == valReceitaIngrediente.id_receita) {
                qtdReceitaExtend.push(receitaQtdArr[i]);
            }
        })
    }

    for (var j = 0; j < ingredienteIdArr.length; j++) {
        qtdTotalUsar.push(qtdReceitaExtend[j] * qtdUsadaArr[j])
    }

    function reserva() {
        var reservaArr = pegaQtdReserva();
        var reservaCalculado = calculoReserva();
        console.log(reservaArr, qtdUsadaArr)

        function pegaQtdReserva() {
            var reservaArr = [];

            for (var k = 0; k < ingredienteIdArr.length; k++) {
                $.map(jsonIngrediente, function (valIngrediente) {
                    if (valIngrediente.id_ingrediente == ingredienteIdArr[k]) {
                        reservaArr.push(valIngrediente.quantidade_reservada_ingrediente);
                    }
                })
            }
            return reservaArr;
        }

        function calculoReserva() {
            var reservaCalculado = [];

            for (var h = 0; h < reservaArr.length; h++) {
                reservaCalculado.push(reservaArr[h] - qtdUsadaArr[h]);
            }
            return reservaCalculado;
        }
        return [reservaCalculado, reservaArr];
    }
    return [qtdTotalUsar, reserva[0], reserva[1]];
}

function montaJson(idIngredienteArr, qtdTotalUsadaArr, qtdTotalReservadaArr) {
    var jsonIngredienteArr = montaJsonIngrediente();
    var jsonAulaSerial = montaJsonAula();

    function montaJsonIngrediente() {
        jsonIngredienteSerial = [];

        for (var i = 0; i < idIngredienteArr.length; i++) {
            $.map(jsonIngrediente, function (valIngrediente) {

                if (valIngrediente.id_ingrediente == idIngredienteArr[i]) {
                    var ingredienteSerial = new criaSerialize();

                    ingredienteSerial.push({
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
                        value: -qtdTotalUsadaArr[i]
                    }, {
                        name: 'valor_ingrediente',
                        value: valIngrediente.valor_ingrediente
                    }, {
                        name: 'motivo_retirada_estoque',
                        value: valIngrediente.motivo_retirada_estoque
                    }, {
                        name: 'id_unidade_medida',
                        value: valIngrediente.id_unidade_medida
                    }, {
                        name: 'id_ingrediente',
                        value: valIngrediente.id_ingrediente
                    }, {
                        name: 'quantidade_reservada_ingrediente',
                        value: qtdTotalReservadaArr[i]
                    })
                    jsonIngredienteSerial.push(ingredienteSerial);
                }
            })

        }
        return jsonIngredienteSerial;
    }

    function montaJsonAula() {
        var aulaSerial = new criaSerialize();

        $.map(jsonAula, function (valAula) {
            if (valAula.id_aula == idData) {

                aulaSerial.push({
                    name: 'id_aula',
                    value: valAula.id_aula
                }, {
                    name: 'nome_aula',
                    value: valAula.nome_aula
                }, {
                    name: 'data_aula',
                    value: valAula.data_aula
                }, {
                    name: 'descricao_aula',
                    value: valAula.descricao_aula
                }, {
                    name: 'aula_agendada',
                    value: true
                }, {
                    name: 'aula_concluida',
                    value: true
                }, {
                    name: 'periodo_aula',
                    value: valAula.periodo_aula
                })
            }
        })
        return aulaSerial;
    }
    return [jsonIngredienteArr, jsonAulaSerial]
}

function ajaxConcluirAula(ingredienteSerialArr, aulaSerial, ingredienteIdArr) {
    idDataTemp = idData;
    console.log(ingredienteSerialArr)

    swal({
            title: "Marcar esta aula como Concluida?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim",
            closeOnConfirm: false,
        },
        function () {
            for (var i = 0; i < ingredienteIdArr.length; i++) {
                idData = ingredienteIdArr[i];
                load_url();

                $.ajax(updateIngrediente, {
                    type: 'POST',
                    data: ingredienteSerialArr[i],
                    dataType: 'json',
                    success: function () {
                        console.log('ingrediente atalizado')
                    },
                    error: function () {
                        swal({
                            title: "Problemas no update dos ingredientes da aula",
                            type: "error",
                            confirmButtonText: "Ok",
                            confirmButtonColor: "#DD6B55",
                        }, function () {
                            location.reload();
                        })
                    }
                })
            }
            ajaxAula();

            function ajaxAula() {
                idData = idDataTemp

                load_url();
                $.ajax(updateAula, {
                    type: 'POST',
                    data: aulaSerial,
                    dataType: 'json',
                    success: function () {
                        swal({
                                title: "Aula Concluida!",
                                type: "success",
                            },
                            function () {
                                location.reload(true);
                            }
                        )
                    },
                    error: function () {
                        swal({
                            title: "Problemas para concluir a aula",
                            type: "error",
                            confirmButtonText: "Ok",
                            confirmButtonColor: "#DD6B55",
                        }, function () {
                            location.reload(true);
                        })
                    }
                })
            }
        }
    );
}