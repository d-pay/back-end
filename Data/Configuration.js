'use strict';

/*
* Merchant configuration properties are taken from Configuration module
*/

// common parameters
const AuthenticationType = 'http_signature';
const RunEnvironment = 'cybersource.environment.SANDBOX';
const MerchantId = 'ibm_hackat_56749';

// http_signature parameters
const MerchantKeyId = '8086b153-e933-4810-bb5d-5fc0007bda7c';
const MerchantSecretKey = 'VnYP1c3XEBI1jMLdrQLGV5ffD9gjfvAsFZN5EZ2r2aM=';

// jwt parameters
const KeysDirectory = 'Resource';
const KeyFileName = 'ibm_hackat_56749';
const KeyAlias = 'ibm_hackat_56749';
const KeyPass = 'ibm_hackat_56749';

// logging parameters
const EnableLog = true;
const LogFileName = 'cybs';
const LogDirectory = '../log';
const LogfileMaxSize = '5242880'; //10 MB In Bytes

// Constructor for Configuration
function Configuration() {

    var configObj = {
        'authenticationType': AuthenticationType,
        'runEnvironment': RunEnvironment,

        'merchantID': MerchantId,
        'merchantKeyId': MerchantKeyId,
        'merchantsecretKey': MerchantSecretKey,

        'keyAlias': KeyAlias,
        'keyPass': KeyPass,
        'keyFileName': KeyFileName,
        'keysDirectory': KeysDirectory,

        'enableLog': EnableLog,
        'logFilename': LogFileName,
        'logDirectory': LogDirectory,
        'logFileMaxSize': LogfileMaxSize
    };
    return configObj;

}

module.exports = Configuration;