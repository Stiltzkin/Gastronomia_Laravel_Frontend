$(document).ready(function () {
    var ingredienteArray = [];
    window.ing = 0;

    $("#novo-ingrediente").click(function () {

        limpaMensagens();
        var formAdicionarIngrediente = $('#form-adicionar-ingrediente');
        var ingrediente = obtemIngredienteDoFormulario(formAdicionarIngrediente);

        var formIng = $('<form class="form_porco_' + ing + '"></form>')
        var htmlLinha = '<tr data-id="' + ingrediente.id + '" class="ig"><td class="info-nome"><input hidden type="text" name="id_ingrediente" value="' + ingrediente.id + '" /><p> ' + ingrediente.nome + '</p></td><td class="info-quantidade"><input hidden type="text" name="quantidade_bruta_receita_ingrediente" value="' + ingrediente.quantidade + '" /><p> ' + ingrediente.quantidade + ' </p></td><td class="botao-excluir">' + ingrediente.excluir + '</td></tr>';

        $(htmlLinha).appendTo(formIng);

        var erros = validaReceita(ingrediente);

        if (erros.length > 0) {
            exibeMensagensDeErro(erros);
            return;
        } else {
            ing++
            return $(".tabela-ingrediente").append(formIng);
        }
    });

    // BOTAO REMOVE INGREDIENTE DA RECEITA
    $("#formIngredientes").on('click', 'td.botao-excluir', function () {
        var splice = $(this).closest('.ig').data('teste');

        for (var i = 0; i < ingredienteArray.length; i++) {
            if (ingredienteArray[i] == splice) {
                ingredienteArray.splice(i, 1);
                break;
            }
        }
        $(this).parent().remove();
        rec--;
    });

    // CAPTURA OS DADOS DO FORMULARIO
    function obtemIngredienteDoFormulario(formAdicionarIngrediente) {
        var nomeIngredientes = document.getElementById("nomeIngredientes");

        // BOTAO EXCLUIR GERADO
        var htmlBotao = '<button type="button" class="excluir">Excluir</button>';

        var ingrediente = {
            id: nomeIngredientes.options[nomeIngredientes.selectedIndex].value,
            nome: nomeIngredientes.options[nomeIngredientes.selectedIndex].text,
            quantidade: document.getElementById("quantidade").value,
            // unidade: document.querySelector("#unidade").textContent,
            excluir: htmlBotao
        }
        return ingrediente;
    }

    // VALIDAÇAO DO INGREDIENTE
    function validaReceita(ingrediente) {
        var erros = [];

        // ingredienteArray.push($('#nomeIngrediente option:selected').index());
        var idx = $.inArray(ingrediente.id, ingredienteArray);
        if (ingrediente.quantidade == 0 || ingrediente.quantidade == "") {
            erros.push("A QUANTIDADE do ingrediente não pode ser em branco");
        }
        if (document.getElementById("nomeIngredientes").selectedIndex == "0") {
            erros.push("SELECIONE o ingrediente");
        }
        if (idx != -1) {
            erros.push("O Ingrediente JA ESTÁ INSERIDO");
        }
        if (isNaN(ingrediente.quantidade)) {
            erros.push("A quantidade deve ser conter NUMERCOS APENAS");
        }
        if ((idx == -1 && ingrediente.quantidade != 0) && !isNaN(ingrediente.quantidade)) {
            ingredienteArray.push(ingrediente.id);
            erros.length = 0;
        }
        return erros;
    }

    function exibeMensagensDeErro(erros) {
        var ul = document.querySelector("#mensagens-ing-receita-erro");
        ul.innerHTML = "";

        erros.forEach(function (erro) {
            var li = document.createElement("li");
            li.textContent = erro;
            ul.appendChild(li);
        })
    }
});