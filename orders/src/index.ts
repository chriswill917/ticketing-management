import mongoose from 'mongoose';
import { kafkaWrapper } from "./kafka-wrapper";
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener';
import { PaymentCreatedListener } from './events/listeners/payment-created-listener';
import { app } from './app';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  if (!process.env.KAFKA_CLIENT_ID) {
    throw new Error("KAFKA_CLIENT_ID must be defined");
  }
  if (!process.env.KAFKA_BROKER_SERVER) {
    throw new Error("KAFKA_BROKER_SERVER must be defined");
  }
  if (!process.env.KAFKA_USER_NAME) {
    throw new Error("KAFKA_USER_NAME must be defined");
  }
  if (!process.env.KAFKA_PASSWORD) {
    throw new Error("KAFKA_USER_NAME must be defined");
  }

  await kafkaWrapper.init(
    process.env.KAFKA_BROKER_SERVER,
    process.env.KAFKA_CLIENT_ID,
    process.env.KAFKA_USER_NAME,
    process.env.KAFKA_PASSWORD
  );

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDb');
    const ticketCreatorListener =  new TicketCreatedListener(kafkaWrapper.client);
    ticketCreatorListener.listen();
    const tickerUpdateListner = await new TicketUpdatedListener(kafkaWrapper.client);
    tickerUpdateListner.listen();
    const expireOrderListner = await new ExpirationCompleteListener(kafkaWrapper.client);
    expireOrderListner.listen();
    const paymentCreatedListner = await new PaymentCreatedListener(kafkaWrapper.client);
    paymentCreatedListner.listen();
  } catch (err) {
    console.error(err);
  }

  if (process.env.NODE_ENV !== 'test') {
    app.listen(3000, () => {
      console.log('Listening on port 3000!!!!!!!!!!!!');
    });
  }
};

start();
