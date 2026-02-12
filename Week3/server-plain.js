// server.mjs
import { createServer } from 'node:http';

function answerRequest(statusCode, message, response) {
  response.writeHead(statusCode, { 'Content-Type': 'text/plain' });
  response.end(message);
}



const server = createServer((req, res) => {

console.log(`Received request for ${req.url}`);

  if(req.url == '/') { 
    answerRequest(200, 'Welcome to the Home Page!\n', res);
  } else if(req.url == '/about') {
    answerRequest(200, 'This is the About Page.\n', res);
  } else {  
    answerRequest(404, 'Page Not Found.\n', res);
  }
 

});

// starts a simple http server locally on port 3000
server.listen(3000, '127.0.0.1', () => {
  console.log('Listening on 127.0.0.1:3000');
});

// run with `node server.mjs`
