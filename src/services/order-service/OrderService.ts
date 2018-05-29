import * as _ from "lodash";
import ServiceEventEmitter from "../../classes/ServiceEventEmitter";

let events = new ServiceEventEmitter({
    host: "amqp://localhost",
    service: "OrderService"
});

let storage = {
    orders: [
        {
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
        }
    ]
};

function addOrder(Order) {
    storage.orders.push(Order);
}

function getOrderBy(filterFunc) {
    return _.filter(storage.orders, filterFunc);
}

function getOrderById(id) {
    return getOrderBy({ id })[0];
}

function updateOrderById(id, changes) {
    storage.orders.forEach(Order => {
        if (Order.id != id) {
            return;
        }

        _.defaultsDeep(Order, changes);
    });
}

const OrderService = {
    addOrder,
    getOrderBy,
    getOrderById,
    updateOrderById,
    storage
};

export { OrderService };
