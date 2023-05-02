import express, { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { User } from '../models/user';
// @ts-ignore
import { BadRequestError } from '@nitinklr23code/common';
// @ts-ignore  
import { validateRequest } from '@nitinklr23code/common';
import jwt from 'jsonwebtoken';


const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async(req: Request, res: Response, next: NextFunction) => {

    try {
       
      const { email, password } = req.body;

      const existingUser = await User.findOne({ email });

      if (existingUser) {
          throw new BadRequestError('Email is already used.')
      }

      const user = User.build({ email, password });

      await user.save();

   
        // Generate JWT
        const userJwt = jwt.sign(
          {
            id: user.id,
            email: user.email
          },
          process.env.JWT_KEY!
        );

        // Store it on session object
        req.session = {
          jwt: userJwt
        };

        res.status(201).send(user);
    } catch(err: any) {
      next(err)
    }

  }
);

export { router as signupRouter };
