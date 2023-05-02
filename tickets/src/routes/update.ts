import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  BadRequestError
} from '@nitinklr23code/common';
import { Ticket } from '../models/ticket';
import { kafkaWrapper } from "./../kafka-wrapper";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";

const router = express.Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be provided and must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ticket = await Ticket.findById(req.params.id);

      if (!ticket) {
        throw new NotFoundError();
      }

      if(ticket.orderId) {
        throw new BadRequestError('Ticker can not be edited');
      }

      if (ticket.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError('ForBidden Access');
      }

      ticket.set({
        title: req.body.title,
        price: req.body.price,
      });
      await ticket.save();

      await new TicketUpdatedPublisher(kafkaWrapper.client).publish({
        id: ticket.id,
        version: ticket.version,
        title: req.body.title,
        price: req.body.price,
        userId: ticket.userId,
      });

      res.send(ticket);
    } catch(err) {
      next(err)
    }
  }
);

export { router as updateTicketRouter };
