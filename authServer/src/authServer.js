const express = require('express');

const app = express();
const port = 3010;

app.post('/', (req, res) => {
  let body = '';
  req.on('data', (chunk) => {
    console.log(chunk);
    body += chunk;
    console.log(body);
    console.log('here is data chunk');
  });
  req.on('end', () => {
    res.writeHead(200, { 'Content-Type': 'text/html' });

    console.log(body);
    const user = JSON.parse(body);

    const { email } = user;
    const { password } = user;

    console.log(email);
    console.log(password);

    const jsonarray = require('../utils/users.json');
    let emailFound = false;
    let token1 = false;

    for (let i = 0; i < jsonarray.length; i += 1) {
      if (email === jsonarray[i].email) {
        emailFound = true;
        console.log(`found email: ${jsonarray[i].email}`);
        if (password === jsonarray[i].password) {
          console.log(`correct password: ${jsonarray[i].password}`);
          token1 = true;
        } else {
          console.log('wrong password');
          token1 = false;
        }
      }
    }

    res.write(`{"isAuth":${token1}}`);
    res.end();
    console.log('authResult === ', token1);
  });
});
app.listen(port, () => console.log(`AuthServer listening at http://localhost:${port}`));
