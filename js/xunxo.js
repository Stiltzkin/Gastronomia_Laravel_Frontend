function pivotAula(jsonAula, jsonPeriodo) {
    var jsonAulaReceita = [];
    var jsonAulaReceitaArray = [];

    for (var i = 0; i < jsonAula.length; i++) {
        var pivot = jsonAula[i].pivot;
        pivot['id_aula'] = jsonAula[i].id_aula;

        for (var j = 0; j < jsonPeriodo.length; j++) {
            if (jsonAula[i].id_periodo_aula == jsonPeriodo[j].id_periodo_aula) {
                pivot['periodo_aula'] = jsonPeriodo[j].descricao_periodo;
            }
        }
        jsonAulaReceitaArray.push(pivot);
    }
    return jsonAulaReceitaArray;
}