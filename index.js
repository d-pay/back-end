

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var cors = require('cors');
app.use(cors())

var request = require('request');
var fs = require('fs');

var port = process.env.PORT || 3001
app.listen(port, function () {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});

var https = require('https');

var options = {
    key: fs.readFileSync('./certs/server-key.pem'),
    cert: fs.readFileSync('./certs/server-crt.pem'),
    ca: fs.readFileSync('./certs/ca-crt.pem'),
};

https.createServer(options, app, function (req, res) {
}).listen(3000);

app.get('/api/process', function (req, res) {
    var process = require('./ProcessPayment.js');

    process.processPayment();

    res.send("hey");
});


app.get('/api/search', function (req, res) {
    var process = require('./CreateSearchRequest.js');

    process.createSearchRequest();

    res.send("hey");
});
