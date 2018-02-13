// ========== MODAL EDITAR AULA ========== //
$('.aulas').on('click', '.editar', function() {
    var form_addAula = $('#form_addAula');

    // corrige o botao para "Salvar" da modal editar aula
    window.btnAgendar = false;

    // abre modal
    $('#addAula').modal('show');
    limpaMensagens();

    // limpa a lista de receitas (nao acumular apertando editar varias vezes)
    $('.tabela_receita tr').remove();

    // seleciona a 'tr' da aula especifica
    var thisTr = $(this).closest('tr');

    // pega a id da aula especifica
    var idAula = thisTr.data('id');

    // cria os botoes add e del

    var htmlAddRecButton = '<button type="button" class="btn btn-success btn-sm" data-toggle="modal" data-target="#addReceita"><i class="fa fa-plus"></i></button>';
    form_addAula.find('.addIngButton').html(htmlAddRecButton);

    var htmlTurno = '<select class="form-control periodo_aula" name="id_periodo_aula" style="width: 100%;"><option value=1>Manhã</option><option value=2>Noite</option></select>';

    // roda a lista de aulas e verifica com a id pego na 'tr'
    $.each(jsonAula, function(indexAula, valAula) {
        if (valAula.id_aula == idAula) {
            // header da modal (mostrar o dia da aula)
            var htmlHeader = '<h4 class="modal-title">Editar aula do dia ' + valAula.data_aula + '</h4>'
            $('.cabecalho').html(htmlHeader);

            var htmlIdAula = '<li class="id_aula" hidden value="' + valAula.id_aula + '"></li>';
            var htmlDiaDaAula = '<input type="text" name="data_aula" class="form-control" id="datepicker" value="' + valAula.data_aula + '"></input>';
            var htmlNomeAula = '<input name="nome_aula" class="form-control" placeholder="Nome da Aula" value="' + valAula.nome_aula + '"></input>'
            var htmlDescricaoAula = '<input name="descricao_aula" class="form-control" placeholder="Nome da Aula" value="' + valAula.descricao_aula + '"></input>'
            var htmlTurno = '<select class="form-control periodo_aula" name="periodo_aula" style="width: 100%;"><option value="Manhã">Manhã</option><option value="Noite">Noite</option></select>';

            form_addAula.find('.idAula').html(htmlIdAula);
            form_addAula.find('.data').html(htmlDiaDaAula);
            form_addAula.find('.nome_aula').html(htmlNomeAula);
            form_addAula.find('.descricao_aula').html(htmlDescricaoAula);
            form_addAula.find('.turno').html(htmlTurno);

            chamaDatePicker();

            // esvazia a array para validação da receita (não repetir receita)
            receitaArray.length = 0;

            // deixa selecionado o periodo da aula
            $('.turno').val(valAula.periodo_aula).change();

            // garante que a tabela de receitas foi carregada
            if (typeof jsonObjectReceita === 'undefined') {
                $.getJSON(listReceita, function(jsonObjectReceita) {
                    jsonReceita = jsonObjectReceita;
                    mostraReceitas(idAula);
                });
            } else {
                mostraReceitas(idAula);
            }
        }
    })
});

// =========== MODAL MARCAR COMO AULA AGENDADA =========== //
$('.aulas').on('click', '.botaoAgendarAula', function() {
    var form_addAula = $('#form_addAula');
    // corrige o botao para "Agendar Aula" da modal agendar aula
    window.btnAgendar = true;

    // abre modal
    $('#addAula').modal('show');
    limpaMensagens();

    // limpa a lista de receitas (nao acumular apertando editar varias vezes)
    $('.tabela_receita tr').remove();

    // seleciona a 'tr' da aula especifica
    var thisTr = $(this).closest('tr');

    // pega a id da aula especifica
    var idAula = thisTr.data('id');

    // cria os botoes add e del

    var htmlAddIngButton = '<button type="button" class="btn btn-success btn-sm" data-toggle="modal" data-target="#addReceita"><i class="fa fa-plus"></i></button>';

    form_addAula.find('.addIngButton').html(htmlAddIngButton);

    var htmlTurno = '<select class="form-control periodo_aula" name="periodo_aula" style="width: 100%;"><option value="Manhã">Manhã</option><option value="Noite">Noite</option></select>';

    // roda a lista de aulas e verifica com a id pego na 'tr'
    $.each(jsonAula, function(indexAula, valAula) {
        if (valAula.id_aula == idAula) {
            // header da modal (mostrar o dia da aula)
            var htmlHeader = '<h4 class="modal-title">Confirmar dados da aula ' + valAula.data_aula + '</h4>'
            $('.cabecalho').html(htmlHeader);

            var htmlIdAula = '<input name="id_aula" class="id_aula" hidden value="' + valAula.id_aula + '"></input>';
            var htmlNomeAula = '<input name="nome_aula" class="form-control" placeholder="Nome da Aula" value="' + valAula.nome_aula + '"></input>'
            var htmlDescricaoAula = '<input name="descricao_aula" class="form-control" placeholder="Nome da Aula" value="' + valAula.descricao_aula + '"></input>'
            var htmlDiaDaAula = '<input type="text" name="data_aula" class="form-control" id="datepicker" value="' + valAula.data_aula + '"></input>';

            form_addAula.find('.idAula').html(htmlIdAula);
            form_addAula.find('.nome_aula').html(htmlNomeAula);
            form_addAula.find('.descricao_aula').html(htmlDescricaoAula);
            form_addAula.find('.data').html(htmlDiaDaAula);
            form_addAula.find('.turno').html(htmlTurno);

            chamaDatePicker();

            // esvazia a array para validação da receita (não repetir receita)
            receitaArray.length = 0;

            // deixa selecionado o periodo da aula
            $('.turno').val(valAula.periodo_aula).change();

            // garante que a tabela de receitas foi carregada
            if (typeof jsonObjectReceita === 'undefined') {
                $.getJSON(listReceita, function(jsonObjectReceita) {
                    jsonReceita = jsonObjectReceita;
                    // mostraReceitas(idAula) vem do modal-add-editar-aulas.js
                    mostraReceitas(idAula);
                });
            } else {
                mostraReceitas(idAula);
            }
        }
    })
});


// modal editar/agendar aula, lista de receitas da aula (toda parte de baixo da modal)
function mostraReceitas(idAula) {
    var htmlDelIngButton = '<td class="botao-excluir"><button type="button" class="excluir">Excluir</button></td>';

    // reseta o contador de receitas 'rec' e a array de validação 'receitaArray'
    rec = 0;
    receitaArray = [];

    var jsonAulaReceita = pivotAula(jsonAula, jsonPeriodo);
    console.log(jsonAulaReceita);
    for (var i = 0; i < jsonAulaReceita.length; i++) {
        if (idAula == jsonAulaReceita[i].id_aula) {
            for (var j = 0; j < jsonAulaReceita[i].length; j++) {
                var htmlListReceitas = $('<tr data-id="' + jsonAulaReceita[i][j].id_receita + '"></tr>');
                // var htmlForm = $('<form class="form_muito_porco' + rec + '"></form>');
                $('<td class="info-nome"><input hidden="" type="text" name="id_receita" value="' + jsonAulaReceita[i][j].id_receita + '"><p>' + jsonAulaReceita[i][j].nome_receita + '</p></td>').appendTo(htmlListReceitas);
                $('<td class="info-unidade"><input hidden="" class="qtdReceita' + rec + '" type="text" name="quantidade_receita" value="' + jsonAulaReceita[i][j].pivot.quantidade_receita + '"><p>' + jsonAulaReceita[i][j].pivot.quantidade_receita + '</p></td>').appendTo(htmlListReceitas);

                $(htmlDelIngButton).appendTo(htmlListReceitas);

                // joga na tela
                $(htmlListReceitas).appendTo('.tabela_receita');

                // receitaArray é criado em validacao_receitas_da_aula.js para não poder incluir receita ja incluso na aula
                receitaArray.push((jsonAulaReceita[i][j].id_receita).toString());
                rec++;
            }
        }
    }

    // cria array de botoes (cancelar e agendar) 
    var htmlButtonArr = [];
    // joga os botoes na array
    htmlButtonArr.push('<button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>');

    if (btnAgendar == false) {
        htmlButtonArr.push('<button type="button" id="saveButton" class="btn btn-success pull-right">Salvar</button>');
    }
    if (btnAgendar == true) {
        htmlButtonArr.push('<button type="button" id="agendarButton" class="btn btn-success pull-right">Agendar Aula</button>');
    }
    // imprime a array no rodape (cancelar e agendar)
    $('.rodape').html(htmlButtonArr);
}

// ========== MODAL ADICIONAR AULA ========== //
$('#addAulaBtn').on('click', function() {
    var form_addAula = $('#form_addAula');

    limpaMensagens();
    // limpa a lista de receitas (nao acumular apertando editar varias vezes)
    $('.tabela_receita tr').remove();

    // header da modal
    var htmlHeader = '<h4 class="modal-title">Criar nova aula </h4>'
    $('.cabecalho').html(htmlHeader);

    var htmlIdAula = '<input name="id_aula" class="id_aula" hidden value=""></input>'
    var htmlNomeAula = '<input name="nome_aula" class="form-control" placeholder="Nome da Aula"></input>'
    var htmlDescricaoAula = '<input name="descricao_aula" class="form-control" placeholder="Descrição da Aula"></input>'
    var htmlDiaDaAula = '<input type="text" name="data_aula" class="form-control" id="datepicker" placeholder="dd/mm/yy">';
    var htmlTurno = '<select class="form-control periodo_aula" name="id_periodo_aula" style="width: 100%;"><option value=1>Manhã</option><option value=2>Noite</option></select>';

    form_addAula.find('.idAula').html(htmlIdAula);
    form_addAula.find('.nome_aula').html(htmlNomeAula);
    form_addAula.find('.descricao_aula').html(htmlDescricaoAula);
    form_addAula.find('.data').html(htmlDiaDaAula);
    form_addAula.find('.turno').html(htmlTurno);

    chamaDatePicker();

    // cria array de botoes (cancelar e agendar) 
    var htmlButtonArr = [];
    // joga os botoes na array
    htmlButtonArr.push('<button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>');
    htmlButtonArr.push('<button type="button" id="saveButton" class="btn btn-success pull-right">Planejar Aula</button>');
    // imprime a array no rodape (cancelar e agendar)
    $('.rodape').html(htmlButtonArr);

    // chama a modal
    $('#addAula').modal('show');
});

// ==================== MODAL DETALHES DA AULA ==================== //
$('.aulas').on('click', '.botaoDetalhes', function() {
    // var nomeReceita é usado para converter id_reecita para nome_receita
    var nomeReceita;

    // mostra a modal
    $('#verAula').modal('show');

    // pega a id da aula
    var idAula = $(this).closest('tr').data('id');

    // limpa a tabela das receitas
    $('.receitasQuantidade tr').remove();

    // localizado em xunxo.js
    var jsonAulaReceita = pivotAula(jsonAula, jsonPeriodo);

    // Header da modal
    $.each(jsonAulaReceita, function(indexAulaReceita, valAulaReceita) {
        if (idAula == valAulaReceita.id_aula) {
            var trIdAula = '<tr hidden data-id="' + valAulaReceita.id_aula + '"></tr>';
            $('.receitasQuantidade').append(trIdAula);

            $.each(jsonAula, function(indexAula, valAula) {
                if (valAula.id_aula == valAulaReceita.id_aula) {
                    // header dos detalhes da aula
                    var htmlDataAula = '<h4 class="modal-title">Aula do dia ' + valAula.data_aula + '</h4>'
                    $('.headerDaModal').html(htmlDataAula);
                }
            })
        }
    })

    // verifica se foi dado get das receitas, caso nao tenha dado ele dará get aqui
    if (typeof jsonReceita === 'undefined' || typeof jsonAulaReceita === 'undefined') {
        $.getJSON(listReceita, function(jsonObjectReceita) {
            jsonReceita = jsonObjectReceita;
            $.getJSON(listAulaReceita, function(jsonObjectAulaReceita) {
                jsonAulaReceita = jsonObjectAulaReceita;
                aulaDetalhe()
            })
        });
    }
    aulaDetalhe()

    // Lista as receitas da aula (ao clicar ver detalhes da aula)
    function aulaDetalhe() {
        for (var i = 0; i < jsonAulaReceita.length; i++) {
            if (idAula == jsonAulaReceita[i].id_aula) {
                for (var j = 0; j < jsonAulaReceita[i].length; j++) {
                    console.log(jsonAulaReceita[i][j].pivot);
                    var nomeReceita = jsonAulaReceita[i][j].nome_receita;

                    var htmlListReceitas = $('<tr></tr>');
                    $('<td class="id_receita"><a href="#" id="hipertextColor">' + nomeReceita + '</a></td>').appendTo(htmlListReceitas);
                    $('<td class="quantidade_receita">' + jsonAulaReceita[i][j].pivot.quantidade_receita + '</td>').appendTo(htmlListReceitas);
                    $(htmlListReceitas).appendTo('.receitasQuantidade');
                }
                var htmlButtonArr = [];
                htmlButtonArr.push('<button type="button" class="btn btn-default clonar">Clonar Aula</button>');
                htmlButtonArr.push('<button type="button" class="btn btn-default" data-dismiss="modal">OK</button>');
                $('.rodape').html(htmlButtonArr);
            }
        }
    }
})

// =========== GET RECEITAS para selecionar ===========
$.getJSON(listReceita, function(receitaList) {
    var listaReceitas = receitaList.data;
    for (var i = 0; i < listaReceitas.length; i++) {

        $('#receitas').append($('<option>', {
            value: listaReceitas[i].id_receita,
            text: listaReceitas[i].nome_receita
        }));
    }
});