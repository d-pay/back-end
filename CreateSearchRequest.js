'use strict';



/**
 * This is a sample code to call SearchTransactionsApi,
 * create a search request
 */
function createSearchRequest() {



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