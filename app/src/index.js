"use strict"

const hana = require("@sap/hana-client");

const oConnOptions = {
    serverNode: "2f47d8e0-822f-480f-80b3-91e9f4847ee5.hana.trial-eu10.hanacloud.ondemand.com:443",
    encrypt: true,
    sslValidateCertificate: "false",
    uid: "DBADMIN",
    pwd: ""
}

const dbConnection = hana.createConnection();

dbConnection.connect(oConnOptions, (err) => {
    if (err) {
        throw err;
    }
    dbConnection.exec('select * from "NATIVE_1"."native::Scooter"', 
    (err, result) => {
        if (err) {
            throw err;
        }
        console.log(result);
        dbConnection.disconnect();
    } )
})
