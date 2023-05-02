import { Subjects, Publisher, OrderCancelledEvent } from "@nitinklr23code/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
