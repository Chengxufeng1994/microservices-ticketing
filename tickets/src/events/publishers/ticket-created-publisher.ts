import { Publisher, Subjects, TicketCreatedEvent } from '@msa-tickets/common';

export class TicketCreatedEventPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
