import mongoose from "mongoose";
import { OrderCreatedEvent, OrderStatus } from "@nitinklr23code/common";
import { kafkaWrapper } from "../../../kafka-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import { Order } from "../../../models/order";

const setup = async () => {
  const listener = new OrderCreatedListener(kafkaWrapper.client);

  const data: any = {
    data: {
      id: new mongoose.Types.ObjectId().toHexString(),
      version: 0,
      status: OrderStatus.Created,
      userId: 'alskdfj',
      expiresAt: 'alskdjf',
      ticket: {
        id: 'alskdfj',
        price: 10,
      },
    }
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("replicates the order info", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.data.id);

  expect(order!.price).toEqual(data.data.ticket.price);
});