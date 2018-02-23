// ========== LIST ========== //
window.listArray = [{
        "key": "listIngrediente",
        "value": "http://localhost:8000/api/ingredientes/"
    },
    {
        "key": "listUndiadeMedida",
        "value": "http://localhost:8000/api/unidades/"
    },
    {
        "key": "listAula",
        "value": "http://localhost:8000/api/aulas/"
    },
    {
        "key": "listReceita",
        "value": "http://localhost:8000/api/receitas/"
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
    window.updateIngrediente = 'http://localhost:8000/api/ingredientes/update/' + idData + '';
    window.deleteIngrediente = 'http://localhost:8000/api/ingredientes/delete/' + idData + '';
    window.somaIngrediente = 'http://localhost:8000/api/ingredientes/soma/' + idData + '';
    window.subtraiIngrediente = 'http://localhost:8000/api/ingredientes/subtrai/' + idData + '';

    // ========== AULAS ========== //
    window.createAula = 'http://localhost:8000/api/aulas/';
    window.updateAula = 'http://localhost:8000/api/aulas/update/' + idData + '';
    window.deleteAula = 'http://localhost:8000/api/aulas/delete/' + idData + '';
    window.agendarAula = 'http://localhost:8000/api/aulas/agendar/' + idData + '';
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

// JSONs ARMAZENDADOS para serem utilizados em todos os lugares
window.jsonUnidade;
window.jsonIngrediente;
window.jsonAula;
window.jsonReceita;
window.jsonPaginateIngrediente;
window.jsonPaginate;