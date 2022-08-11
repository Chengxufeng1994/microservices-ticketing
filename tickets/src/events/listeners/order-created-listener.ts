import { Message } from 'node-nats-streaming';
import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from '@msa-tickets/common';
import { queueGroupName } from './queue-group-name';
import { TicketUpdatedEventPublisher } from '../publishers/ticket-updated-publisher';
import { Ticket } from '../../models/ticket';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const { id: orderId, ticket } = data;
    // Find the ticket that the order is reserving
    const existingTicket = await Ticket.findById(ticket.id);
    // If no ticket, throw error
    if (!existingTicket) {
      throw new Error('Ticket not found');
    }
    // Mark the ticket as being reserved by setting its orderId property
    existingTicket.set({ orderId });
    // Save the ticket
    await existingTicket.save();

    await new TicketUpdatedEventPublisher(this.client).publish({
      id: existingTicket.id,
      version: existingTicket.version,
      title: existingTicket.title,
      price: existingTicket.price,
      userId: existingTicket.userId,
      orderId: existingTicket.orderId,
    });
    // ack the message
    msg.ack();
  }
}
