import express, { Request, Response } from 'express';
import 'express-async-errors';
import { body, validationResult } from 'express-validator';
import { DatabaseConnectionError } from '../errors/database-connection-error';
import { RequestValidationError } from '../errors/request-validation-error';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    // username must be an email
    body('email').isEmail().withMessage('Email must be valid.'),
    // password must be at least 5 chars long
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters.'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // This is javascript land
      // const error = new Error('Invalid email or password');
      // error.reasons = errors.array()ail or password');

      throw new RequestValidationError(errors.array());
    }

    console.log('Create user...');
    throw new DatabaseConnectionError();

    res.send({});
  }
);

export { router as signupRouter };
