import {
  OrderCancelledEvent,
  Subjects,
  Listener,
  OrderStatus,
} from "@nitinklr23code/common";
import { orderCancelledGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = orderCancelledGroupName;

  async onMessage(data: any, msg: any) {

    const d = {
      ...data
    } as any;
    const { id, ticket: t, status, userId, version} = d.data;

    const order = await Order.findOne({
      _id: id,
      version: version - 1,
    });

    if (!order) {
      throw new Error("Order not found");
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

  }
}
