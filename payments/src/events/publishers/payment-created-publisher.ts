import { Subjects, Publisher, PaymentCreatedEvent } from "@nitinklr23code/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
