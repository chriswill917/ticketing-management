import mongoose from "mongoose";
import { app } from "./app";
import { kafkaWrapper } from "./kafka-wrapper";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";

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

  if (!process.env.STRIPE_KEY) {
    throw new Error("STRIPE_KEY must be defined");
  }

  try {
    
    await kafkaWrapper.init(
      process.env.KAFKA_BROKER_SERVER,
      process.env.KAFKA_CLIENT_ID,
      process.env.KAFKA_USER_NAME,
      process.env.KAFKA_PASSWORD
    );

    new OrderCreatedListener(kafkaWrapper.client).listen();
    new OrderCancelledListener(kafkaWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("Connected to MongoDb");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000!!!!!!!!");
  });
};

start();
