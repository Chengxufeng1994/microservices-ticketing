import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@msa-tickets/common';
import { queueGroupName } from './queue-group-name';
import { expirationQueue, IPayload } from '../../queues/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const payLoad: IPayload = {
      orderId: data.id,
    };
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log('Waiting this many milliseconds to process the job:', delay);

    await expirationQueue.add(payLoad, { delay });

    msg.ack();
  }
}
