"use strict";
exports.__esModule = true;
var _ = require("lodash");
var ServiceEventEmitter_1 = require("../../classes/ServiceEventEmitter");
var events = new ServiceEventEmitter_1["default"]({
    host: "amqp://localhost",
    service: "OrderService"
});
var storage = {
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
    return getOrderBy({ id: id })[0];
}
function updateOrderById(id, changes) {
    storage.orders.forEach(function (Order) {
        if (Order.id != id) {
            return;
        }
        _.defaultsDeep(Order, changes);
    });
}
var OrderService = {
    addOrder: addOrder,
    getOrderBy: getOrderBy,
    getOrderById: getOrderById,
    updateOrderById: updateOrderById,
    storage: storage
};
exports.OrderService = OrderService;
//# sourceMappingURL=OrderService.js.map