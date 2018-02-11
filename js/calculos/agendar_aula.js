$('#addAula').on('click', '#agendarButton', function () {
    // pega id da receita
    idData = $(this).closest('#addAula').find('.id_aula').val();

    // cria array com as receitas da aula
    var receitaArr = [];
    var ingredienteArr = [];
    var reservaArr = [];
    var serialArr = [];

    // garante que a associativa receita_ingrediente foi baixado
    if (typeof jsonReceitaIngrediente === 'undefined' || typeof jsonIngrediente === 'undefined') {
        $.getJSON(listReceitaIngrediente, function (jsonObjectReceitaIngrediente) {
            jsonReceitaIngrediente = jsonObjectReceitaIngrediente;
            $.getJSON(listIngrediente, function (jsonObjectIngrediente) {
                jsonIngrediente = jsonObjectIngrediente;
                populaArrays();
            })
        })
    } else {
        populaArrays();
    }

    function populaArrays() {
        // popula receitaArr com as id das receitas
        $.each(jsonAulaReceita, function (index, valAulaReceita) {
            if (valAulaReceita.id_aula == idData) {
                receitaArr.push(valAulaReceita.id_receita);
            }
        })

        // popula receitaArr
        for (i = 0; i < receitaArr.length; i++) {
            $.map(jsonReceitaIngrediente, function (valReceitaIngrediente) {
                if (valReceitaIngrediente.id_receita == receitaArr[i]) {

                    // qtdIngrediente_receita é a quantidade de ingredientes usado para a receita especifica
                    var qtdIngrediente_receita = valReceitaIngrediente.quantidade_bruta_receita_ingrediente
                    var serialQtdReceita = $('.qtdReceita' + i + '').serializeArray();
                    var qtdIngrediente = calculaIngredientes(qtdIngrediente_receita, serialQtdReceita);
                    var idIngrediente = valReceitaIngrediente.id_ingrediente;
                    ingredienteArr.push(idIngrediente);

                    var reservaTotal = somaIngredientesReservados(idIngrediente, qtdIngrediente);
                    reservaArr.push(reservaTotal);
                }
            })
        }
        // localizado em /calculos/validacao_agendar_aula.js
        validacao_agenda_aula(ingredienteArr, reservaArr, serialArr)
    }

    // =========================== AQUI COMEÇA OS CALCULOS ========================== //
    // multiplica quantidade de receita desejado * ingrediente dessa receita
    function calculaIngredientes(qtdIngrediente_receita, serialQtdReceita) {
        var stringQtdReceita = JSON.stringify(serialQtdReceita);
        var parseQtdReceita = JSON.parse(stringQtdReceita);

        // pega o 'value' do json na posição 0
        var qtdReceita = parseQtdReceita[0].value;

        for (var i = 0; i < rec; i++) {
            return qtdReceita * qtdIngrediente_receita;
        }
    }

    function somaIngredientesReservados(idIngrediente, qtdIngrediente) {
        var reservaAtual = parseInt(pegaIngredientesReservados(idIngrediente));
        var reservaSomada = reservaAtual + qtdIngrediente;
        return reservaSomada;
    }

    function pegaIngredientesReservados(idIngrediente) {
        var getReservaAtual;
        $.map(jsonIngrediente, function (valIngrediente) {
            if (valIngrediente.id_ingrediente == idIngrediente) {
                getReservaAtual = valIngrediente.quantidade_reservada_ingrediente;
            }
        })
        return getReservaAtual;
    }
})

function montaJsonAgenda(ingredienteArr, reservaArr, serialArr) {
    // arr armazena todos os json para ser passado pelo ajax
    var arr = [];
    for (var i = 0; i < ingredienteArr.length; i++) {
        var serialArray = $('input[name!=quantidade_reservada_ingrediente]', $('.qtdReceita' + i + '')).serializeArray();

        completaJson(serialArray, i);
    }

    function completaJson(serialArray, i) {
        $.map(jsonIngrediente, function (valIngrediente) {
            if (ingredienteArr[i] == valIngrediente.id_ingrediente) {

                serialArray.push({
                    name: 'nome_ingrediente',
                    value: valIngrediente.nome_ingrediente
                }, {
                    name: 'quantidade_calorica_ingrediente',
                    value: valIngrediente.quantidade_calorica_ingrediente
                }, {
                    name: 'aproveitamento_ingrediente',
                    value: valIngrediente.aproveitamento_ingrediente
                }, {
                    name: 'quantidade_reservada_ingrediente',
                    value: reservaArr[i]
                }, {
                    name: 'quantidade_estoque_ingrediente',
                    value: 0
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
                })
                arr.push(serialArray);
            }
        })
    }
    return arr;
}

// localizado em /calculos/validacao_agendar_aula.js
function ajaxIngrediente(ingredienteArr, reservaArr, serialArr) {
    var jsonMontado = montaJsonAgenda(ingredienteArr, reservaArr, serialArr);
    var idDataTemp = idData;

    console.log('jsonMontado', jsonMontado)
    for (var i = 0; i < jsonMontado.length; i++) {
        idData = ingredienteArr[i];

        load_url();
        console.log(jsonMontado[1])

        $.ajax({
            type: "POST",
            url: updateIngrediente,
            data: jsonMontado[i],
            dataType: 'json',
            success: function () {
                $('#addAula').modal('hide')
            },
            error: function (serialArr) {
                swal({
                        title: "Problemas ao reservar os ingredientes",
                        type: "error",
                        confirmButtonText: "Ok",
                        confirmButtonColor: "#DD6B55",
                    },
                    function () {
                        location.reload()
                    }
                )
            }
        });
    }
    marcarAgendamento(idDataTemp);
}

function marcarAgendamento(idDataTemp) {
    idData = idDataTemp;
    load_url();
    console.log(updateAula)

    var aulaSerial = $('#form_addAula').serializeArray();
    aulaSerial.push({
        name: 'aula_agendada',
        value: true
    }, {
        name: 'aula_concluida',
        value: false
    })
    console.log(aulaSerial)
    $.ajax({
        type: "POST",
        url: updateAula,
        data: aulaSerial,
        dataType: 'json',
        success: function () {
            $('#addAula').modal('hide')
            swal({
                    title: "SUCESSO!",
                    type: "success",
                },
                function () {
                    location.reload();
                }
            )
        },
        error: function () {
            swal({
                    title: "Problemas ao reservar os ingredientes",
                    type: "error",
                    confirmButtonText: "Ok",
                    confirmButtonColor: "#DD6B55",
                },
                function () {
                    location.reload();
                }
            )
        }
    });
}