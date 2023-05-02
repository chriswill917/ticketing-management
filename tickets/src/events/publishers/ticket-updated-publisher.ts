import { Publisher, Subjects, TicketUpdatedEvent } from "@nitinklr23code/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
