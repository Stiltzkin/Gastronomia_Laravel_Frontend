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

    // ========== AULA RECEITA ========== //
    window.createAulaReceita = 'http://localhost:8000/api/aula_receita/create/';
    window.deleteAulaReceita = 'http://localhost:8000/api/aula_receita/delete/' + idData + '';

    // ========== RECEITA ========== //
    window.createReceita = 'http://localhost:8000/api/receitas/create/';

    // ========== RECEITA INGREDIENTE ========== //
    window.createReceitaIngrediente = 'http://localhost:8000/api/receita_ingrediente/create/';
}

// JSONs ARMAZENDADOS para serem utilizados em todos os lugares
window.jsonUnidade;
window.jsonIngrediente;
window.jsonAula;
window.jsonReceita;
window.jsonAulaReceita;
window.jsonReceitaIngrediente;