"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
exports.__esModule = true;
var Request = require("request-promise");
var ServiceEventEmitter_1 = require("./classes/ServiceEventEmitter");
var serviceEvents = new ServiceEventEmitter_1["default"]({
    host: "amqp://localhost",
    service: "TaskConsumer"
});
function createTask(data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Request({
                        url: "http://localhost:3000/task",
                        method: "POST",
                        body: data,
                        json: true
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function getOrder(id) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!id) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, Request({
                            url: "http://localhost:3001/order/" + id,
                            method: "GET",
                            json: true
                        })];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result];
            }
        });
    });
}
function patchOrder(id, changes) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!id) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, Request({
                            url: "http://localhost:3001/order/" + id,
                            method: "PATCH",
                            body: changes,
                            json: true
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
(function () { return __awaiter(_this, void 0, void 0, function () {
    var _this = this;
    var newTask;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                newTask = {
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
                return [4 /*yield*/, serviceEvents.on("TaskService", "newTask", function (_a) {
                        var content = _a.content;
                        return __awaiter(_this, void 0, void 0, function () {
                            var createdTask, order, changes;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        createdTask = JSON.parse(content.toString());
                                        console.log(createdTask);
                                        if (createdTask.object.type != "order") {
                                            return [2 /*return*/];
                                        }
                                        return [4 /*yield*/, getOrder(createdTask.object.id)];
                                    case 1:
                                        order = _b.sent();
                                        order.tasks.push(createdTask.id);
                                        changes = {
                                            tasks: order.tasks
                                        };
                                        return [4 /*yield*/, patchOrder(order.id, changes)];
                                    case 2:
                                        _b.sent();
                                        return [2 /*return*/];
                                }
                            });
                        });
                    })];
            case 1:
                _a.sent();
                return [4 /*yield*/, createTask(newTask)];
            case 2:
                _a.sent();
                newTask.id = "task3";
                return [4 /*yield*/, createTask(newTask)];
            case 3:
                _a.sent();
                newTask.id = "task4";
                return [4 /*yield*/, createTask(newTask)];
            case 4:
                _a.sent();
                newTask.id = "task5";
                return [4 /*yield*/, createTask(newTask)];
            case 5:
                _a.sent();
                newTask.id = "task6";
                return [4 /*yield*/, createTask(newTask)];
            case 6:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
//# sourceMappingURL=index.js.map