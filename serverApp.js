var express = require("express");
var app = express();
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json());

app.post("/temperature", (req, res, next) => {
    console.log(req.body.temperature);
    res.sendStatus(200);
});
