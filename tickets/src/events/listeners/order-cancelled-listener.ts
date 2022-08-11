import { Message } from 'node-nats-streaming';
import { Listener, OrderCancelledEvent, Subjects } from '@msa-tickets/common';
import { queueGroupName } from './queue-group-name';
import { TicketUpdatedEventPublisher } from '../publishers/ticket-updated-publisher';
import { Ticket } from '../../models/ticket';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName: string = queueGroupName;
  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const { ticket } = data;
    const existingTicket = await Ticket.findById(ticket.id);

    if (!existingTicket) {
      throw new Error('Ticket not found');
    }

    existingTicket.set({ orderId: undefined });

    await existingTicket.save();
    await new TicketUpdatedEventPublisher(this.client).publish({
      id: existingTicket.id,
      version: existingTicket.version,
      title: existingTicket.title,
      price: existingTicket.price,
      userId: existingTicket.userId,
      orderId: existingTicket.orderId,
    });

    msg.ack();
  }
}
