import AmqpClient from "./AMQPClient";
import { format } from "url";

export default class ServiceEventEmitter {

    private handlers = {};
    private service;
    private provider: AmqpClient;
    private isConnected = false;
    private queueMessages = {};

    constructor(config) {
        let { service, host } = config;

        this.service = service;
        this.provider = new AmqpClient({ host });
    }

    private async init() {

        await this.provider.connect();
        this.isConnected = true;
    }

    public dispose() {
        this.provider.disconnect();
    }

    async on(service, event, handler) {
        if (!this.isConnected) {
            await this.init();
        }

        let eventQueue = `${service}-${event}-${this.service}`;

        if (this.handlers[eventQueue]) {
            return;
        }
        else {

            this.handlers[eventQueue] = [];
            this.queueMessages[eventQueue] = [];

            let handleMessages = () => {
                setTimeout(async () => {
                    let msg = this.queueMessages[eventQueue][0];

                    if (msg) {
                        for (let i = 0; i < this.handlers[eventQueue].length; i++) {
                            await this.handlers[eventQueue][0](msg);
                        }
                        await this.provider.ack(msg);
                        this.queueMessages[eventQueue].shift();
                    }

                    handleMessages();
                }, 50);
            };

            handleMessages();

        }

        this.handlers[eventQueue].push(handler);

        await this.provider.createExchange(service, "topic", { durable: true });
        await this.provider.createQueue(eventQueue, { durable: true });
        await this.provider.bindQueue(eventQueue, service, event);
        await this.provider.consume(eventQueue, msg => {
            this.queueMessages[eventQueue].push(msg);
        });
    }

    async emit(event, data) {
        if (!this.isConnected) {
            await this.init();
        }

        let serializedData = JSON.stringify(data),
            msgBuffer = new Buffer(serializedData);

        await this.provider.createExchange(this.service, "topic", {
            durable: true
        });

        await this.provider.publish(this.service, event, msgBuffer);
    }
}
