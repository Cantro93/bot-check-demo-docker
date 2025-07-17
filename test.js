const http = require('http');
const BotCheck = require('./botcheck');

// create new bot checker instance, with interval of 5 hours (18000 s) and no CSS
global.bc = new BotCheck(18000, '');

const server = http.createServer((req,res) => {
  // BotCheck will need access to body of POST request 
  let data = '';
  req.on('data', chunk => {data += chunk.toString();});
  req.on('end', () => {

    // this object contains information how to treat that request
    const auth_result = global.bc.auth(req, data, false);

    // auth_result.state values and their meaning were describe in
    switch (auth_result.state) {
      case 'accept':
        // as this request comes from human, serve content as normally
        res.writeHead(200, {'Content-Type': 'text/html', 'Location': 'index.html'});
        res.end(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <meta http-equiv="X-UA-Compatible" content="ie=edge"/>
            <title>Document</title>
          </head>
          <body>
            This would be normal page.
          </body>
          `);
        break;
      case 'reject':
        // your response to bots should go here
        res.writeHead(403, {'Content-Type': 'text/html'});
        res.end(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <meta http-equiv="X-UA-Compatible" content="ie=edge"/>
            <title>403 Forbidden</title>
          </head>
          <body>
            <h1>403 Forbidden</h1><br>
            Traffic from bots prohibited
          </body>
          `);
        break;
      case 'do_auth':
        res.writeHead(200, {'Content-Type': 'text/html', 'Location': 'verify.html'});
        // auth_result.body contains HTML form to be filled by client
        res.end(auth_result.body);
        break;
      default:
        break;
    }
  });
});

server.listen(1080, 'localhost', () => {console.log("server started")});
