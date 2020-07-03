import { createServer } from 'http';
import { createReadStream, readFileSync } from 'fs';

var server = createServer(function (req, res) {

  if (req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/html" });
    createReadStream("test_http.html", "UTF-8").pipe(res);
    console.log("here is get");
  }
  else if (req.method === "POST") {
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

      var content = readFileSync("users.json");
      var jsonarray = JSON.parse(content);
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
      res.write('{"isAuth":"' + token1 + '"}');
      res.end();
      console.log("here is end");
    });
  }

}).listen(3000);