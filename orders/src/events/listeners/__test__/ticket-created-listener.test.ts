import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { TicketCreatedEvent } from '@nitinklr23code/common';
import { TicketCreatedListener } from '../ticket-created-listener';
import { kafkaWrapper } from '../../../kafka-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketCreatedListener(kafkaWrapper.client);

  // create a fake data event
  const data: any = {
    data: {
      version: 0,
      id: new mongoose.Types.ObjectId().toHexString(),
      title: 'concert',
      price: 10,
      userId: new mongoose.Types.ObjectId().toHexString(),
    }
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('creates and saves a ticket', async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure a ticket was created!
  const ticket = await Ticket.findById(data.data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.data.title);
  expect(ticket!.price).toEqual(data.data.price);
});
