import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

jest.mock('../nats-wrapper.ts');

process.env.STRIPE_KEY =
  'sk_test_51LWYCQLmv84vKW0iNcN8hjNXE2vnOuu83XxmaDq1DE3gPB8DOwFD1k24DHmOspNgbbQHfmLjcckKrpyDcqq9QXPn00Mlme3kk0';

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'shhhhh';
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

declare global {
  var signin: (id?: string) => string[];
}

global.signin = (id?: string) => {
  // Build a JWT payload, { id, email }
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };

  // Create the JWT
  // {"jwt":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZTRhNWUyZTkzMGVmMTY3OWE1MGM0MiIsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsImV4cCI6MTY1OTE1Mjc0MiwiaWF0IjoxNjU5MTUxODQyfQ.P0b9f9NE9iHJnSqmcyHmIfexyt9fOuH-lOIqeQ7QOAk"}
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session Object { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // Return a string
  return [`session=${base64}`];
};
