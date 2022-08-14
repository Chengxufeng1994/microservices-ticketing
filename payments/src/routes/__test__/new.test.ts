import mongoose from 'mongoose';
import request from 'supertest';
import { OrderStatus } from '@msa-tickets/common';
import { app } from '../../app';
import { stripe } from '../../stripe';
import { Order } from '../../models/order';
import { Payment } from '../../models/payment';

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

  await request(app)
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

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      token: 'asdfgh',
      orderId: order.id,
    })
    .expect(400);
});

it('returns a 204 with valid inputs', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const cookie = global.signin(userId);
  const price = Math.floor(Math.random() * 1000000);
  const order = await Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    version: 0,
    price,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201);

  const stripeCharges = await stripe.charges.list({ limit: 50 });
  const stripeCharge = stripeCharges.data.find((charge) => {
    return charge.amount === price * 100;
  });

  expect(stripeCharge).toBeDefined();
  expect(stripeCharge!.currency).toEqual('usd');

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id,
  });
  expect(payment).not.toBeNull();
});
