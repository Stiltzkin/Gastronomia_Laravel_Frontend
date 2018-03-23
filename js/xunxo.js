function pivotAula(jsonAula, jsonPeriodo) {
  var jsonAulaReceitaArray = [];

  for (var i = 0; i < jsonAula.length; i++) {
    var receitas = [];
    var receitasArray = [];
    var pivot = [];

    pivot['id_aula'] = jsonAula[i].id_aula;
    for (var j = 0; j < jsonAula[i].receita.length; j++) {
      receitas = jsonAula[i].receita[j].pivot;
      receitas['nome_receita'] = jsonAula[i].receita[j].nome_receita;
      receitasArray.push(receitas);
    }
    pivot['receitas'] = receitasArray;
    for (var j = 0; j < jsonPeriodo.length; j++) {
      if (jsonAula[i].id_periodo_aula == jsonPeriodo[j].id_periodo_aula) {
        pivot['periodo_aula'] = jsonPeriodo[j].descricao_periodo;
      }
    }
    jsonAulaReceitaArray.push(pivot);
  }
  return jsonAulaReceitaArray;
}