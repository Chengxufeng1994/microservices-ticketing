import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@msa-tickets/common';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const { id, version, status, userId, ticket } = data;

    const order = Order.build({
      id,
      price: ticket.price,
      status,
      userId,
      version,
    });

    await order.save();

    msg.ack();
  }
}
