import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import books from '../fakeDb';
import session from 'cookie-session';
import { idGenerator } from './utils/idGenerator';
import { requestLogger } from './middlewares/logger';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const oneDay = 1000 * 60 * 60 * 24;

app.use(
  session({
    secret: 'sfajnh4faAN99', // обязательное поле
    maxAge: oneDay,
  })
);

app.get('/counter', (req, res) => {
  if (req.session) {
    req.session.counter = req.session.counter ?? 0;

    res.send({ counter: ++req.session.counter});
    return;
  }

  res.end();
});

app.get(
  '/api/books',
  requestLogger,
  (req: express.Request, res: express.Response) => {
    res.status(200).send(books);
  }
);

app.get('/api/books/:id', (req, res) => {
  for (const book of books) {
    if (book.id === Number(req.params.id)) {
      res.status(200).send(book);
      return;
    }
  }
  res.sendStatus(404);
});

app.delete('/api/books/:id', (req, res) => {
  const id = Number(req.params.id);

  for (let i = 0; i < books.length; i++) {
    if (books[i].id === id) {
      books.splice(i, 1);
      res.sendStatus(204);
      return;
    }
  }

  res.sendStatus(404);
});

app.post('/api/books', (req, res) => {
  const { author, title, year } = req.body;
  books.push({ id: idGenerator(), author, title, year });

  res.sendStatus(204);
});

app.get('*', (_, res) => {
  res.status(404).send('Not Found! 404');
});

export default app;
