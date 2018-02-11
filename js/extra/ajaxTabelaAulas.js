// ==================== GET ===================== //

for (var i = 0; i < listArray.length; i++) {
    if (listArray[i].key == "listAula") {
        var listAula = listArray[i].value;
    }
    if (listArray[i].key == "listIngrediente") {
        var listIngrediente = listArray[i].value;
    }
    if (listArray[i].key == "listReceita") {
        var listReceita = listArray[i].value;
    }
    if (listArray[i].key == "listPeriodo") {
        var listPeriodo = listArray[i].value;
    }
}

// verifica se foi dado get das receitas, aulas e periodo, caso nao tenha dado ele dará get aqui
if (typeof jsonAula === 'undefined' || typeof jsonReceita === 'undefined' || typeof jsonPeriodo === 'undefined') {
    $.getJSON(listPeriodo, function(jsonObjectPeriodo) {
        var jsonPeriodo = jsonObjectPeriodo.data;
        // get da tabela de aulas 
        $.getJSON(listAula, function(jsonObjectAula) {
            var jsonAula = jsonObjectAula.data;
            // get da tabela de receitas
            $.getJSON(listReceita, function(jsonObjectReceita) {
                var jsonReceita = jsonObjectReceita.data;
                getTabela(jsonAula, jsonReceita, jsonPeriodo);
            })
        })
    })

} else {
    getTabela(jsonAula, jsonReceita, jsonPeriodo);
}

function getTabela(jsonAula, jsonReceita, jsonPeriodo) {
    // geração de botoes
    var botaoExcluir = '<td><button type="button" class="btn btn-xs btn-danger excluir"><i class="fa fa-trash"></i></button></td>';
    var botaoEditar = '<td><button class="btn btn-xs editar" type="button"><i class="fa fa-edit"></i></button></td>';
    var botaoAgendarAula = '<td><button class="botaoAgendarAula" type="button">Agendar Aula</button></td>';
    var botaoAulaConcluida = '<td><button class="botaoAulaConcluida" type="button">Aula Concluida</button></td>';
    var botaoDetalhes = '<td><button type="button" class="btn btn-xs botaoDetalhes"><i class="fa fa-eye"></i></button></td>';

    // novaId e velhaID sao usados para não passar o foreach de mesma Id 2x (a tabela associativa aula_receita pode ter varias id_aula iguais)
    var novaId = 0;
    var velhaId = 0;

    // chamado em xunxo.js
    var jsonAulaReceita = pivotAula(jsonAula, jsonPeriodo);
    console.log(jsonAulaReceita);
    $.each(jsonAula, function(indexAula, valAula) {
        novaId = valAula.id_aula;

        for (var i = 0; i < jsonAulaReceita.length; i++) {
            if (novaId != velhaId) {
                // conta o numero de receitas na aula
                var countReceitas = jsonAulaReceita[i].length;

                if (valAula.id_aula == jsonAulaReceita[i].id_aula || countReceitas == 0) {
                    // cria a 'tr' de cada aula para ficar em formato de lista
                    var htmlList = $('<tr class="id-aula" data-id="' + valAula.id_aula + '"></tr>');

                    // cria as 'td' com os valores da aula E joga as 'td' dentro da 'tr' htmlList (<tr><td>  </td></tr>)
                    $('<td hidden class="id_aula">' + valAula.id_aula + '</td>').appendTo(htmlList);
                    $('<td class="nome_aula">' + valAula.nome_aula + '</td>').appendTo(htmlList);
                    $('<td class="descricao_aula">' + valAula.descricao_aula + '</td>').appendTo(htmlList);
                    $('<td class="dia_da_aula">' + valAula.data_aula + '</td>').appendTo(htmlList);
                    $('<td class="periodo">' + jsonAulaReceita[i].periodo_aula + '</td>').appendTo(htmlList);
                    $('<td class="num_receitas">' + countReceitas + '</td>').appendTo(htmlList);

                    // joga os botoes detalhes e excluir dentro da 'tr'
                    $(botaoDetalhes).appendTo(htmlList);

                    // se aula_agendada = false, a aula NAO ESTA agendada
                    if (valAula.aula_agendada == false) {
                        $(botaoExcluir).appendTo(htmlList);
                        $(botaoEditar).appendTo(htmlList);
                        $(botaoAgendarAula).appendTo(htmlList);
                        $(htmlList).appendTo('.listaAulasPlanejadas');
                    }
                    // se aula_agendada = true, aula ESTA AGENDADA
                    if (valAula.aula_agendada == true && valAula.aula_concluida == false) {
                        $('<td><button type="button" class="btn btn-xs btn-danger excluir_concluida"><i class="fa fa-trash"></i></button></td>').appendTo(htmlList);

                        $(botaoAulaConcluida).appendTo(htmlList);
                        $(htmlList).appendTo('.listaAulasAgendadas');
                    }
                    // se aula_agendada = true E se aula_concluida = true, aula ESTA CONCLUIDA
                    if (valAula.aula_agendada == true && valAula.aula_concluida == true) {
                        // .aulaConcluidaList esta localizado em aulas-concluidas.html
                        $(botaoExcluir).appendTo(htmlList);
                        $(htmlList).appendTo('.aulaConcluidaList');
                    }
                    velhaId = novaId;
                }
            }
        }


    })
}

// ===================== POST PUT ===================== //
$('#addAula').on('click', '#saveButton', function() {

    var formAula = $('#form_addAula');

    // pega id da aula (se vazio = POST, se tem algo = PUT)
    idData = $('#form_addAula').find('.id_aula').val();
    load_url();
    var aulaSerialized = formAula.serializeArray();

    aulaSerialized.push({
        name: 'aula_agendada',
        value: false
    }, {
        name: 'aula_concluida',
        value: false
    })


    if (idData == 0) {
        var urlData = createAula;
        adicionaAula();
        aulaReceita_control();
    } else {
        var urlData = updateAula;
        idCount();
    }

    function adicionaAula() {
        console.log(aulaSerialized)
        $.ajax({
            type: "POST",
            url: urlData,
            dataType: "json",
            data: aulaSerialized,
            success: function() {
                console.log('aula criada')
                // $('#mensagens-sucesso-aula').append('Aula criado com sucesso!');
            },
            error: function() {
                swal({
                        title: "Problemas para criar aula",
                        type: "error",
                        confirmButtonText: "Ok",
                        confirmButtonColor: "#DD6B55",
                    },
                    function() {
                        location.reload(true);
                    }
                )
            }
        });
    }

    // chama a funçao deleteReceita() para apagar tudo com id_aula especifica, em seguida chama a funçao adicionaReceita()
    function idCount() {
        var idAssoc = [];
        var idDataTemp = idData;

        // cria array das primary key de aula_receita
        $.map(jsonAulaReceita, function(valAulaReceita) {
            if (valAulaReceita.id_aula == idData) {
                idAssoc.push(valAulaReceita.id_aula_receita);
            }
        })
        deleteReceita(idAssoc);

        // retorna a id da aula para idData
        idData = idDataTemp;

        aulaReceita_control();
    }

    //EDIT
    // Remove a associação da aula especifica
    function deleteReceita(idAssoc) {

        for (var i = 0; i < idAssoc.length; i++) {

            idData = idAssoc[i];
            load_url();

            $.ajax(deleteAulaReceita, {
                type: 'DELETE',
                data: {
                    "id_aula_receita": idAssoc
                },
                dataType: 'json',
                success: function() {
                    console.log("Receita da associativa removido");
                },
                error: function() {
                    console.log("Problemas para remover as receitas da associativa");
                }
            })
        }

    }

    // Adiciona todas as Receitas da aula
    function aulaReceita_control() {

        var jsonAulaLoc;

        $.getJSON(listAula).always(function(jsonObjectAulaLoc) {
            jsonAulaLoc = jsonObjectAulaLoc;
        })

        // se estiver criando aula idData == 0, vai buscar a id dessa aula para adicionar as receitas
        if (idData == 0) {
            // imagina que, var lastAulaInfo = lastId;
            var lastAulaInfo = searchLastId(jsonAulaLoc, 'id_aula');

            if (typeof lastAulaInfo === 'undefined') {
                idData = 1;
            } else {
                idData = lastAulaInfo;
                idData++;
                var idDataTemp = idData;
            }
            eachReceita(idDataTemp);
        } else {
            return editAula();
        }

        // pega a id da aula que acabou de ser criada, ao criar uma aula ele ja irá ir inserindo as receitas
        function searchLastId(arr, prop) {

            var lastId;
            for (var i = 0; i < arr.length; i++) {
                if (!lastId || parseInt(arr[i][prop]) > parseInt(lastId[prop]))
                    lastId = arr[i];
            }
            return lastId.id_aula;
        }
    }

    function editAula() {
        idData = $('#form_addAula').find('.id_aula').val();
        // var idDataTemp = idData;

        var aulaSerialized = $('#form_addAula').serializeArray();
        load_url();
        aulaSerialized.push({
            name: 'aula_agendada',
            value: false
        }, {
            name: 'aula_concluida',
            value: false
        })
        console.log(aulaSerialized);
        $.ajax({
            type: "POST",
            url: updateAula,
            data: aulaSerialized,
            dataType: 'json',
            success: function() {
                console.log('editou aula');
                eachReceita();
            },
            error: function() {
                swal({
                        title: "Problemas ao editar aula",
                        type: "error",
                        confirmButtonText: "Ok",
                        confirmButtonColor: "#DD6B55",
                    },
                    function() {
                        location.reload();
                    }
                )
            }
        });
    }
    // serializa o form_muito_porco do html e adiciona a ID da aula, ele da post para cada receita individualmente na associativa
    function eachReceita(idDataTemp) {
        var receitaArr = [];

        for (i = 0; i < rec; i++) {
            var receita = $('.form_muito_porco' + i + '').serializeArray();
            receita.push({
                name: 'id_aula',
                value: '' + idDataTemp + ''
            })
            receitaArr.push(receita)
        }
        console.log(receitaArr)
        postReceita(receitaArr);
    }

    function postReceita(receitaArr) {
        console.log(receitaArr)

        for (var i = 0; i < receitaArr.length; i++) {
            $.ajax({
                    type: "POST",
                    url: createAulaReceita,
                    data: receitaArr[i],
                    dataType: 'json',
                    success: function() {
                        $('#addAula').modal('hide')
                        swal({
                                title: "SUCESSO!",
                                type: "success",
                            },
                            function() {
                                location.reload(true);
                            }
                        )
                    },
                    error: function() {
                        swal({
                                title: "Problemas na inserção das receitas na aula",
                                type: "error",
                                confirmButtonText: "Ok",
                                confirmButtonColor: "#DD6B55",
                            },
                            function() {
                                location.reload(true);
                            }
                        )
                    }
                }

            );
        }

    }
});

// ===================== DELETE ===================== //
$('.aulas').on('click', '.excluir', function() {
    var thisTr = $(this).closest('tr');
    idData = thisTr.data('id');

    load_url();

    swal({
            title: "Tem certeza que deseja deletar esta aula?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Deletar!",
            closeOnConfirm: false,
        },
        function() {
            $.ajax(deleteAula, {
                type: 'DELETE',
                data: {
                    "id_aula": idData
                },
                dataType: 'json',
                success: function() {
                    swal({
                            title: "Aula removido com sucesso!",
                            type: "success",
                        }),
                        function() {
                            location.reload(true);
                        }
                },
                error: function() {
                    swal({
                        title: "Problemas ao remover a aula",
                        type: 'error',
                    })
                },
            })
        }
    );
});

// === === === === === == CLONAR AULA === === === === === === == //
$('#verAula').on('click', '.clonar', function() {
    // xunxo para pegar a id da aula
    var idAula = $(this).closest('.modal-body').find('.receitasQuantidade').find('tr').data('id');

    // formulario não existe, criando um array serializado vazio
    var aulaCloneSerial = $('#idNaoExiste').serializeArray();

    $.map(jsonAula, function(valueAula) {
        if (valueAula.id_aula == idAula) {
            var objClone = new Object();
            objClone.id_aula = '';
            objClone.nome_aula = valueAula.nome_aula + ' CLONE';
            objClone.descricao_aula = valueAula.descricao_aula;
            objClone.data_aula = '';
            objClone.periodo_aula = valueAula.periodo_aula;
            objClone.aula_concluida = 'false';
            objClone.aula_agendada = 'false';

            // inserindo todos os dados da aula a ser clonada dentro da array serializado vazio
            aulaCloneSerial.push(objClone);

            cloneAulaPost(objClone)
        }
    })

    function cloneAulaPost(objClone) {
        load_url();
        console.log(objClone)
        swal({
                title: "Clonar esta aula?",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Clonar",
                closeOnConfirm: false,
            },
            function() {
                $.ajax(createAula, {
                    type: 'POST',
                    data: objClone,
                    dataType: 'json',
                    success: function() {
                        console.log('aula clonada')
                        clonaReceitas();
                    },
                    error: function() {
                        swal({
                            title: "Problemas ao clonar aula",
                            type: "warning",
                            confirmButtonText: "Vish Maria",
                            confirmButtonColor: "#DD6B55",
                        }, function() {
                            location.reload()
                        })
                    }
                })
            }
        );
    }

    function clonaReceitas() {
        // insere a ultima id_aula criada na variavel
        var lastIdObj = searchLastId(jsonAula, 'id_aula');
        var lastId = lastIdObj.id_aula;
        lastId++;

        var cloneArr = cloneArray();
        console.log(cloneArr)
        clonaReceitasPost(cloneArr);

        // pega a id da aula que acabou de ser clonada
        function searchLastId(arr, prop) {

            var lastId;
            for (var i = 0; i < arr.length; i++) {
                if (!lastId || parseInt(arr[i][prop]) > parseInt(lastId[prop]))
                    lastId = arr[i];
            }
            return lastId;
        }

        function cloneArray() {
            var cloneArr = [];
            $.map(jsonAulaReceita, function(valAulaReceita) {
                if (valAulaReceita.id_aula == idAula) {

                    // formulario não existe, criando um array serializado vazio
                    var receitaCloneSerial = $('#idNaoExiste').serializeArray();

                    receitaCloneSerial.push({
                        name: 'id_receita',
                        value: valAulaReceita.id_receita
                    }, {
                        name: 'quantidade_receita',
                        value: valAulaReceita.quantidade_receita
                    }, {
                        name: 'id_aula',
                        value: lastId
                    })
                    cloneArr.push(receitaCloneSerial);
                }
            })
            return cloneArr;
        }
    }

    function clonaReceitasPost(cloneArr) {
        for (var j = 0; j < cloneArr.length; j++) {
            $.ajax({
                type: 'POST',
                url: createAulaReceita,
                data: cloneArr[j],
                dataType: 'json',
                success: function() {
                    swal({
                        title: 'Aula clonado com sucesso!',
                        text: 'Clone está localizado em Planejar Aulas',
                        type: 'success',
                        confirmButtonText: "Ok",
                    }, function() {
                        location.reload(true)
                    });
                },
                error: function() {
                    swal({
                        title: "Problemas ao copiar as receitas da aula",
                        type: "warning",
                        confirmButtonText: "Vish Maria",
                        confirmButtonColor: "#DD6B55",
                    }, function() {
                        location.reload(true)
                    })
                }
            })
        }
    }
})