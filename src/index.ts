import * as Request from "request-promise";
import * as _ from "lodash";
import ServiceEventEmitter from "./classes/ServiceEventEmitter";
import { request } from "https";
import { create } from "domain";

let serviceEvents = new ServiceEventEmitter({
    host: "amqp://localhost",
    service: "TaskConsumer"
});




async function createTask(data) {
    await Request({
        url: "http://localhost:3000/task",
        method: "POST",
        body: data,
        json: true
    });
}

async function getOrder(id) {
    if (!id) {
        return;
    }

    let result = await Request({
        url: `http://localhost:3001/order/${id}`,
        method: "GET",
        json: true
    });

    return result;
}


async function patchOrder(id, changes) {

    if (!id) {
        return;
    }

    await Request({
        url: `http://localhost:3001/order/${id}`,
        method: "PATCH",
        body: changes,
        json: true
    });
}


(async () => {

    let newTask = {
        id: "task2",
        subject: "Заказать букинг",
        executor: {
            name: "Жони",
            lastName: "Жованни"
        },
        dueDate: "30.06.2018",
        author: {
            name: "Жони",
            lastName: "Жованни"
        },
        text: "Эй лошара, закажи букинги под этот заказ",
        object: {
            type: "order",
            id: "order1",
            consignee: {
                name: "Рога - копыта",
                id: "edi1"
            },
            tasks: [],
            units: [{ id: "CMA-CGA-124" }, { id: "CMA-CGA-122" }],
            docNumber: "NZA-11-23",
            value: 23.5,
            currency: "RUR"
        },
        status: "Новая",
        comments: []
    };


    await serviceEvents.on("TaskService", "newTask", async ({ content }) => {

        let createdTask = JSON.parse(content.toString());

        console.log(createdTask);

        if (createdTask.object.type != "order") {
            return;
        }

        let order = await getOrder(createdTask.object.id);
        order.tasks.push(createdTask.id);

        let changes = {
            tasks: order.tasks
        }

        await patchOrder(order.id, changes);


    });

    await createTask(newTask);

    newTask.id = "task3";
    await createTask(newTask);
    newTask.id = "task4";
    await createTask(newTask);
    newTask.id = "task5";
    await createTask(newTask);
    newTask.id = "task6";
    await createTask(newTask);

})();


