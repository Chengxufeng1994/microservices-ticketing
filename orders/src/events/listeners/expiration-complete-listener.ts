import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  ExpirationCompleteEvent,
  OrderStatus,
} from '@msa-tickets/common';

import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';
import { OrderCancelledPublisher } from '../publisher/order-cancelled-publisher';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName: string = queueGroupName;
  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const { orderId } = data;
    const existingOrder = await Order.findById(orderId).populate('ticket');

    if (!existingOrder) {
      throw new Error('Order not found');
    }

    existingOrder.set({
      status: OrderStatus.Cancelled,
    });

    await existingOrder.save();
    await new OrderCancelledPublisher(this.client).publish({
      id: orderId,
      version: existingOrder.version,
      ticket: {
        id: existingOrder.ticket.id,
      },
    });

    msg.ack();
  }
}
