import AmqpClient from "./classes/AMQPClient";
import ServiceEventEmitter from "./classes/ServiceEventEmitter";

(async function main() {

    let events = new ServiceEventEmitter({
        host: "amqp://localhost",
        service: "service2"
    });

    var counter = 1;

    setInterval(async () => {


        await events.emit("new_order", {
            id: counter,
            number: "kalka"
        });

        counter++;


    }, 1500);

    let events2 = new ServiceEventEmitter({
        host: "amqp://localhost",
        service: "service1"
    });

    await events2.on("service2", "new_order", msg => {
        console.log(msg.content.toString());
        return 1;
    });

    await events2.on("service2", "new_order", msg => {
        console.log(msg.content.toString());
        return 2;
    });

})();
