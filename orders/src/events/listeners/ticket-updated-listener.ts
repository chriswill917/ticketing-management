import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from '@nitinklr23code/common';
import { Ticket } from '../../models/ticket';
import { ticketUpdationGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = ticketUpdationGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const d = {
      ...data
    } as any;
    const { id, title, price } = d.data;
    const ticket = await Ticket.findByEvent(d.data);
   
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    
    ticket.set({ title, price });
    await ticket.save();
  }
}
