import { Publisher, Subjects, TicketUpdatedEvent } from '@msa-tickets/common';

export class TicketUpdatedEventPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
