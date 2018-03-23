localStorage.setItem("client_id", "5");
localStorage.setItem("client_secret", "Ky4pxku2WDWWMFImq78Q3FbzzljGpbivCsFcgEVu");

$("#try_login").on('click', function(e) {
  e.preventDefault();

  var user = document.getElementById("inputUser").value;
  var pass = document.getElementById("inputPassword").value;

  $.ajax({
    type: "GET",
    url: userlist,
    dataType: "json",
    success: function(response) {
      authenticate(response, user, pass);
    },
    error: function() {
      alert("problemas ao buscar usuario");
    },
  })

  function authenticate(response, user, pass) {
    console.log(response)

    var userArr = response.data;
    var scope;

    for (var i = 0; i < userArr.length; i++) {
      if (userArr[i].name == user) {
        scope = userArr[i].scope;
      }
    }
    axios.post(auth, {
        username: user,
        password: pass,
        client_id: localStorage.getItem("client_id"),
        client_secret: localStorage.getItem("client_secret"),
        scope: scope,
        grant_type: "password"
      })
      .then(function(ans) {
        console.log(ans);
        localStorage.setItem("bearer", ans.data.token_type + " " + ans.data.access_token);
        localStorage.setItem("refresh", ans.data.refresh_token);
        localStorage.setItem("scope", scope);
        window.location.replace("http://localhost:80/Gastronomia_Frontend/dashboard.html");
      })
      .catch(function(error) {
        console.log(error);
      });
  }
})