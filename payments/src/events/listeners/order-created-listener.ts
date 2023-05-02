import { Listener, OrderCreatedEvent, Subjects } from "@nitinklr23code/common";
import { orderCreationGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = orderCreationGroupName;

  async onMessage(data: any, msg: any) {

    const d = {
      ...data
    } as any;

    console.log('mmmm', d)
    const { id, ticket: t, status, userId, version} = d.data;

    const order = Order.build({
      id: id,
      price: t.price,
      status: status,
      userId: userId,
      version: version,
    });
    await order.save();

  }
}
