import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';

const PORT = 3000;
// const TICKETS_MONGO_SERVICE_HOST = process.env.TICKETS_MONGO_SERVICE_HOST;
// const TICKETS_MONGO_SERVICE_PORT = process.env.TICKETS_MONGO_SERVICE_PORT;
// const NATS_SERVICE_HOST = process.env.NATS_SERVICE_HOST;
// const NATS_SERVICE_PORT = process.env.NATS_SERVICE_PORT;
const JWT_KEY = process.env.JWT_KEY;
const NATS_CLIENT_ID = process.env.NATS_CLIENT_ID;
const NATS_URL = process.env.NATS_URL;
const NATS_CLUSTER_ID = process.env.NATS_CLUSTER_ID;
const MONGO_URI = process.env.MONGO_URI;

const start = async () => {
  if (!JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  if (!NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }

  if (!NATS_URL) {
    throw new Error('NATS_URI must be defined');
  }

  if (!NATS_CLUSTER_ID) {
    throw new Error('NATS_URI must be defined');
  }

  if (!MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  try {
    await natsWrapper.connect(NATS_CLUSTER_ID, NATS_CLIENT_ID, NATS_URL);

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    await mongoose.connect(`${MONGO_URI}`);
    console.log('Connected to MongoDb');
  } catch (err) {
    console.error(err);
  }

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
};

start();
