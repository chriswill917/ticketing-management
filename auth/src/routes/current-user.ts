import express, { Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

import { currentUser } from '@nitinklr23code/common'


const router = express.Router();

router.get('/api/users/currentuser', currentUser,  
  async(req: Request, res: Response, next: NextFunction) => {
    try {
      res.send({ currentUser: req.currentUser || null });
    } catch(err: any) {
      next(err)
    }
});

export { router as currentUserRouter };
