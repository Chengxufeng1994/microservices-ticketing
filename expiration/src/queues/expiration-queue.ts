import Queue from 'bull';

interface IPayload {
  orderId: string;
}

const expirationQueue = new Queue<IPayload>('order:expiration', {
  redis: { host: process.env.REDIS_HOST },
});

expirationQueue.process(async (job, done) => {
  console.log(
    'I want to publish an expiration:complete event for orderId',
    job.data.orderId
  );

  done();
});

export { expirationQueue, IPayload };
