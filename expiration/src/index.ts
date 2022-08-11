import { natsWrapper } from './nats-wrapper';

const NATS_CLIENT_ID = process.env.NATS_CLIENT_ID;
const NATS_URL = process.env.NATS_URL;
const NATS_CLUSTER_ID = process.env.NATS_CLUSTER_ID;

const start = async () => {
  if (!NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }

  if (!NATS_URL) {
    throw new Error('NATS_URI must be defined');
  }

  if (!NATS_CLUSTER_ID) {
    throw new Error('NATS_URI must be defined');
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
  } catch (err) {
    console.error(err);
  }
};

start();
