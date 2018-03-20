$("#try_login").on('click', function() {

  var user = document.getElementById("inputUser").value;
  var pass = document.getElementById("inputPassword").value;

  axios.post('http://localhost:8000/oauth/token', {
      username: user,
      password: pass,
      client_id: localStorage.getItem("client_id"),
      client_secret: localStorage.getItem("client_secret"),
      scope: "usuario",
      grant_type: "password"
    })
    .then(function(response) {
      console.log(response);
    })
    .catch(function(error) {
      console.log(error);
    });
})