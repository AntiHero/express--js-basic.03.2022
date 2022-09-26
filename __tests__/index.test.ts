import supertest from 'supertest';

import app from '../src/app';
import books from '../fakeDb';

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

describe('/api/books', () => {
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

    console.log(responseBeforePost.headers);
    expect(responseBeforePost.headers['content-type']).toMatch(/json/);
    expect(responseBeforePost.body.length).toEqual(3);

    await server
      .post('/api/books')
      .send(JSON.stringify(book))
      .expect(204);

    const responseAfterPost = await server
      .get('/api/books')
      .expect(200)
      .expect('Content-Type', /json/);

    expect(responseAfterPost.body.length).toEqual(4);
  });
});
