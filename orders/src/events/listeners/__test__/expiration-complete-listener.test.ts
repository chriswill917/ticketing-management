import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderStatus, ExpirationCompleteEvent } from '@nitinklr23code/common';
import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { kafkaWrapper } from '../../../kafka-wrapper';
import { Ticket } from '../../../models/ticket';
import { Order } from '../../../models/order';

const setup = async () => {
  // Create a listener
  const listener = new ExpirationCompleteListener(kafkaWrapper.client);

  // Create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: "alskdfj",
    expiresAt: new Date(),
    ticket,
  });

  await order.save();

  // Create a fake data object
  const data: any = {
    data: {
        orderId: order.id,
    }
  };

  // Create a fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // return all of this stuff
  return { msg, data, order, ticket, listener };
};

it("updates the order status to cancelled", async () => {
    const { listener, order, data, msg } = await setup();
  
    await listener.onMessage(data, msg);
  
    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
  });
