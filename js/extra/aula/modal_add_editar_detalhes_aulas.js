// ========== MODAL EDITAR AULA ========== //
$('.aulas').on('click', '.editar', function() {
  // seleciona a 'tr' da aula especifica
  var thisTr = $(this).closest('tr');

  if (sessionStorage.getItem("jsonAula") == null || sessionStorage.getItem("jsonReceita") == null || sessionStorage.getItem("jsonPeriodo") == null) {
    for (var i = 0; i < listArray.length; i++) {
      if (listArray[i].key == "listAula") {
        var listAula = listArray[i].value;
      }
      if (listArray[i].key == "listReceita") {
        var listReceita = listArray[i].value;
      }
      if (listArray[i].key == "listPeriodo") {
        var listPeriodo = listArray[i].value;
      }
    }

    var jsonAula, jsonReceita, jsonPeriodo;
    var urlNames = ["listAula", "listReceita", "listPeriodo"];
    var urlValues = [listAula, listReceita, listPeriodo];

    // $.when(validaToken()).done(function() {
    $.when(getAjax(urlNames[0], urlValues[0]), getAjax(urlNames[1], urlValues[1])).done(function(jsonAula, jsonReceita, jsonPeriodo) {
      sessionStorage.setItem("jsonReceita", JSON.stringify(jsonReceita));
      sessionStorage.setItem("jsonAula", JSON.stringify(jsonAula));
      sessionStorage.setItem("jsonPeriodo", JSON.stringify(jsonPeriodo));
      modalEditarAula(jsonAula, jsonReceita, jsonPeriodo, thisTr);
    })
    // })
  } else {
    var jsonAula = JSON.parse(sessionStorage.getItem("jsonAula"));
    var jsonReceita = JSON.parse(sessionStorage.getItem("jsonReceita"));
    var jsonPeriodo = JSON.parse(sessionStorage.getItem("jsonPeriodo"));
    modalEditarAula(jsonAula, jsonReceita, jsonPeriodo, thisTr);
  }

  function modalEditarAula(jsonAula, jsonReceita, jsonPeriodo, thisTr) {
    var form_addAula = $('#form_addAula');

    // corrige o botao para "Salvar" da modal editar aula
    window.btnAgendar = false;

    // abre modal
    $('#addAula').modal('show');
    limpaMensagens();

    // limpa a lista de receitas (nao acumular apertando editar varias vezes)
    $('.tabela_receita tr').remove();

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
        var htmlTurno = '<select class="form-control periodo_aula" name="periodo_aula" style="width: 100%;"><option value="1">Manhã</option><option value="2">Noite</option></select>';

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

        mostraAulaReceitas(idAula, jsonAula, jsonPeriodo)
      }
    })
  }

});

// =========== MODAL MARCAR COMO AULA AGENDADA =========== //
$('.aulas').on('click', '.botaoAgendarAula', function() {
  var thisTr = $(this).closest('tr');

  if (sessionStorage.getItem("jsonAula") == null || sessionStorage.getItem("jsonReceita") == null || sessionStorage.getItem("jsonPeriodo") == null) {
    for (var i = 0; i < listArray.length; i++) {
      if (listArray[i].key == "listAula") {
        var listAula = listArray[i].value;
      }
      if (listArray[i].key == "listReceita") {
        var listReceita = listArray[i].value;
      }
      if (listArray[i].key == "listPeriodo") {
        var listPeriodo = listArray[i].value;
      }
      var jsonAula, jsonReceita, jsonPeriodo;
      var urlNames = ["listAula", "listReceita", "listPeriodo"];
      var urlValues = [listAula, listReceita, listPeriodo];
      // $.when(validaToken()).done(function() {
      $.when(getAjax(urlNames[0], urlValues[0]), getAjax(urlNames[1], urlValues[1]), getAjax(urlNames[2], urlValues[2])).done(function(jsonAula, jsonReceita, jsonPeriodo) {
        sessionStorage.setItem("jsonReceita", JSON.stringify(jsonReceita));
        sessionStorage.setItem("jsonAula", JSON.stringify(jsonAula));
        sessionStorage.setItem("jsonPeriodo", JSON.stringify(jsonPeriodo));
        chamaModalAulaAgendada(jsonAula, jsonReceita, jsonPeriodo, thisTr);
      })
      // })
    }
  } else {
    var jsonAula = JSON.parse(sessionStorage.getItem("jsonAula"));
    var jsonReceita = JSON.parse(sessionStorage.getItem("jsonReceita"));
    var jsonPeriodo = JSON.parse(sessionStorage.getItem("jsonPeriodo"));
    chamaModalAulaAgendada(jsonAula, jsonReceita, jsonPeriodo, thisTr);
  }

  function chamaModalAulaAgendada(jsonAula, jsonReceita, jsonPeriodo, thisTr) {
    var form_addAula = $('#form_addAula');
    // corrige o botao para "Agendar Aula" da modal agendar aula
    window.btnAgendar = true;

    // abre modal
    $('#addAula').modal('show');
    limpaMensagens();

    // limpa a lista de receitas (nao acumular apertando editar varias vezes)
    $('.tabela_receita tr').remove();

    // seleciona a 'tr' da aula especifica
    // var thisTr = $(this).closest('tr');

    // pega a id da aula especifica
    var idAula = thisTr.data('id');

    // cria os botoes add e del

    var htmlAddIngButton = '<button type="button" class="btn btn-success btn-sm" data-toggle="modal" data-target="#addReceita"><i class="fa fa-plus"></i></button>';

    form_addAula.find('.addIngButton').html(htmlAddIngButton);

    var htmlTurno = '<select class="form-control periodo_aula" name="periodo_aula" style="width: 100%;"><option value="1">Manhã</option><option value="2">Noite</option></select>';

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
        $('.turno').val(valAula.id_periodo_aula).change();

        mostraAulaReceitas(idAula, jsonAula, jsonPeriodo);
      }
    })
  }
});


// modal editar/agendar aula, lista de receitas da aula (toda parte de baixo da modal)
function mostraAulaReceitas(idAula, jsonAula, jsonPeriodo) {
  var htmlDelIngButton = '<td class="botao-excluir"><button type="button" class="excluir">Excluir</button></td>';

  // reseta a array de validação 'receitaArray'
  receitaArray = [];

  var jsonAulaReceita = pivotAula(jsonAula, jsonPeriodo);

  for (var i = 0; i < jsonAulaReceita.length; i++) {
    if (idAula == jsonAulaReceita[i].id_aula) {
      for (var j = 0; j < jsonAulaReceita[i].receitas.length; j++) {
        var htmlListReceitas = $('<tr data-id="' + jsonAulaReceita[i].receitas[j].id_receita + '"></tr>');
        $('<td class="info-nome"><input hidden="" type="text" name="receitaId" value="' + jsonAulaReceita[i].receitas[j].id_receita + '"><p>' + jsonAulaReceita[i].receitas[j].nome_receita + '</p></td>').appendTo(htmlListReceitas);
        $('<td class="info-unidade"><input hidden="" class="qtdReceita" type="text" name="quantidade_receita" value="' + jsonAulaReceita[i].receitas[j].quantidade_receita + '"><p>' + jsonAulaReceita[i].receitas[j].quantidade_receita + '</p></td>').appendTo(htmlListReceitas);

        $(htmlDelIngButton).appendTo(htmlListReceitas);

        // joga na tela
        $(htmlListReceitas).appendTo('.tabela_receita');

        // receitaArray é criado em validacao_receitas_da_aula.js para não poder incluir receita ja incluso na aula
        receitaArray.push((jsonAulaReceita[i].receitas[j].id_receita).toString());
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

  // reseta a array de validação 'receitaArray'
  receitaArray = [];

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
  var idAula = $(this).closest('tr').data('id');

  if (sessionStorage.getItem("jsonAula") == null || sessionStorage.getItem("jsonPeriodo") == null) {
    for (var i = 0; i < listArray.length; i++) {
      if (listArray[i].key == "listAula") {
        var listAula = listArray[i].value;
      }
      if (listArray[i].key == "listPeriodo") {
        var listPeriodo = listArray[i].value;
      }
    }

    var jsonAula, jsonPeriodo;
    var urlNames = ["listAula", "listPeriodo"];
    var urlValues = [listAula, listPeriodo];

    $.when(getAjax(urlNames[0], urlValues[0]), getAjax(urlNames[1], urlValues[1])).done(function(jsonAula, jsonPeriodo) {
      sessionStorage.setItem("jsonAula", JSON.stringify(jsonAula));
      sessionStorage.setItem("jsonPeriodo", JSON.stringify(jsonPeriodo));
      modalDetalhesAula(jsonAula, jsonPeriodo, idAula);
    })
  } else {
    var jsonAula = JSON.parse(sessionStorage.getItem("jsonAula"));
    var jsonPeriodo = JSON.parse(sessionStorage.getItem("jsonPeriodo"));
    modalDetalhesAula(jsonAula, jsonPeriodo, idAula);
  }

  function modalDetalhesAula(jsonAula, jsonPeriodo, idAula) {
    // mostra a modal
    $('#verAula').modal('show');

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

    if (sessionStorage.getItem("jsonReceita") == null) {
      for (var i = 0; i < listArray.length; i++) {
        if (listArray[i].key == "listReceita") {
          var listReceita = listArray[i].value;
        }
      }

      var jsonReceita;
      var urlNames = ["listReceita"];
      var urlValues = [listReceita];

      // $.when(validaToken()).done(function() {
      $.when(getAjax(urlNames[0], urlValues[0])).done(function(jsonReceita) {
        sessionStorage.setItem("jsonReceita", JSON.stringify(jsonReceita));
        aulaDetalhe(jsonReceita, jsonAulaReceita);
      })
    } else {
      var jsonReceita = JSON.parse(sessionStorage.getItem("jsonReceita"));
      aulaDetalhe(jsonReceita, jsonAulaReceita);
    }
  }
  // Lista as receitas da aula (ao clicar ver detalhes da aula)
  function aulaDetalhe(jsonReceita, jsonAulaReceita) {
    for (var i = 0; i < jsonAulaReceita.length; i++) {
      if (idAula == jsonAulaReceita[i].id_aula) {
        for (var j = 0; j < jsonAulaReceita[i].receitas.length; j++) {
          var nomeReceita = jsonAulaReceita[i].receitas[j].nome_receita;

          var htmlListReceitas = $('<tr></tr>');
          $('<td class="id_receita"><a href="#" id="hipertextColor">' + nomeReceita + '</a></td>').appendTo(htmlListReceitas);
          $('<td class="quantidade_receita">' + jsonAulaReceita[i].receitas[j].quantidade_receita + '</td>').appendTo(htmlListReceitas);
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
if (sessionStorage.getItem("jsonReceita") == null) {
  for (var i = 0; i < listArray.length; i++) {
    if (listArray[i].key == "listReceita") {
      var listReceita = listArray[i].value;
    }
  }

  var jsonReceita;
  var urlNames = ["listReceita"];
  var urlValues = [listReceita];

  $.when(getAjax(urlNames[0], urlValues[0])).done(function(jsonReceita) {
    sessionStorage.setItem("jsonReceita", JSON.stringify(jsonReceita));
    populaDropDownReceitas(jsonReceita);
  })
} else {
  var jsonReceita = JSON.parse(sessionStorage.getItem("jsonReceita"));
  populaDropDownReceitas(jsonReceita);
}

function populaDropDownReceitas() {
  for (var i = 0; i < jsonReceita.length; i++) {

    $('#receitas').append($('<option>', {
      value: jsonReceita[i].id_receita,
      text: jsonReceita[i].nome_receita
    }));
  }
}