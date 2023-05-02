import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from "@nitinklr23code/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
