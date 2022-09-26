import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import session from 'cookie-session';
import booksRouter from './controllers/books';

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

app.use('/api/books', booksRouter);

app.get('/counter', (req, res) => {
  if (req.session) {
    req.session.counter = req.session.counter ?? 0;

    res.send({ counter: ++req.session.counter });
    return;
  }

  res.end();
});

app.get('*', (_, res) => {
  res.status(404).send('Not Found! 404');
});

export default app;
