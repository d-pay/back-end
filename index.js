

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var cors = require('cors');
app.use(cors())

var cybersourceRestApi = require('cybersource-rest-client');
var path = require('path');
var filePath = path.resolve('Data/Configuration.js');
var configuration = require(filePath);

var Promise = require("bluebird")

var fs = require('fs');

var port = process.env.PORT || 3001;
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

    let name = req.query.name;
    let valor = req.query.valor;

    process.processPayment(name, valor);

    res.send({
        response: true
    });
});

app.get('/api/search', function (req, res) {
    try {
        var configObject = new configuration();
        var instance = new cybersourceRestApi.SearchTransactionsApi(configObject);

        var createSearchRequest = new cybersourceRestApi.TssV2TransactionsPostResponse();
        createSearchRequest.save = 'false';
        createSearchRequest.name = 'Visa Inc';
        // createSearchRequest.timezone = 'America/Chicago';
        createSearchRequest.query = 'clientReferenceInformation.code:ibm_hackat_56749';
        // createSearchRequest.offset = 0;
        createSearchRequest.limit = 100;
        createSearchRequest.sort = 'id:asc, submitTimeUtc:asc';

        console.log('\n*************** Create Search Request  ********************* ');

        instance.createSearch(createSearchRequest, function (error, data, response) {
            if (error) {
                console.log('\nError in create search request : ' + JSON.stringify(error));
            }
            else if (data) {
                console.log('\nData of create search request : ' + JSON.stringify(data));
            }

            response['text'] = JSON.parse(response['text']);


            let array = [];
            for (let transactionSummaries of response['text']["_embedded"]["transactionSummaries"]) {

                let status = "NOK";
                for (let applications of transactionSummaries["applicationInformation"]["applications"]) {
                    if (applications["rFlag"] == "SOK") {
                        status = "SOK";
                    }
                }

                if (status == "SOK") {
                    let firstName, lastName, totalAmount, currency, paymentMethod, submitTimeUtc;

                    submitTimeUtc = transactionSummaries["submitTimeUtc"];

                    firstName = transactionSummaries["orderInformation"]["billTo"]["firstName"];
                    lastName = transactionSummaries["orderInformation"]["billTo"]["lastName"];
                    totalAmount = transactionSummaries["orderInformation"]["amountDetails"]["totalAmount"];
                    currency = transactionSummaries["orderInformation"]["amountDetails"]["currency"];
                    paymentMethod = transactionSummaries["paymentInformation"]["paymentMethod"]["type"];

                    let id = 0;
                    let newItem = false;
                    if (firstName.includes("Tuin Sapataria".toUpperCase())) {
                        id = 1;
                        newItem = true;
                    } else if (firstName.includes("Restaurante Paladar".toUpperCase())) {
                        id = 2;
                        newItem = true;
                    } else if (firstName.includes("Doutor Faz tudo".toUpperCase())) {
                        id = 3;
                        newItem = true;
                    } else if (firstName.includes("Minha oficina".toUpperCase())) {
                        id = 4;
                        newItem = true;
                    } else if (firstName.includes("Plumber encanamentos".toUpperCase())) {
                        id = 5;
                        newItem = true;
                    } else if (firstName.includes("Tuin Sapataria")) {
                        id = 6;
                        newItem = true;
                    }


                    if (newItem == true) {
                        let obj = {
                            name: "" + firstName + " ",
                            totalAmount: "" + totalAmount,
                            currency: "" + currency,
                            paymentMethod: "" + paymentMethod,
                            daysLeft: "30 dias restantes",
                            submitTimeUtc: "" + submitTimeUtc,
                            id: id
                        }

                        array.push(obj)
                    }


                }
            }

            let balance = 0;

            for (let obj of array) {
                if (obj["totalAmount"] != undefined) {
                    balance = balance + parseFloat("" + obj["totalAmount"]);
                }
            }

            let result = {
                balance: "" + balance,
                debits: array
            }

            res.send(result);
            // console.log('\nResponse Code of create search request : ' + JSON.stringify(response['status']));
            // callback(error, data);
        });
    } catch (error) {
        console.log(error);
    }
});


