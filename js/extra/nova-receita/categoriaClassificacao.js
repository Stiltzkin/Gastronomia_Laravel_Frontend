// variavel apenas para evitar repetição, caso necessario, alterar apenas aqui
var form_addCategoria = $('#form-addCategoria');
var form_addClassificacao = $('#form-addClassificacao')


// ==================== MODAL ADICIONAR CATEGORIA ==================== //
$('#addCategoria').on('click', function () {
    limpaMensagens();

    // cria os inputs vazio
    var htmlIdCategoria = '<input class="id_categoria" hidden value=""></input>'
    var htmlNomeCategoria = '<input name="descricao_categoria" type="text" class="form-control" id="nome_categoria" placeholder="Categoria" value="">';

    // aparecera na header da modal
    var htmlHeader = '<h4 class="modal-title ">Adicionar Categoria</h4>';
    $('.nomeCategoriaHeader').html(htmlHeader);

    // joga os inputs na modal (ex: find(.NomeIngrediente), procura a classe NomeIngrediente no html e joga o input criado la)
    form_addCategoria.find('.idCategoria').html(htmlIdCategoria);
    form_addCategoria.find('.nomeCategoria').html(htmlNomeCategoria);

    // abre a modal
    $('#formCategoria').modal('show');
});


// ==================== MODAL ADICIONAR CLASSIFICACAO ==================== //
$('#addClassificacao').on('click', function () {
    limpaMensagens();

    // cria os inputs vazio
    var htmlIdClassificacao = '<input class="id_classificacao" hidden value=""></input>'
    var htmlNomeClassificacao = '<input name="descricao_classificacao" type="text" class="form-control" id="nome_classificacao" placeholder="Classificacao" value="">';

    // aparecera na header da modal
    var htmlHeader = '<h4 class="modal-title ">Adicionar Classificacao</h4>';
    $('.nomeClassificacaoHeader').html(htmlHeader);

    // joga os inputs na modal (ex: find(.NomeIngrediente), procura a classe NomeIngrediente no html e joga o input criado la)
    form_addClassificacao.find('.idClassificacao').html(htmlIdClassificacao);
    form_addClassificacao.find('.nomeClassificacao').html(htmlNomeClassificacao);

    // abre a modal
    $('#formClassificacao').modal('show');
});

// MODAL NOVO INGREDIENTE

// ========== VALIDAÇAO de ADICIONAR e EDITAR INGREDIENTE ========== //
$('#adicionar-categoria').on('click', function () {
    limpaMensagens();

        postCategoria();
    
    //var categoria = obtemCategoriaForm();

    //var erros = validaCategoria(categoria);

    // if (erros.length > 0) {
    //     exibeMensagensDeErro(erros);
    // } else {
    //     postCategoria();
    // }
});

$('#adicionar-classificacao').on('click', function () {
    limpaMensagens();

        postClassificacao();
    
    //var categoria = obtemCategoriaForm();

    //var erros = validaCategoria(categoria);

    // if (erros.length > 0) {
    //     exibeMensagensDeErro(erros);
    // } else {
    //     postCategoria();
    // }
});
