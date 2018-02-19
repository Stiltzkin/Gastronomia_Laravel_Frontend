$(document).ready(function() {
    // var listArray = listArray();

    for (var i = 0; i < listArray.length; i++) {
        if (listArray[i].key == "listAula") {
            var listAula = listArray[i].value;
        }
        if (listArray[i].key == "listIngrediente") {
            var listIngrediente = listArray[i].value;
        }
    }

    // garante que a tabela de aulas e ingredientes foi carregada
    if (typeof jsonAula === 'undefined' || typeof jsonIngredientes === 'undefined') {
        $.getJSON(listAula, function(jsonObjectAula) {
            var jsonAula = jsonObjectAula.data;
            $.getJSON(listIngrediente, function(jsonObjectIngredientes) {
                var jsonIngredientes = jsonObjectIngredientes.data.data;
                calculaValores(jsonAula, jsonIngredientes);
            })

        })
    } else {
        calculaValores(jsonAula, jsonIngredientes);
    }
})

function calculaValores(jsonAula, jsonIngredientes) {
    // ========== Cartas Aulas ==========
    var countAulasCriadas, countAulasAgendadas;
    // contadores
    var j = 0;
    var i = 0;

    $.each(jsonAula, function(indexAula, valAula) {
        // conta o numero de aulas criadas
        if (valAula.aula_agendada == false) {
            j++
            htmlAulasCriadas = '<h3>' + j + '</h3>';
        }
    })
    var htmlAulasAgendadas = '<h3>' + 0 + '</h3>';
    $.each(jsonAula, function(indexAula, valAula) {
        // conta o numero de aulas agendadas

        if (valAula.aula_agendada == true && valAula.aula_concluida == false) {
            i++
            htmlAulasAgendadas = '<h3>' + i + '</h3>';
        }
        if (valAula.aula_agendada == true && valAula.aula_concluida == true && i == 0) {
            htmlAulasAgendadas = '<h3>' + i + '</h3>';
        }
    })
    $('.numAulasCriadas').html(htmlAulasCriadas + "<p>Total de Aulas Planejadas</p>");
    $('.numAulasAgendadas').html(htmlAulasAgendadas + "<p>Total de Aulas Agendadas</p>");

    // ========== Carta Valor Estoque ==========
    var valorEstoque = 0
    $.each(jsonIngredientes, function(indexIngredientes, valIngredientes) {
        var valorIngrediente = parseFloat(valIngredientes.valor_ingrediente);
        var qtdIngrediente = parseFloat(valIngredientes.quantidade_estoque_ingrediente);
        var valTotalIngrediente = valorIngrediente * qtdIngrediente;

        valorEstoque = valorEstoque + valTotalIngrediente;
    })
    htmlValorEstoque = '<h3>R$ ' + valorEstoque + '</h3>';
    $('.valorEstoque').html(htmlValorEstoque + "<p>Valor do Estoque</p>");

}