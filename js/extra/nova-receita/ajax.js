$('#salvarReceita').on('click', function () {
    if (typeof jsonReceita === 'undefined') {
        $.getJSON(listReceita, function (jsonObjectReceita) {
            jsonReceita = jsonObjectReceita;
            mainPostReceita();
        })
    } else {
        mainPostReceita();
    }

    function mainPostReceita() {
        postReceita();

        var lastId = buscaIdReceitaCriada(jsonReceita, 'id_receita');

        // valor da receita criada agora
        lastId++;

        postRecIngrediente(lastId);
    }
})

// busca id da receita mais recente
function buscaIdReceitaCriada(arr, prop) {
    var lastId;
    if (typeof arr === 'undefined') {
        lastId = 1;
    } else {
        for (var i = 0; i < arr.length; i++) {
            if (!lastId || parseInt(arr[i][prop]) > parseInt(lastId[prop]))
                lastId = arr[i];
        }
    }
    return lastId.id_receita;
}

function postReceita() {
    var jsonReceita = montaJsonReceita();
    ajaxReceita();

    function montaJsonReceita() {
        var formReceitaSerial = $('#formReceita').serializeArray();

        var nicEdit = new nicEditors.findEditor('area1');
        var formModoPreparo = nicEdit.getContent();

        formReceitaSerial.push({
            name: "modo_preparo_receita",
            value: formModoPreparo
        })
        return formReceitaSerial;
    }

    function ajaxReceita() {
        load_url();

        $.ajax({
            type: "POST",
            url: createReceita,
            dataType: "json",
            data: jsonReceita,
            success: function () {
                console.log('receita criada')
            },
            error: function () {
                swal({
                        title: "Problemas ao criar receita",
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
}

function postRecIngrediente(lastId) {
    var formRecIngrediente = montaJsonReceitaIngrediete();
    ajaxRecIngrediente();

    function montaJsonReceitaIngrediete() {
        var jsonRecIngredienteArr = [];

        for (var i = 0; i < ing; i++) {
            var formRecIngrediente = $('.form_porco_' + i + '').serializeArray();
            formRecIngrediente.push({
                name: 'id_receita',
                value: lastId
            }, {
                name: 'custo_bruto_receita_ingrediente',
                value: 0
            })
            jsonRecIngredienteArr.push(formRecIngrediente);
        }
        return jsonRecIngredienteArr;
    }

    function ajaxRecIngrediente() {

        for (var j = 0; j < formRecIngrediente.length; j++) {
            console.log('ajax form', formRecIngrediente[j])

            load_url();

            $.ajax({
                type: "POST",
                url: createReceitaIngrediente,
                dataType: "json",
                data: formRecIngrediente[j],
                success: function () {
                    $('.aulas').modal("hide");
                    swal({
                            title: "Sucesso!",
                            text: "Receita criado com sucesso!",
                            type: "success"
                        },
                        function () {
                            location.reload(true);
                        }
                    )
                },
                error: function () {
                    $('#mensagens-erro').append('Problemas no cadastro do ingrediente');
                }
            });

        }
    }
}