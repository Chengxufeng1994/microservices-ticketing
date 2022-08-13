import { Message } from 'node-nats-streaming';
import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from '@msa-tickets/common';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName: string = queueGroupName;
  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const { id } = data;
    const order = await Order.findOne({
      _id: id,
      version: data.version - 1,
    });

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({ status: OrderStatus.Cancelled });

    await order.save();

    msg.ack();
  }
}
