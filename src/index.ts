import app from './app';
import { connectToMongoDb } from './utils/connectToMongoDb';

const PORT = process.env.PORT || 8000;

app.listen(PORT, async () => {
  await connectToMongoDb(process.env.MONGODB_URL as string);
  console.log('Server is running at http://localhost:%s', PORT);
});
