var request = require('request');
var dotenv = require('dotenv').load();

exports.notification = function(req, res) {
  var code = req.body.notificationCode;
  var email = process.env.EMAIL_PAGSEGURO
  var token = process.env.TOKEN_PAGSEGURO;

  transaction(code, email, token);
}

function transaction(code, email, token) {
  var uri = "https://ws.sandbox.pagseguro.uol.com.br/v3/transactions/notifications/" + code + "?email=" + email + "&token=" + token;
  console.log(uri);

  request(uri, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
    }
  });

}
