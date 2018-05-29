import * as _ from 'lodash';
import ServiceEventEmitter from '../../classes/ServiceEventEmitter';

let events = new ServiceEventEmitter({
    host: "amqp://localhost",
    service: "TaskService"
});

let storage = {
    tasks: [
        {
            id: "task1",
            subject: "Проверить документы",
            executor: {
                name: "Жони",
                lastName: "Жованни"
            },
            dueDate: "29.06.2018",
            author: {
                name: "Жони",
                lastName: "Жованни"
            },
            text: "Супер срочно!",
            object: {
                type: "Коносамент",
                docDate: "29.03.2018",
                docNumber: "24145"
            },
            status: "В работе",
            comments: [
                { text: "Ну вообще!" },
                { text: "Все Жони тикай з городу, тоби звизда" },
            ]
        }
    ],
}

async function addTask(task) {

    storage.tasks.push(task);
    await events.emit("newTask", task);

}

function getTaskBy(filterFunc) {
    return _.filter(storage.tasks, filterFunc);
}

function getTaskById(id) {
    return getTaskBy({ id })[0];
}

function updateTaskById(id, changes) {
    storage.tasks.forEach(task => {
        if (task.id != id) {
            return;
        }

        _.defaultsDeep(task, changes);

        events.emit("taskChanged", { task, changes });

    });
}

function addComment(task_id, comment) {
    let task = getTaskById(task_id);

    task.comments.push(comment);
    updateTaskById(task_id, task);

    events.emit("newComment", { task, comment });

};


const TaskService = {
    addTask,
    addComment,
    getTaskBy,
    getTaskById,
    updateTaskById,
    storage, events
}

export { TaskService };