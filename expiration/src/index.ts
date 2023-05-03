import { kafkaWrapper } from './kafka-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  
  if (!process.env.KAFKA_CLIENT_ID) {
    throw new Error("KAFKA_CLIENT_ID must be defined");
  }
  if (!process.env.KAFKA_BROKER_SERVER) {
    throw new Error("KAFKA_BROKER_SERVER must be defined   ");
  }
  if (!process.env.KAFKA_USER_NAME) {
    throw new Error("KAFKA_USER_NAME must be defined");
  }
  if (!process.env.KAFKA_PASSWORD) {
    throw new Error("KAFKA_USER_NAME must be defined");
  }

  if (!process.env.REDIS_HOST) {
    throw new Error("REDIS_HOST must be defined");
  }

  try {
    await kafkaWrapper.init(
      process.env.KAFKA_BROKER_SERVER,
      process.env.KAFKA_CLIENT_ID,
      process.env.KAFKA_USER_NAME,
      process.env.KAFKA_PASSWORD
    );
    const OrderCreatorListener =  new OrderCreatedListener(kafkaWrapper.client);
    OrderCreatorListener.listen();
  } catch (err) {
    console.error(err);
  }
};

start();
