import Queue from 'bull';
import { natsWrapper } from '../nats-wrapper';
import { ExpirationCompletePublisher } from '../events/publisher/expiration-complete-publisher';

interface IPayload {
  orderId: string;
}

const expirationQueue = new Queue<IPayload>('order:expiration', {
  redis: { host: process.env.REDIS_HOST },
});

expirationQueue.process(async (job, done) => {
  // console.log(
  //   'I want to publish an expiration:complete event for orderId',
  //   job.data.orderId
  // );

  await new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });

  done();
});

export { expirationQueue, IPayload };
