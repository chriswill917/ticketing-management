import { Subjects, Listener, TicketCreatedEvent } from '@nitinklr23code/common';
import { Ticket } from '../../models/ticket';
import { ticketCreationGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = ticketCreationGroupName;

  async onMessage(data: TicketCreatedEvent['data'], msg: any) {
    const d = {
      ...data
    } as any;
    const { id, title, price } = d.data;
    const ticket = Ticket.build({
      id,
      title,
      price,
    });
    await ticket.save();
  }
}
