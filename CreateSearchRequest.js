'use strict';

var cybersourceRestApi = require('cybersource-rest-client');
var path = require('path');
var filePath = path.resolve('Data/Configuration.js');
var configuration = require(filePath);

var Promise = require("bluebird")

/**
 * This is a sample code to call SearchTransactionsApi,
 * create a search request
 */
function createSearchRequest() {
    new Promise(function (resolve, reject) {
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
                    // console.log('\nData of create search request : ' + JSON.stringify(data));
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
                        let firstName, lastName, totalAmount, currency, paymentMethod;

                        firstName = transactionSummaries["orderInformation"]["billTo"]["firstName"];
                        lastName = transactionSummaries["orderInformation"]["billTo"]["lastName"];
                        totalAmount = transactionSummaries["orderInformation"]["amountDetails"]["totalAmount"];
                        currency = transactionSummaries["orderInformation"]["amountDetails"]["currency"];
                        paymentMethod = transactionSummaries["paymentInformation"]["paymentMethod"];


                        let obj = {
                            name: "" + firstName + " " + lastName,
                            totalAmount: "" + totalAmount,
                            currency: "" + currency,
                            paymentMethod: "" + paymentMethod,
                            daysLeft: "30 days left"
                        }

                        array.push(obj)
                    }
                }
                // {
                //                 balance: "R$30.000.00",
                //                 debits: [
                //                 {
                //                     name: "" + firstName + " " + lastName,
                //                     totalAmount: "" + totalAmount,
                //                     currency: "" + currency,
                //                     paymentMethod: "" + paymentMethod,
                //                     daysLeft: "30 days left"
                //                 },{

                //                 name: "" + firstName + " " + lastName,
                //                 totalAmount: "" + totalAmount,
                //                 currency: "" + currency,
                //                 paymentMethod: "" + paymentMethod,
                //                 daysLeft: "30 days left"
                //             }
                //                 ]
                //             }

                resolve(array);
                // console.log('\nResponse Code of create search request : ' + JSON.stringify(response['status']));
                // callback(error, data);
            });
        } catch (error) {
            console.log(error);
        }
    });


}
if (require.main === module) {
    createSearchRequest(function () {
        console.log('create search request end.');
    });
}
module.exports.createSearchRequest = new Promise(function (resolve, reject) {
    this.createSearchRequest.then(results => {
        resolve(results);
    })
});;