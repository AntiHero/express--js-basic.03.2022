import supertest from 'supertest';
// @ts-ignore
import sessiontest from 'supertest-session';
import mongoose from 'mongoose';

import app from '../src/app';
import books from '../fakeDb';
import { Book } from '../src/models/books';
import * as booksRepository from '../src/repositories/books';
import { connectToMongoDb } from '../src/utils/connectToMongoDb';

describe('testing static', () => {
  let server: supertest.SuperTest<supertest.Test>;

  beforeEach(() => {
    server = supertest(app);
  });

  test('GET / should return index.html', async () => {
    // jest assertions
    expect.assertions(1);

    const response = await server
      .get('/')
      .expect(200)
      .expect('Content-Type', /html/);

    expect(response.text).toMatch(/Hello, Express!/);
  });
});

describe.skip('/api/books', () => {
  let server: supertest.SuperTest<supertest.Test>;

  beforeEach(() => {
    server = supertest(app);
  });

  test('GET / should return all books', async () => {
    const response = await server
      .get('/api/books')
      .expect(200)
      .expect('Content-Type', /json/);

    expect(response.body).toStrictEqual(books);
  });

  test('POST / should create new book', async () => {
    const book = {
      author: 'Unknown',
      title: 'Unknown',
      year: 2000,
    };

    const responseBeforePost = await server.get('/api/books').expect(200);

    expect(responseBeforePost.headers['content-type']).toMatch(/json/);
    expect(responseBeforePost.body.length).toEqual(3);

    await server.post('/api/books').send(JSON.stringify(book)).expect(204);

    const responseAfterPost = await server
      .get('/api/books')
      .expect(200)
      .expect('Content-Type', /json/);

    expect(responseAfterPost.body.length).toEqual(4);
  });
});

describe.skip('middleware', () => {
  let server: supertest.SuperTest<supertest.Test>;

  beforeEach(() => {
    server = supertest(app);
  });
  test('should call console.log', async () => {
    jest.spyOn(console, 'log');

    await server.get('/api/books');

    expect(console.log).toHaveBeenCalledTimes(2);
  });
});

describe.skip('session', () => {
  let session: supertest.SuperTest<supertest.Test>;

  beforeEach(() => {
    session = sessiontest(app);
  });

  test('GET /counter should increase counter and use cookie', async () => {
    await session.get('/counter').expect(200);

    // index.d.ts
    for (const cookie of session.cookies) {
      if (cookie.name === 'session') {
        expect(
          JSON.parse(Buffer.from(cookie.value, 'base64').toString()).counter
        ).toBe(1);
      }
    }

    expect(session.cookies.length).toBe(2);
  });
});

describe('mongodb', () => {
  let server: supertest.SuperTest<supertest.Test>;

  beforeAll(async () => {
    await connectToMongoDb(process.env.MONGODB_URL_TEST as string);
  });

  beforeEach(async () => {
    server = supertest(app);
    await Book.deleteMany({});
  });

  test('POST /api/books should create book in DB', async () => {
    await server
      .post('/api/books')
      .send({ author: 'test', title: 'test', year: 2000 })
      .expect(201)
      .expect('Content-Type', /json/);

    expect((await booksRepository.getAllBooks()).length).toBe(1);
  });

  test('DELETE /api/books/:id should delete book in DB', async () => {
    expect.assertions(1);

    await server
      .post('/api/books')
      .send({ author: 'test', title: 'test', year: 2000 })
      .expect(201)
      .expect('Content-Type', /json/);

    const books = await booksRepository.getAllBooks();

    if (books.length) {
      const id = books[0]._id.toString();
      await booksRepository.deleteBook(id);
      await server.delete(`/api/books/${id}`).expect(204);
      expect((await Book.find({})).length).toBe(0);
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
