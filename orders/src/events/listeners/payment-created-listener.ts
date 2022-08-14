import {
  Subjects,
  Listener,
  PaymentCreatedEvent,
  OrderStatus,
} from '@msa-tickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName: string = queueGroupName;
  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const { id, orderId, stripeId } = data;
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Order not founds');
    }

    order.set({ status: OrderStatus.Complete });

    await order.save();

    msg.ack();
  }
}
