import { Book, BookSchema } from '../models/books';

export const getAllBooks = async () => {
  try {
    return Book.find({});
  } catch (e) {
    return Promise.reject("Can't load data");
  }
};

export const postBook = async ({ author, year, title }: BookSchema) => {
  const book = new Book({
    author,
    year,
    title,
  });

  try {
    const savedBook = await book.save();
    return savedBook;
  } catch (e) {
    // error processing;
    return Promise.reject("Can't save data");
  }
};

export const getBook = async (id: string) => {
  try {
    return Book.findById(id).exec();
  } catch (e) {
    return Promise.reject("Can't load data");
  }
};

export const deleteBook = async (id: string) => {
  try {
    await Book.findByIdAndDelete(id).exec();
  } catch (e) {
    return Promise.reject("Can't load data");
  }
};

export const updateBook = async (
  id: string,
  { author, year, title }: BookSchema
) => {
  try {
    const book = await Book.findByIdAndUpdate(id, {
      author,
      year,
      title,
    }, { new: true }).exec();
    return book;
  } catch (e) {
    return Promise.reject("Can't update data");
  }
};
