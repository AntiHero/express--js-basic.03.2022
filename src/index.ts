import { resolve } from 'node:path';
import http from 'node:http';
import fs from 'node:fs';

import * as dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 8000;

const html = fs.readFileSync(resolve(process.cwd(), 'public/index.html'));
const css = fs.readFileSync(resolve(process.cwd(), 'public/styles.css'));
const js = fs.readFileSync(resolve(process.cwd(), 'public/index.js'));

const server = http.createServer((req, res) => {
  switch (req.url) {
    case '/':
      switch (req.method) {
        case 'GET':
          res.statusCode = 200;
          res.write(html);
          res.end();
          break;
        case 'POST':
          res.statusCode = 405;
          res.end('Not Allowed');
          break;
      }
      break;
    case '/styles.css':
      res.writeHead(200, {
        'Content-Type': 'text/css',
      });
      res.write(css);
      res.end();
      break;
    case '/index.js':
      res.writeHead(200, {
        'Content-Type': 'application/json',
      });
      res.write(js);
      res.end();
      break;
    case '/api/books':
      res.writeHead(200, {
        'Content-Type': 'application/json',
      });
      res.write(
        JSON.stringify({ title: 'Learn JS', year: 2002, author: 'Unknown' })
      );
      res.end();
      break;
    default:
      res.statusCode = 404;
      res.end('Not Found! 404!');
  }
});

server.listen(PORT, () => {
  console.log('Server is running at http://localhost:%s', PORT);
});
