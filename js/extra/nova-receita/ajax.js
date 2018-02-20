$('#salvarReceita').on('click', function() {
    var receitaSerial = $('#formReceita').serializeArray();
    var receitaIngredienteSerial = $('#formIngredientes').serializeArray();

    // pega valores do nicEditor
    var nicE = new nicEditors.findEditor('area1');
    var nicText = nicE.getContent();

    var ingredientesOrganizado = organizaReceitaIngrediente(receitaSerial, receitaIngredienteSerial);

    ingredientesOrganizado.push({ name: 'modo_preparo_receita', value: nicText });

    load_url();

    $.ajax({
        type: "POST",
        url: createReceita,
        dataType: "json",
        data: ingredientesOrganizado,
        success: function() {
            swal({
                    title: "Receita criada com sucesso.",
                    type: "success"
                },
                function() {
                    location.reload();
                }
            )
        },
        error: function() {
            swal({
                title: "Problemas ao criar receita",
                type: "error",
                confirmButtonText: "Ok",
                confirmButtonColor: "#DD6B55",
            })
        }
    });
})


function organizaReceitaIngrediente(receitaSerial, receitaIngredienteSerial) {
    var id = 0;

    for (var i = 0; i < receitaIngredienteSerial.length; i++) {
        if (i % 2 == 0) {
            receitaSerial.push({ name: 'ingredientes[' + id + '][id_ingrediente]', value: receitaIngredienteSerial[i].value });
            receitaSerial.push({ name: 'ingredientes[' + id + '][quantidade_bruta_receita_ingrediente]', value: receitaIngredienteSerial[i + 1].value });
            id++;
        }
    }
    return receitaSerial;
}