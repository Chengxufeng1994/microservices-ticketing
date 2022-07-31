import nats from 'node-nats-streaming';

console.clear();

const sc = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

sc.on('connect', () => {
  console.log('Publisher connected to NATS');

  const data = JSON.stringify({
    id: '123',
    title: 'concert',
    price: 20,
  });

  sc.publish('ticket:created', data, () => {
    console.log('Event published');
  });
});

sc.on('close', () => {
  console.log('NATS connection closed');
  process.exit();
});

process.on('SIGINT', () => sc.close());
process.on('SIGTERM', () => sc.close());
