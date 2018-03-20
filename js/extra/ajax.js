function ajax(params, url) {
  $.ajax({
    type: "GET",
    url: "http://localhost:8000/api/veiculos/verifytoken",
    beforeSend: function(xhr, settings) {
      xhr.setRequestHeader('Authorization', localStorage.getItem("bearer"));
    },
    success: function(response) {
      console.log(response)
      post(params, url);
    },
    error: function(response) {
      console.log("erro, 401");
      renovaToken();
      post(params, url);
    }
  });
};

function post(params, url) {
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
          text: response.responseJSON.message,
          type: "success"
        },
        function() {
          location.reload();
        }
      )
    },
    error: function(response) {
      var messages = response.responseJSON.message;
      for (var i = 0; i < messages.length; i++) {
        $('#mensagens-erro').append(messages[i]);
      }
    }
  });
}

function renovaToken() {
  axios.post('http://localhost:8000/oauth/token', {
      client_id: localStorage.getItem("client_id"),
      client_secret: localStorage.getItem("client_secret"),
      grant_type: "refresh_token",
      refresh_token: localStorage.getItem("refresh")
    })
    .then(function(response) {
      console.log(response);
      localStorage.setItem("bearer", response.data.token_type + " " + response.data.access_token);
      localStorage.setItem("refresh", response.data.refresh_token);
      window.location.replace("veiculos.html");
    })
    .catch(function(response) {
      alert(response.responseJson);
    });
}


// var marca = document.getElementById("marca").value;
// var modelo = document.getElementById("modelo").value;
// var ano = document.getElementById("ano").value;
// var preco = document.getElementById("preco").value;

// var params = "marca=" + marca + "&modelo=" + modelo + "&ano=" + ano + "&preco=" + preco + "";

// var fd = new FormData(document.getElementById("novo_veiculo"));
// var xhr = new XMLHttpRequest(),
//   method = "POST",
//   url = "xhr://localhost:8000/api/veiculos/";
//
// xhr.open(method, url, true);
// xhr.setRequestHeader("Content-type", "application/json");
// xhr.setRequestHeader("Accept", "application/json");
// xhr.setRequestHeader("Authorization", localStorage.getItem("bearer"));
//
// xhr.onreadystatechange = function() { //Call a function when the state changes.
//   if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
//     alert(xhr.responseText);
//   }
// }
//
// xhr.addEventListener("load", function(event) {
//   alert(event.target.responseText);
// });
//
// xhr.addEventListener("error", function(event) {
//   alert('Oups! Something goes wrong.');
// });
//
// xhr.send(fd);


function getThings(url0, url1, url2, objectsType, paginate) {
  var urlArr = [];

  for (var i = 0; i < 3; i++) {
    if (typeof(url + "" + i + "") !== undefined || (url + "" + i + "") != null) {
      urlArr.push(url + "" + i + "");
    }
  }

  for (var j = 0; j < urlArr.length; j++) {
    $.ajax({
      type: "GET",
      url: urlArr[j],
      dataType: "json",
      beforeSend: function(xhr, settings) {
        xhr.setRequestHeader('Authorization', localStorage.getItem("bearer"));
      },
      success: function(response) {
        for (var i = 0; i < objectsType.length; i++) {
          if (objectsType[i] == "ingrediente_paginate") {
            jsonPaginateIngrediente = jsonObjectIngrediente.data.data;
            paginate = jsonObjectIngrediente.data;
          }
          if (objectsType[i] == "unidade") {
            jsonUnidade = jsonObjectUnidade.data;
          }
          if (objectsType[i] == "ingrediente_all") {
            jsonIngrediente = jsonObjectIngrediente.data.data;
          }
        }
      },
      error: function() {
        alert("problemas no get");
      },
    }).done(function() {
      if (paginate != null || typeof(paginate) !== undefined) {
        return paginate;
      }
    })
  }
}