import * as amqplib from "amqplib";

export default class AmqpClient {
    private host;
    private connection;
    private channel;
    private queues = {};
    private exchanges = {};

    constructor(config) {
        const { host } = config;

        this.host = host;
    }

    async connect() {
        this.connection = await amqplib.connect(this.host);
        this.channel = await this.connection.createChannel();
    }


    async disconnect() {
        await this.connection.close();
    }

    async createQueue(queueName, options?) {
        let queue = this.queues[queueName];

        if (queue) {
            return;
        }

        queue = await this.channel.assertQueue(queueName, options);
        this.queues[queueName] = queue;
    }

    async createExchange(exchangeName, type = "topic", options?) {
        let exchange = await this.channel.assertExchange(
            exchangeName,
            type,
            options
        );

        this.exchanges[exchangeName] = exchange;
    }

    async bindQueue(queueName, exchangeName, key) {
        let queue = this.queues[queueName],
            exchange = this.exchanges[exchangeName];

        if (!queue || !exchange) {
            throw "nothing to bind";
        }

        await this.channel.bindQueue(queue.queue, exchange.exchange, key);
    }

    async consume(queueName, handler, options?) {
        let queue = this.queues[queueName];

        if (!queue) {
            throw "nothing to consume";
        }

        await this.channel.consume(queue.queue, handler, options);
    }

    async publish(exchangeName, key, msg) {
        let exchange = this.exchanges[exchangeName];

        if (!exchange) {
            throw "no exch to publish";
        }
        await this.channel.publish(exchange.exchange, key, msg);
    }

    async sendToQueue(queueName, msg) {
        let queue = this.queues[queueName];

        if (!queue) {
            throw "no queue to publish";
        }

        this.channel.sendToQueue(queue.queue, msg);
    }
    async ack(msg) {
        await this.channel.ack(msg);
    }
    async cancel(consumerTag) {
        await this.channel.cancel(consumerTag);
    }
}
