import { Router } from 'express';
import * as booksRepository from '../repositories/books';

const booksRouter = Router();

booksRouter.get('/', async (_, res) => {
  try {
    const books = await booksRepository.getAllBooks();
    res.status(200).send(books);
  } catch (e) {
    res.sendStatus(400);
  }
});

booksRouter.get('/:id', async (req, res) => {
  try {
    const book = await booksRepository.getBook(req.params.id);
    res.status(200).json(book);
  } catch (e) {
    res.sendStatus(404);
  }
});

booksRouter.delete('/:id', async (req, res) => {
  try {
    await booksRepository.deleteBook(req.params.id);
    res.sendStatus(204);
  } catch (e) {
    res.sendStatus(404);
  }
});

booksRouter.post('/', async (req, res) => {
  try {
    const { author, title, year } = req.body;

    const book = await booksRepository.postBook({ author, title, year });
    res.status(201).json(book);
  } catch (e) {
    res.sendStatus(400);
  }
});

booksRouter.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const book = await booksRepository.getBook(id);

    if (!book) return res.sendStatus(404);

    const { author, title, year } = req.body;

    await booksRepository.updateBook(id, {
      author,
      title,
      year,
    });

    res.status(200);
  } catch (e) {
    res.sendStatus(400);
  }
});

export default booksRouter;
