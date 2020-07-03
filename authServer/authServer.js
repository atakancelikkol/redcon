var http = require('http');
var fs = require('fs');

var server = http.createServer(function (req, res) {

  if (req.method === "POST") {
    console.log("here is post");

    var body = "";
    req.on("data", function (chunk) {
      console.log(chunk);
      body += chunk;
      console.log(body);
      console.log("here is data chunk");
    });

    req.on("end", function () {
      res.writeHead(200, { "Content-Type": "text/html" });

      console.log(body);
      var user = JSON.parse(body)

      var email = user.email;
      var password = user.password;

      console.log(email);
      console.log(password);

      var jsonarray = require('./users.json');
      var emailFound = false;
      var token1 = false;
      var preStr = '';

      for (var i = 0; i < jsonarray.length; i++) {
        if (email == jsonarray[i].email) {
          emailFound = true;
          console.log("found email: " + jsonarray[i].email);
          if (password == jsonarray[i].password) {
            console.log("correct password: " + jsonarray[i].password);
            token1 = true;
          }
          else {
            console.log('wrong password')
            token1 = false;
          }
        }
      }
      if (!emailFound) {
        preStr = 'no such email in database : ';
      }
      else {
        preStr = '';
      }
      res.write('{"isAuth":' + token1 + '}');
      res.end();
      console.log("authResult === ", token1);
    });
  }

}).listen(3010);