"use strict";
exports.__esModule = true;
var express = require("express");
var OrderService_1 = require("./OrderService");
var BodyParser = require("body-parser");
var app = express();
app.use(BodyParser.json());
app.get("/order", function (req, res) {
    var query = req.query;
    if (!query.filter) {
        res.json({});
    }
    var filter = JSON.parse(query.filter);
    var result = OrderService_1.OrderService.getOrderBy(filter);
    res.json(result);
});
app.get("/order/:id", function (req, res) {
    var params = req.params;
    var result = OrderService_1.OrderService.getOrderById(params.id);
    res.json(result);
});
app.post("/order", function (req, res) {
    OrderService_1.OrderService.addOrder(req.body);
    res.json({});
});
app.patch("/order/:id", function (req, res) {
    var _a = req.params, params = _a === void 0 ? {} : _a;
    OrderService_1.OrderService.updateOrderById(params.id, req.body);
    res.json({});
});
app.listen(3001);
//# sourceMappingURL=index.js.map