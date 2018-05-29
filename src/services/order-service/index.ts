import * as express from 'express';
import { OrderService } from "./OrderService";
import * as BodyParser from "body-parser";

let app = express();

app.use(BodyParser.json());


app.get("/order", (req, res) => {

    let { query } = req;
    if (!query.filter) {
        res.json({});
    }

    let filter = JSON.parse(query.filter);
    let result = OrderService.getOrderBy(filter);

    res.json(result);
});


app.get("/order/:id", (req, res) => {

    let { params } = req;
    let result = OrderService.getOrderById(params.id);

    res.json(result);
});


app.post("/order", (req, res) => {

    OrderService.addOrder(req.body);
    res.json({});

});

app.patch("/order/:id", (req, res) => {
    let { params = {} } = req;

    OrderService.updateOrderById(params.id, req.body);
    res.json({});
});


app.listen(3001);
