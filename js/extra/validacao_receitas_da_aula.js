window.receitaArray = [];
window.rec = 0;
$("#btnAddReceita").click(function(event) {
    event.preventDefault();

    limpaMensagens();
    var formAdicionarReceita = $('#form_addAula');
    var receita = obtemReceitaDoFormulario(formAdicionarReceita);

    var htmlTr = $('<tr data-id="' + receita.id + '" class="ig"></tr>');
    var htmlTdNome = $('<td class="info-nome"><input hidden class="eachReceitaAula' + rec + '" type="text" name="receitas[' + rec + '][id_receita]" value="' + receita.id + '" /><p>' + receita.nome + '</p></td>');
    var htmlTdQtd = $('<td class="info-quantidade"><input hidden class="eachQuantidadeReceita' + rec + '" type="text" name="receitas[' + rec + '][quantidade_receita]" value="' + receita.quantidade + '" /><p>' + receita.quantidade + '</p></td>');

    var htmlExcluirBtn = '<td class="botao-excluir">' + receita.excluir + '</td>'

    $(htmlTdNome).appendTo(htmlTr);
    $(htmlTdQtd).appendTo(htmlTr);

    $(htmlExcluirBtn).appendTo(htmlTr);

    var erros = validaReceita(receita);
    if (erros.length > 0) {
        exibeMensagensDeErro(erros);
    } else {
        $('.tabela_receita').append(htmlTr);
        rec++;
    }
});

// BOTAO REMOVE RECEITA DA AULA
$(".tabela_receita").on('click', '.excluir', function() {
    var splice = $(this).closest('tr').data('id');

    for (var i = 0; i < receitaArray.length; i++) {
        if (receitaArray[i] == splice) {
            receitaArray.splice(i, 1);
            break;
        }
    }
    $(this).closest('tr').remove();
    rec--;
});

// CAPTURA OS DADOS DO SELECT RECEITA
function obtemReceitaDoFormulario(formAdicionarReceita) {
    var nomeReceita = document.getElementById("receitas");

    // BOTAO EXCLUIR GERADO
    var htmlBotao = '<button type="button" class="excluir">Excluir</button>';

    var receita = {
        id: nomeReceita.options[nomeReceita.selectedIndex].value,
        nome: nomeReceita.options[nomeReceita.selectedIndex].text,
        quantidade: document.getElementById("numero_de_receitas").value,
        excluir: htmlBotao
    }
    return receita;
}

// VALIDAÇAO DA RECEITA
function validaReceita(receita) {
    var erros = [];
    var idx = $.inArray(receita.id, receitaArray);

    if (document.getElementById("receitas").selectedIndex == 0 || document.getElementById("receitas").value == 0) {
        erros.push("SELECIONE uma receita");
    }
    if (idx != -1) {
        erros.push("A receita JA ESTÁ INSERIDO");
    }
    if (receita.quantidade == 0 || receita.quantidade == "") {
        erros.push("A QUANTIDADE de receitas não pode ser em branco");
    }
    if (isNaN(receita.quantidade)) {
        erros.push("A quantidade de receitas deve conter NUMERCOS APENAS");
    }
    if (idx == -1 && receita.quantidade != 0 && !isNaN(receita.quantidade) && document.getElementById("receitas").selectedIndex != 0) {
        receitaArray.push(receita.id);
        erros.length = 0;
    }
    return erros;
}

function exibeMensagensDeErro(erros) {
    $.each(erros, function(index, erro) {
        var li = $("<li>" + erro + "</li>");
        $(li).appendTo('#mensagens-erro-aula');
    });
}