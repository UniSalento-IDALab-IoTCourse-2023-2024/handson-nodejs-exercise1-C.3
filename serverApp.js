// Require the express module
var express = require("express");
// Require the mongodb module
const { MongoClient } = require('mongodb');
//call the top-level express() function exported by the Express module
var app = express();

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'TemperatureDB';

//Binds and listens for connections on the specified host and port.
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
//set some express settings
app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json());

//asynchronous method to be executed to write info in the DB
async function writeToDb(temperature, timestamp, sensor) {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('TemperatureDB');
    const doc = {
        value: temperature,
        timestamp: timestamp,
        sensorId: sensor,
        roomId: 'room1'
    };

    // insert the info in the database
    const insertResult = await collection.insertMany([doc]);
    console.log('Inserted documents =>', insertResult);

    return 'done.';
}

//Routes HTTP POST requests to the specified path with the specified callback functions.
app.post("/temperature", (req, res, next) => {
    console.log(req.body.temperature);
    var temperature = req.body.temperature;
    var timestamp = req.body.timestamp;
    var sensor = req.body.sensor;

    writeToDb(temperature, timestamp, sensor)
        .then(console.log)
        .catch(console.error)
        .finally(() => client.close());

    res.sendStatus(200);
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})
