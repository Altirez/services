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
var AMQPClient_1 = require("./AMQPClient");
var ServiceEventEmitter = /** @class */ (function () {
    function ServiceEventEmitter(config) {
        this.handlers = {};
        this.isConnected = false;
        this.queueMessages = {};
        var service = config.service, host = config.host;
        this.service = service;
        this.provider = new AMQPClient_1["default"]({ host: host });
    }
    ServiceEventEmitter.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.provider.connect()];
                    case 1:
                        _a.sent();
                        this.isConnected = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    ServiceEventEmitter.prototype.dispose = function () {
        this.provider.disconnect();
    };
    ServiceEventEmitter.prototype.on = function (service, event, handler) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var eventQueue, handleMessages_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.isConnected) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.init()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        eventQueue = service + "-" + event + "-" + this.service;
                        if (this.handlers[eventQueue]) {
                            return [2 /*return*/];
                        }
                        else {
                            this.handlers[eventQueue] = [];
                            this.queueMessages[eventQueue] = [];
                            handleMessages_1 = function () {
                                setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                    var msg, i;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                msg = this.queueMessages[eventQueue][0];
                                                if (!msg) return [3 /*break*/, 6];
                                                i = 0;
                                                _a.label = 1;
                                            case 1:
                                                if (!(i < this.handlers[eventQueue].length)) return [3 /*break*/, 4];
                                                return [4 /*yield*/, this.handlers[eventQueue][0](msg)];
                                            case 2:
                                                _a.sent();
                                                _a.label = 3;
                                            case 3:
                                                i++;
                                                return [3 /*break*/, 1];
                                            case 4: return [4 /*yield*/, this.provider.ack(msg)];
                                            case 5:
                                                _a.sent();
                                                this.queueMessages[eventQueue].shift();
                                                _a.label = 6;
                                            case 6:
                                                handleMessages_1();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); }, 50);
                            };
                            handleMessages_1();
                        }
                        this.handlers[eventQueue].push(handler);
                        return [4 /*yield*/, this.provider.createExchange(service, "topic", { durable: true })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.provider.createQueue(eventQueue, { durable: true })];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.provider.bindQueue(eventQueue, service, event)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.provider.consume(eventQueue, function (msg) {
                                _this.queueMessages[eventQueue].push(msg);
                            })];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ServiceEventEmitter.prototype.emit = function (event, data) {
        return __awaiter(this, void 0, void 0, function () {
            var serializedData, msgBuffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.isConnected) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.init()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        serializedData = JSON.stringify(data), msgBuffer = new Buffer(serializedData);
                        return [4 /*yield*/, this.provider.createExchange(this.service, "topic", {
                                durable: true
                            })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.provider.publish(this.service, event, msgBuffer)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return ServiceEventEmitter;
}());
exports["default"] = ServiceEventEmitter;
//# sourceMappingURL=ServiceEventEmitter.js.map