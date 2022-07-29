import mongoose from 'mongoose';

import { app } from './app';

const PORT = 3000;
const AUTH_MONGO_SERVICE_HOST = process.env.AUTH_MONGO_SERVICE_HOST;
const AUTH_MONGO_SERVICE_PORT = process.env.AUTH_MONGO_SERVICE_PORT;

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  try {
    await mongoose.connect(
      `mongodb://${AUTH_MONGO_SERVICE_HOST}:${AUTH_MONGO_SERVICE_PORT}/auth`
    );
  } catch (err) {
    console.error(err);
  }

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
};

start();
