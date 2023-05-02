const { Kafka, Partitioners  } = require('kafkajs')

class KafkaWrapper {
  private _client?: any;

  get client() {
    if (!this._client) {
      console.log('m.......')
      throw new Error("Cannot access Kafka client before connecting");
    }

    return this._client;
  }

  init(brokers: string, clientId: string, username: string, password: string) {

    this._client = new Kafka({
      clientId: clientId,
      brokers: [brokers],
      ssl: true,
      logLevel: 2,
      sasl: {
        mechanism: 'plain',
        username: username,
        password: password
      }
    })
  }
}

export const kafkaWrapper = new KafkaWrapper();
