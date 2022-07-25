import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

// Routes
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
// Middlewares
import { errorHandler } from './middlewares/error-handler';
// Errors
import { NotFoundError } from './errors/not-found-error';

const PORT = 3000;

const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.get('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
