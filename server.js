const express = require("express");
const hbs = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");
const Datastore = require("nedb");

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 10000;
const context = require("./data/data.json");
const collection = new Datastore({
    filename: "collection.db",
    autoload: true,
});

app.set("views", path.join(__dirname, "views"));
app.engine(
    ".hbs",
    hbs({
        defaultLayout: "main.hbs",
        extname: ".hbs",
        partialsDir: "views/partials",
        helpers: require("./handlebarsHelpers"),
    })
);
app.set("view engine", ".hbs");

app.get("/", (req, res) => {
    res.render("index.hbs", {});
});

app.get("/addCar", (req, res) => {
    res.render("add.hbs", {});
});

app.post("/addCar", (req, res) => {
    const carAttributes = req.body.carAttributes || [];

    const doc = {
        insured: checkIfArrayIncludes(carAttributes, "insured"),
        gasolinePowered: checkIfArrayIncludes(carAttributes, "gasolinePowered"),
        damaged: checkIfArrayIncludes(carAttributes, "damaged"),
        fourByFour: checkIfArrayIncludes(carAttributes, "fourByFour"),
    };

    collection.insert(doc, (err, newDoc) => {
        const ctx = { addedCarId: newDoc._id };
        res.render("add.hbs", ctx);
    });
});

app.get("/carsList", (req, res) => {
    collection.find({}, function (err, docs) {
        const ctx = { cars: docs };
        res.render("list.hbs", ctx);
    });
});

app.post("/deleteCar", (req, res) => {
    const id = req.body.id || "";
    collection.remove({ _id: id }, {}, (err, numRemoved) => {
        console.log("Usunięto dokumentów: ", numRemoved);
        res.send(
            JSON.stringify({ response: `Usunięto dokumentów: ${numRemoved}` }),
            null,
            5
        );
    });
});

app.get("/editCars", (req, res) => {
    const id = req.query.id || "";

    collection.find({}, function (err, docs) {
        const cars = docs.map((el) => {
            let car = el;
            car["editable"] = id === el._id ? true : false;
            return car;
        });
        let ctx = { cars: cars };
        res.render("edit.hbs", ctx);
    });
});

app.post("/updateCar", (req, res) => {
    const id = req.body.id || "";
    const object = req.body.object || {};
    console.log(id, object);
    collection.update(
        { _id: id },
        { $set: object },
        {},
        function (err, numUpdated) {
            console.log("Zaktualizowano dokumentów: " + numUpdated);
            collection.loadDatabase();
            res.send(
                JSON.stringify({
                    response: `Zaktualizowano dokumentów: ${numUpdated}`,
                }),
                null,
                5
            );
        }
    );
});

app.use(express.static("static"));

app.listen(PORT, function () {
    console.log("Start serwera na porcie " + PORT);
});

function checkIfArrayIncludes(array, item) {
    return array.includes(item) ? true : false;
}
