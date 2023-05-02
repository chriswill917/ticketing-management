
import express, { Request, Response, NextFunction} from 'express';
import { json } from 'body-parser';
import moongoose from 'mongoose';
import cookieSession from 'cookie-session';


import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signupRouter } from './routes/signup';
import { signoutRouter } from './routes/signout';
import { errorHandler } from "@nitinklr23code/common";
import { NotFoundError } from "@nitinklr23code/common";

const app = express();
app.set('trust proxy', 1);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

app.all("*", async (req: Request, res: Response, next: NextFunction) => {
  try {
    throw new NotFoundError()
  } catch(err: any) {
    next(err)
  }
})

app.use(errorHandler);

export { app }