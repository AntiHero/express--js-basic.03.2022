import 'supertest';

declare module 'supertest' {
  interface SuperTest<T> {
    cookies: any;
  }
}
