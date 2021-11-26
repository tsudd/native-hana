"use strict";

let getFormattedDate = (plusMinutes = 0) => {
  var date = new Date();
  var str =
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1) +
    "-" +
    date.getDate() +
    " " +
    date.getHours() +
    ":" +
    ((parseInt(date.getMinutes()) + plusMinutes) % 60) +
    ":" +
    date.getSeconds();

  return str;
};

let doDisconnect = (conn) => {
  conn.disconnect((err) => {
    if (err) {
      console.error("Disconnect error: ", err);
    } else {
      console.log("Disconnected");
    }
  });
};

const hana = require("@sap/hana-client");

const oConnOptions = {
  serverNode:
    "2f47d8e0-822f-480f-80b3-91e9f4847ee5.hana.trial-eu10.hanacloud.ondemand.com:443",
  encrypt: true,
  sslValidateCertificate: "false",
  uid: "DBADMIN",
  pwd: "",
};

const dbConnection = hana.createConnection();

dbConnection.connect(oConnOptions, (err) => {
  if (err) {
    throw err;
  }

  // simple reading
  dbConnection.exec(
    'select * from "NATIVE_1"."native::Scooter"',
    (err, result) => {
      if (err) {
        throw err;
      }
      console.log(result);
    }
  );

  // insert one instance
  dbConnection.exec(
    'INSERT INTO "NATIVE_1"."native::Rent"(' +
      '"USERID",' +
      '"SCOOTERID",' +
      '"BEGINTIME",' +
      '"ENDTIME",' +
      '"INTERVALCOST",' +
      '"INTERVAL",' +
      '"CURRENCY",' +
      '"PAID") values (?,?,?,?,?,?,?,?)',
    [2, 3, getFormattedDate(), getFormattedDate(10), 0.88, "H", "USD", 1],
    (err, result) => {
      if (err) {
        throw err;
      }
      console.log(result);
    }
  );

  // do batch
  let oStatement = dbConnection.prepare(
    'INSERT INTO "NATIVE_1"."native::Rent"(' +
      '"USERID",' +
      '"SCOOTERID",' +
      '"BEGINTIME",' +
      '"ENDTIME",' +
      '"INTERVALCOST",' +
      '"INTERVAL",' +
      '"CURRENCY",' +
      '"PAID") values (?,?,?,?,?,?,?,?)'
  );
  oStatement.execBatch(
    [
      [2, 3, getFormattedDate(1), getFormattedDate(10), 0.88, "H", "USD", 1],
      [4, 1, getFormattedDate(2), getFormattedDate(3), 0.66, "H", "EUR", 1],
      [6, 6, getFormattedDate(3), getFormattedDate(22), 1.88, "D", "USD", 1],
    ],
    (err, result) => {
      if (err) {
        throw err
      }
      console.log(result);
      doDisconnect(dbConnection);
    }
  );
});
