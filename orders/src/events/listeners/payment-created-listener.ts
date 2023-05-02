import {
  Subjects,
  Listener,
  PaymentCreatedEvent,
  OrderStatus,
} from '@nitinklr23code/common';
import { paymentCreatedGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = paymentCreatedGroupName;

  async onMessage(data: any, msg: any) {

    console.log('data', data)
    const order = await Order.findById(data.data.orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({
      status: OrderStatus.Complete,
    });
    await order.save();

  }
}
