import { Publisher, OrderCreatedEvent, Subjects } from "@nitinklr23code/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
