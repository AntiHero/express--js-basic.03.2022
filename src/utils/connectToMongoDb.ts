import mongoose from 'mongoose';

export const connectToMongoDb = async (url: string) => {
  return mongoose
    .connect(url)
    .then((_) => {
      console.log('connected to MongoDB %s', url);
    })
    .catch((error) => {
      console.log('error connecting to MongoDB:', error.message);
    });
};
