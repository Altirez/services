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
exports.__esModule = true;
var amqplib = require("amqplib");
var AmqpClient = /** @class */ (function () {
    function AmqpClient(config) {
        this.queues = {};
        this.exchanges = {};
        var host = config.host;
        this.host = host;
    }
    AmqpClient.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, amqplib.connect(this.host)];
                    case 1:
                        _a.connection = _c.sent();
                        _b = this;
                        return [4 /*yield*/, this.connection.createChannel()];
                    case 2:
                        _b.channel = _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AmqpClient.prototype.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.close()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AmqpClient.prototype.createQueue = function (queueName, options) {
        return __awaiter(this, void 0, void 0, function () {
            var queue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queue = this.queues[queueName];
                        if (queue) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.channel.assertQueue(queueName, options)];
                    case 1:
                        queue = _a.sent();
                        this.queues[queueName] = queue;
                        return [2 /*return*/];
                }
            });
        });
    };
    AmqpClient.prototype.createExchange = function (exchangeName, type, options) {
        if (type === void 0) { type = "topic"; }
        return __awaiter(this, void 0, void 0, function () {
            var exchange;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.channel.assertExchange(exchangeName, type, options)];
                    case 1:
                        exchange = _a.sent();
                        this.exchanges[exchangeName] = exchange;
                        return [2 /*return*/];
                }
            });
        });
    };
    AmqpClient.prototype.bindQueue = function (queueName, exchangeName, key) {
        return __awaiter(this, void 0, void 0, function () {
            var queue, exchange;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queue = this.queues[queueName], exchange = this.exchanges[exchangeName];
                        if (!queue || !exchange) {
                            throw "nothing to bind";
                        }
                        return [4 /*yield*/, this.channel.bindQueue(queue.queue, exchange.exchange, key)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AmqpClient.prototype.consume = function (queueName, handler, options) {
        return __awaiter(this, void 0, void 0, function () {
            var queue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queue = this.queues[queueName];
                        if (!queue) {
                            throw "nothing to consume";
                        }
                        return [4 /*yield*/, this.channel.consume(queue.queue, handler, options)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AmqpClient.prototype.publish = function (exchangeName, key, msg) {
        return __awaiter(this, void 0, void 0, function () {
            var exchange;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        exchange = this.exchanges[exchangeName];
                        if (!exchange) {
                            throw "no exch to publish";
                        }
                        return [4 /*yield*/, this.channel.publish(exchange.exchange, key, msg)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AmqpClient.prototype.sendToQueue = function (queueName, msg) {
        return __awaiter(this, void 0, void 0, function () {
            var queue;
            return __generator(this, function (_a) {
                queue = this.queues[queueName];
                if (!queue) {
                    throw "no queue to publish";
                }
                this.channel.sendToQueue(queue.queue, msg);
                return [2 /*return*/];
            });
        });
    };
    AmqpClient.prototype.ack = function (msg) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.channel.ack(msg)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AmqpClient.prototype.cancel = function (consumerTag) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.channel.cancel(consumerTag)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return AmqpClient;
}());
exports["default"] = AmqpClient;
//# sourceMappingURL=AMQPClient.js.map