import { Subjects, Listener, OrderCreatedEvent } from '@nitinklr23code/common';
import { Ticket } from '../../models/ticket';
import { orderCreationGroupName } from './queue-group-name';
import { TicketUpdatedPublisher } from "../../events/publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = orderCreationGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: any) {
    const d = {
      ...data
    } as any;
    const { id, ticket: t} = d.data;
    const ticket = await Ticket.findById(t.id);
   
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    
    ticket.set({ orderId: id });
    await ticket.save();
    new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId
    })

  }
}
