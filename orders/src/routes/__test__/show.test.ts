import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('fetches the order', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  const cookie = global.signin();
  // make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make request to fetch the order
  const orderId = await order.id;
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${orderId}`)
    .set('Cookie', cookie)
    .expect(200);

  expect(fetchedOrder.id).toEqual(orderId);
});

it('returns an error if one user tries to fetch another users order', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  const userOne = global.signin();
  // make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticket.id })
    .expect(201);

  const userTwo = global.signin();
  // make request to fetch the order
  const orderId = await order.id;
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${orderId}`)
    .set('Cookie', userTwo)
    .expect(401);
});
