for (var i = 0; i < listArray.length; i++) {
  if (listArray[i].key == "listIngrediente") {
    var listIngrediente = listArray[i].value;
  }
  if (listArray[i].key == "listUnidadeMedida") {
    var listUnidadeMedida = listArray[i].value;
  }
  if (listArray[i].key == "listClassificacao") {
    var listClassificacao = listArray[i].value;
  }
  if (listArray[i].key == "listCategoria") {
    var listCategoria = listArray[i].value;
  }
}

var paginate, jsonUnidade;
var urlNames = ["listClassificacao", "listCategoria", "listIngrediente", "unidade"];
var urlValues = [listClassificacao, listCategoria, listIngrediente, listUnidadeMedida];

// $.when(validaToken()).done(function() {
$.when(getAjax(urlNames[0], urlValues[0]), getAjax(urlNames[1], urlValues[1]), getAjax(urlNames[2], urlValues[2]), getAjax(urlNames[3], urlValues[3])).done(function(jsonClassificacao, jsonCategoria, jsonIngrediente, jsonUnidade) {
  mostraClasseCate(jsonClassificacao, jsonCategoria);
  dropdownIngredientes(jsonIngrediente, jsonUnidade);

  window.gjsonClassificacao = jsonClassificacao;
  window.gjsonCategoria = jsonCategoria;
  window.gjsonIngrediente = jsonIngrediente;
  window.gjsonUnidade = jsonUnidade;
})
// })


// Monta lista de Classificacao e Categoria
function mostraClasseCate(jsonClassificacao, jsonCategoria) {
  //$('#select2').find('option').
  for (var i = 0; i < jsonCategoria.length; i++) {
    $('#categoria').append("<option value=" + jsonCategoria[i].id_categoria + ">" + jsonCategoria[i].descricao_categoria + "</option>");
  }
  for (var j = 0; j < jsonClassificacao.length; j++) {
    $('#classificacao').append("<option value=" + jsonClassificacao[j].id_classificacao + ">" + jsonClassificacao[j].descricao_classificacao + "</option>");
  }
}

// POST CATEGORIA // Sem validação
function postCategoria() {
  // seleciona o formulario, vai ser enviado serializado em 'data'
  var form = $('#form-addCategoria').serialize();
  load_url();

  // $.when(validaToken()).done(function() {
  postAjax(form, createCategoria);
  // })
}


// POST CLASSIFICACAO // Sem validação
function postClassificacao() {
  // seleciona o formulario, vai ser enviado serializado em 'data'
  var form = $('#form-addClassificacao').serialize();
  load_url();

  // $.when(validaToken()).done(function() {
  postAjax(form, createClassificacao);
  // })
}

// Monta a table de ingredientes
function dropdownIngredientes(jsonIngrediente, jsonUnidade) {
  for (var i = 0; i < jsonIngrediente.length; i++) {
    $('#nomeIngredientes').append("<option value=" + jsonIngrediente[i].id_ingrediente + ">" + jsonIngrediente[i].nome_ingrediente + "</option>");

    for (var j = 0; j < jsonUnidade.length; j++) {
      if (jsonIngrediente[i].id_unidade_medida == jsonUnidade[j].id_unidade_medida) {
        $('#unidade').append("<option>" + jsonUnidade[j].simbolo_unidade_medida + "</option>");
      }
    }
  }
}

// chama a pagina de nova-receita e envia a url da receita especifica
$('#tableReceitas').on('click', '.editReceita', function() {
  idData = $(this).closest('tr').data('id');
  load_url();

  sessionStorage.setItem("url", showReceita);

  window.location.href = 'http://localhost:80/Gastronomia_Frontend/html/nova-receita.html';
})

$('#search').on('click', '.editar', function() {
  alert('oi')
  idData = $(this).closest('tr').data('id');
  load_url();

  sessionStorage.setItem("url", showReceita);

  window.location.href = 'http://localhost:80/Gastronomia_Frontend/html/nova-receita.html';
})

// =========== AJAX POST PUT =========== //]
$('#salvarReceita').on('click', function() {
  load_url();
  var url = createReceita;
  postReceita(url);
})

function updateReceita() {
  // $('.box-center').on('click', '#editarReceita', function() {
  load_url();
  var url = updateReceita
  postReceita(url);
  // })
}

function postReceita(url) {
  var receitaSerial = $('#formReceita').serializeArray();
  var receitaIngredienteSerial = $('#formIngredientes').serializeArray();

  var ContentFromEditor = CKEDITOR.instances.editor.getData();

  var ingredientesOrganizado = organizaReceitaIngrediente(receitaSerial, receitaIngredienteSerial);

  ingredientesOrganizado.push({
    name: 'modo_preparo_receita',
    value: ContentFromEditor
  });
  console.log(ingredientesOrganizado)

  // $.when(validaToken()).done(function() {
  postAjax(ingredientesOrganizado, url);
  // })
}

function organizaReceitaIngrediente(receitaSerial, receitaIngredienteSerial) {
  var id = 0;

  for (var i = 0; i < receitaIngredienteSerial.length; i++) {
    if (i % 2 == 0) {
      receitaSerial.push({
        name: 'ingredientes[' + id + '][id_ingrediente]',
        value: receitaIngredienteSerial[i].value
      });
      receitaSerial.push({
        name: 'ingredientes[' + id + '][quantidade_bruta_receita_ingrediente]',
        value: receitaIngredienteSerial[i + 1].value
      });
      id++;
    }
  }
  return receitaSerial;
}