import mongoose from 'mongoose';
import request from 'supertest';
import { OrderStatus } from '@msa-tickets/common';
import { app } from '../../app';
import { Order } from '../../models/order';

it('return a 404 when purchasing an order that does not exist', async () => {
  await await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'asdfgh',
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it('return a 401 when purchasing an order that doesnt belong to the user', async () => {
  const order = await Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  await await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'asdfgh',
      orderId: order.id,
    })
    .expect(401);
});

it('return a 400 when purchasing a cancelled order', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const cookie = global.signin(userId);
  const order = await Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: userId, 
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  await await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      token: 'asdfgh',
      orderId: order.id,
    })
    .expect(400);
});
