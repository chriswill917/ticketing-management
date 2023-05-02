import { Publisher, Subjects, TicketCreatedEvent } from "@nitinklr23code/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
