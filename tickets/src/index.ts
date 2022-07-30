import mongoose from 'mongoose';

import { app } from './app';

const PORT = 3000;
const TICKETS_MONGO_SERVICE_HOST = process.env.TICKETS_MONGO_SERVICE_HOST;
const TICKETS_MONGO_SERVICE_PORT = process.env.TICKETS_MONGO_SERVICE_PORT;
const MONGO_URI = process.env.MONGO_URI;

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  if (!MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  try {
    await mongoose.connect(`${MONGO_URI}`);
  } catch (err) {
    console.error(err);
  }

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
};

start();
