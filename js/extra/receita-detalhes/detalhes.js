$(document).ready(function() {
    var id_receita = sessionStorage.getItem('id_receita');

    load_url();

    for (var i = 0; i < listArray.length; i++) {

        if (listArray[i].key == "listUndiadeMedida") {
            listUndiadeMedida = listArray[i].value;
        }
    }

    $.getJSON(createReceita, function(jsonObjectReceita) {
        jsonReceita = jsonObjectReceita.data;
        $.getJSON(listUndiadeMedida, function(jsonObjectUnidade) {
            jsonUnidade = jsonObjectUnidade.data;

            ingredientes_receita_list(jsonReceita, id_receita);
            ingredientes_modo_preparo(jsonReceita, id_receita);
        })
    })
})


function ingredientes_receita_list(jsonReceita, id_receita) {

    for (var i = 0; i < jsonReceita.length; i++) {
        if (jsonReceita[i].id_receita == id_receita) {
            var thisReceitaPivot = jsonReceita[i].pivot;
            for (var j = 0; j < thisReceitaPivot.length; j++) {
                var tr = $("<tr></tr>");
                var nome_ingrediente = "<td>" + thisReceitaPivot[j].nome_ingrediente + "</td>";

                for (var k = 0; k < jsonUnidade.length; k++) {
                    if (jsonUnidade[k].id_unidade_medida == thisReceitaPivot[j].id_unidade_medida) {
                        var quantidade = "<td>" + jsonReceita[i].pivot[j].pivot.quantidade_bruta_receita_ingrediente + " " + jsonUnidade[k].simbolo_unidade_medida + "</td>";
                    }
                }

                $(nome_ingrediente).appendTo(tr);
                $(quantidade).appendTo(tr);
                $('#listIngredientes').append(tr);
            }
        }
    }
}

function ingredientes_modo_preparo(jsonReceita, id_receita) {
    for (var i = 0; i < jsonReceita.length; i++) {
        if (id_receita == jsonReceita[i].id_receita) {
            var p = "<p>" + jsonReceita[i].modo_preparo_receita + "</p>";

            $('#modo_preparo').append(p);
        }
    }
}