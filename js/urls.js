// ========== URLs Frontend ========== //
// const url = "http://localhost:80";
// const urlDashboard = url + /Gastronomia_Frontend/;
// const urlReceitas = "http://localhost:80/Gastronomia_Frontend/html/receitas.html"
// const urlIngredientes = "http://localhost:80/Gastronomia_Frontend/html/estoque.html"
// const urlAulasPlanejar = "http://localhost:80/Gastronomia_Frontend/html/planejar-aulas.html"
// const urlAulasConcluir = "http://localhost:80/Gastronomia_Frontend/html/aulas-concluidas.html"
// const urlReceitaCriar = "http://localhost:80/Gastronomia_Frontend/html/nova-receita.html"
// const urlReceitaDetalhe = "http://localhost:80/Gastronomia_Frontend/html/receita-detalhes.html"


// var patt = /urlFront/g;
// var treeview = document.getElementsByClassName("treeview");
//
// for (var i = 0; i < treeview.length; i++) {
//   var matchedPatt = treeview[i].getElementsByTagName("a").href;
//   matchedPatt.replace(patt, url);
// }

window.auth = "http://localhost:8000/oauth/token"
window.userlist = "http://localhost:8000/api/userlist"
// ========== LIST ========== //
window.listArray = [{
    "key": "listIngrediente",
    "value": "http://localhost:8000/api/ingredientes/listall"
  },
  {
    "key": "listUnidadeMedida",
    "value": "http://localhost:8000/api/unidades/"
  },
  {
    "key": "listAula",
    "value": "http://localhost:8000/api/aulas/"
  },
  {
    "key": "listReceita",
    "value": "http://localhost:8000/api/receitas/listall"
  },
  {
    "key": "listClassificacao",
    "value": "http://localhost:8000/api/classificacoes/"
  },
  {
    "key": "listCategoria",
    "value": "http://localhost:8000/api/categorias/"
  },
  {
    "key": "listPeriodo",
    "value": "http://localhost:8000/api/periodos/"
  }
]

function show(pg, qtd, tipo) {
  if (tipo == "ingrediente") {
    var showIngrediente = "http://localhost:8000/api/ingredientes?page=" + pg + "&qtd=" + qtd + "";
    return showIngrediente;
  }
  if (tipo == "receita") {
    var showReceita = "http://localhost:8000/api/receitas?page=" + pg + "&qtd=" + qtd + "";
    return showReceita;
  }
}

// ========== LIST fim ========== //

function load_url() {
  if (typeof idData === 'undefined') {
    window.idData = 0;
  }
  // ========== INGREDIENTE ========== //
  window.createIngrediente = 'http://localhost:8000/api/ingredientes/';
  window.thisIngrediente = 'http://localhost:8000/api/ingredientes/';
  window.updateIngrediente = 'http://localhost:8000/api/ingredientes/update/' + idData + '';
  window.deleteIngrediente = 'http://localhost:8000/api/ingredientes/delete/' + idData + '';
  window.somaIngrediente = 'http://localhost:8000/api/ingredientes/soma/' + idData + '';
  window.subtraiIngrediente = 'http://localhost:8000/api/ingredientes/subtrai/' + idData + '';

  // ========== AULAS ========== //
  window.createAula = 'http://localhost:8000/api/aulas/';
  window.updateAula = 'http://localhost:8000/api/aulas/update/' + idData + '';
  window.deleteAula = 'http://localhost:8000/api/aulas/delete/' + idData + '';
  window.agendarAula = 'http://localhost:8000/api/aulas/agendar/' + idData + '';
  window.desagendarAula = 'http://localhost:8000/api/aulas/desagendar/' + idData + '';
  window.concluirAula = 'http://localhost:8000/api/aulas/concluir/' + idData + '';
  window.clonarAula = 'http://localhost:8000/api/aulas/clone/' + idData + '';

  // ========== RECEITA ========== //
  window.createReceita = 'http://localhost:8000/api/receitas/';
  window.updateReceita = 'http://localhost:8000/api/receitas/update/' + idData + '';
  window.deleteReceita = 'http://localhost:8000/api/receitas/delete/' + idData + '';
  window.showReceita = 'http://localhost:8000/api/receitas/' + idData + '';

  // ========== CATEGORIA ========== //
  window.createCategoria = 'http://localhost:8000/api/categorias/';
  window.updateCategoria = 'http://localhost:8000/api/categorias/update/' + idData + '';
  window.deleteCategoria = 'http://localhost:8000/api/categorias/delete/' + idData + '';

  // ========== CLASSIFICACOES ========== //
  window.createClassificacao = 'http://localhost:8000/api/classificacoes/';
  window.updateClassificacao = 'http://localhost:8000/api/classificacoes/update/' + idData + '';
  window.deleteClassificacao = 'http://localhost:8000/api/classificacoes/delete/' + idData + '';
}