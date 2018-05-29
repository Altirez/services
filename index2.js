var bluebird = require('bluebird');
var amqp_n = require('amqplib/callback_api');
var amqp = require('amqplib/callback_api');
var db = require("./db/service2_db");

amqp.connect = bluebird.promisify(amqp.connect);


const serviceName = 'sevice1';

(async function () {

    try {

        let connection = bluebird.promisifyAll(await amqp.connect('amqp://localhost'));
        let channel = await connection.createChannel();

        channel.assertQueue = bluebird.promisify(channel.assertQueue);
        channel.assertExchange = bluebird.promisify(channel.assertExchange);


        let b = await channel.assertExchange(serviceName, 'topic', {
            durable: true
        });

        let queue = await channel.assertQueue('service1', {
            durable: true,
            autoDelete: false
        });

        channel.bindQueue(queue.queue, serviceName, 'orders.*');

        channel.consume(queue.queue, function (msg) {

            let model = JSON.parse(msg.content);


            db.orders.push(model);
            let a = 1;

            channel.ack(msg);

        });



    } catch (err) {
        let a = 1;
    }


})();