function validacao_agenda_aula(ingredienteArr, reservaArr, serialArr) {
    // garante uue Json Unidades foi baixado
    if (typeof jsonUnidadeMedida === 'undefined' || typeof jsonIngrediente === 'undefined') {
        $.getJSON(listUnidadeMedida, function (jsonObjectUnidade) {
            jsonUnidade = jsonObjectUnidade;
            $.getJSON(listIngrediente, function (jsonObjectIngredientes) {
                jsonIngrediente = jsonObjectIngredientes;
                mainErros(ingredienteArr, reservaArr, serialArr)
            })
        })
    } else {
        mainErros(ingredienteArr, reservaArr, serialArr)

        // localizado em agendar_aula.js
        marcarAgendamento(idDataTemp);
    }



    function mainErros(ingredienteArr, reservaArr, serialArr) {
        var erros = validaReserva(ingredienteArr, reservaArr);

        if (erros.length > 0) {
            exibeMensagensDeErro(erros);
        } else {
            ajaxIngrediente(ingredienteArr, reservaArr, serialArr);
        }
    }
}

function validaReserva(ingredienteArr, reservaArr) {
    var erros = [];

    var qtdReservaAtualArr = [];
    var qtdEstoqueArr = [];
    var nomeIngredienteArr = [];
    var unidadeArr = [];
    var stringUnidadeArr = [];

    // var tipoUnidade = buscaUnidadeMedida(ingredienteArr);
    populaMaisArrays();

    function populaMaisArrays() {
        // popula arrays qtdReservaAtualArr e qtdEstoqueArr
        for (var i = 0; i < ingredienteArr.length; i++) {
            $.map(jsonIngrediente, function (valIngrediente) {
                if (valIngrediente.id_ingrediente == ingredienteArr[i]) {
                    var qtdReservaAtual = valIngrediente.quantidade_reservada_ingrediente;
                    var qtdEstoque = valIngrediente.quantidade_estoque_ingrediente;
                    var nomeIngrediente = valIngrediente.nome_ingrediente
                    var unidade = valIngrediente.id_unidade_medida;

                    qtdReservaAtualArr.push(qtdReservaAtual);
                    qtdEstoqueArr.push(qtdEstoque);
                    nomeIngredienteArr.push(nomeIngrediente);
                    unidadeArr.push(unidade);
                }
            })
        }

        var stringUnidadeArr = populaUnidadeArr(unidadeArr)
        return qtdReservaAtualArr, qtdEstoqueArr, nomeIngredienteArr, unidadeArr, stringUnidadeArr;
    }

    function populaUnidadeArr(unidadeArr) {
        for (var k = 0; k < unidadeArr.length; k++) {
            $.map(jsonUnidade, function (valUnidade) {
                if (valUnidade.id_unidade_medida == unidadeArr[k]) {
                    var stringUnidade = valUnidade.simbolo_unidade_medida;
                    stringUnidadeArr.push(stringUnidade);
                }
            })
        }
        return stringUnidadeArr;
    }

    // VALIDAÇAO AQUI
    for (var j = 0; j < ingredienteArr.length; j++) {
        if (reservaArr[j] > qtdEstoqueArr[j]) {
            var qtdFaltante = reservaArr[j] - qtdEstoqueArr[j];
            erros.push("Faltam " + qtdFaltante + "" + stringUnidadeArr[j] + " de " + nomeIngredienteArr[j] + " no estoque!")
        }
    }
    return erros;
}

// pega o a unidade de medida do ingrediente
function buscaUnidadeMedida(ingredienteArr) {
    var tipoUnidade;

    $.map(jsonUnidade, function (valUnidade) {
        if (valUnidade.id_unidade_medida == idIngrediente) {
            tipoUnidade = valUnidade.simbolo_unidade_medida;
        }
    })
    return tipoUnidade;
}

function exibeMensagensDeErro(erros) {
    var ul = document.querySelector("#mensagens-erro-aula");

    ul.innerHTML = "";

    erros.forEach(function (erro) {
        var li = document.createElement("li");
        li.textContent = erro;
        ul.appendChild(li);
    });
}