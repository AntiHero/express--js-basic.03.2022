import mongoose from 'mongoose';

export interface BookSchema {
  author: string;
  title: string;
  year: number;
}

const bookSchema = new mongoose.Schema<BookSchema>({
  author: String,
  title: { type: String, required: true },
  year: Number,
});

export const Book = mongoose.model('Book', bookSchema);
