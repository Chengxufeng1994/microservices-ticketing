import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';

it('marks an order as cancelled', async () => {
  // create a ticket with Ticket Model
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();
  const user = global.signin();

  // make a request to create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .send({
      ticketId: ticket.id,
    })
    .set('Cookie', user)
    .expect(201);
  const orderId = order.id;

  // make a request to cancel an order
  await request(app)
    .delete(`/api/orders/${orderId}`)
    .set('Cookie', user)
    .expect(204);

  // expectation to make sure the thing is cancelled
  const updatedOrder = await Order.findById(orderId);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it.todo('emit a order cancelled event');
