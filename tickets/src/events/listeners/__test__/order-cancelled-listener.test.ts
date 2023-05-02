import mongoose from 'mongoose';
import { OrderCancelledEvent, OrderStatus } from '@nitinklr23code/common';
import { OrderCancelledListener } from '../order-cancelled-listener'
import { kafkaWrapper } from '../../../kafka-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
    // create an instance of the listener
    const listener = new OrderCancelledListener(kafkaWrapper.client);
    const orderId = new mongoose.Types.ObjectId().toHexString();
    // Create and save a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 99,
        userId: 'asdf',
    });
    ticket.set({orderId: ticket.orderId})
    await ticket.save();

    // create a fake data event
    const data: any = {
      data: {
        id: ticket.id,
        version: 0,
        ticket: {
            id: ticket.id
        }
      }
    };
  
    // create a fake message object
    // @ts-ignore
    const msg: Message = {
      ack: jest.fn(),
    };
  
    return { listener, data, msg };
  };
  
  it('updates the ticket and publish the event', async () => {
    const { listener, data, msg } = await setup();
  
    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);
  
    // write assertions to make sure a ticket was created!
    const ticket = await Ticket.findById(data.data.id);
    expect(ticket!.orderId).not.toBeDefined();
  });
  