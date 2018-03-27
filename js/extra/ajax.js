// function validaToken() {
//   $.ajax({
//     type: "GET",
//     url: "http://localhost:8000/api/verificatoken",
//     beforeSend: function(xhr, settings) {
//       xhr.setRequestHeader('Authorization', localStorage.getItem("bearer"));
//     },
//     success: function(response) {
//       // console.log(response)
//     },
//     error: function(response) {
//       // console.log(response);
//       renovaToken();
//     }
//   });
// };
function logoff() {
  localStorage.clear();
  window.location.replace("http://localhost/Gastronomia_Frontend/");
}

// function renovaToken() {
//   axios.post(window.auth, {
//       client_id: localStorage.getItem("client_id"),
//       client_secret: localStorage.getItem("client_secret"),
//       grant_type: "refresh_token",
//       refresh_token: localStorage.getItem("refresh"),
//       scope: localStorage.getItem("scope")
//     })
//     .then(function(response) {
//       console.log(response);
//       localStorage.setItem("bearer", response.data.token_type + " " + response.data.access_token);
//       localStorage.setItem("refresh", response.data.refresh_token);
//       window.location.replace("veiculos.html");
//     })
//     .catch(function(response) {
//       alert(response.responseJson);
//     });
// }

function postAjax(params, url) {
  $.ajax({
    type: "POST",
    url: url,
    dataType: "json",
    data: params,
    beforeSend: function(xhr, settings) {
      xhr.setRequestHeader('Authorization', localStorage.getItem("bearer"));
    },
    success: function(response) {
      swal({
          title: "Sucesso!",
          text: response.message,
          type: "success"
        },
        function() {
          sessionStorage.clear();
          location.reload();
        }
      )
    },
    error: function(response) {
      var messages = response.responseJSON.message;
      var classErro = document.getElementsByClassName("mensagens-erro");
      for (var j = 0; j < classErro.length; j++) {
        for (var i = 0; i < messages.length; i++) {
          var li = document.createElement("li");
          li.innerHTML = messages[i];
          classErro[j].append(li);
        }
      }

      var messages_2 = response.responseJSON.message_2;
      if (typeof(messages_2) !== undefined || messages_2 != null) {
        for (var k = 0; k < classErro.length; k++) {
          for (var l = 0; l < messages_2.length; l++) {
            var li = document.createElement("li");
            li.innerHTML = messages_2[l];
            classErro[k].append(li);
          }
        }
      }
    }
  });
}

function getAjax(urlName, urlValue) {
  var jsonAns = $.Deferred();
  var paginate;
  $.ajax({
    type: "GET",
    url: urlValue,
    // async: false,
    dataType: "json",
    beforeSend: function(xhr, settings) {
      xhr.setRequestHeader('Authorization', localStorage.getItem("bearer"));
    },
    success: function(response) {
      if (urlName == "ingrediente_paginate") {
        jsonAns.resolve(response.data);
      }
      if (urlName == "listIngrediente") {
        jsonAns.resolve(response.data);
      }
      if (urlName == "unidade") {
        jsonAns.resolve(response.data);
      }
      if (urlName == "ingrediente_all") {
        jsonAns.resolve(response.data.data);
      }
      if (urlName == "receita_paginate") {
        jsonAns.resolve(response.data);
      }
      if (urlName == "listPeriodo") {
        jsonAns.resolve(response.data);
      }
      if (urlName == "listAula") {
        jsonAns.resolve(response.data);
      }
      if (urlName == "listClassificacao") {
        jsonAns.resolve(response.data);
      }
      if (urlName == "listCategoria") {
        jsonAns.resolve(response.data);
      }
      if (urlName == "receita_especifica") {
        jsonAns.resolve(response.data);
      }
      if (urlName == "listReceita") {
        jsonAns.resolve(response.data);
      }
    },
    error: function() {
      console.log("problemas no get");
    },
  })
  return jsonAns.promise();
}