import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { TicketUpdatedEvent } from '@nitinklr23code/common';
import { TicketUpdatedListener } from '../ticket-updated-listener';
import { kafkaWrapper } from '../../../kafka-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // Create a listener
  const listener = new TicketUpdatedListener(kafkaWrapper.client);

  // Create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  // Create a fake data object
  const data: any = {
    data: {
      id: ticket.id,
      version: ticket.version + 1,
      title: 'new concert',
      price: 999,
      userId: 'ablskdjf',
    }
  };

  // Create a fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // return all of this stuff
  return { msg, data, ticket, listener };
};

it('finds, updates, and saves a ticket', async () => {
  const { msg, data, ticket, listener } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.data.title);
  expect(updatedTicket!.price).toEqual(data.data.price);
  expect(updatedTicket!.version).toEqual(data.data.version);
});
