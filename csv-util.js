const converter = require("json-2-csv");
const { from } = require("rxjs");

const jsonArrToCSV$ = (jsonArr) => from(converter.json2csvAsync(jsonArr));
const CSVToJsonArr$ = (csv) => from(converter.csv2jsonAsync(csv));

module.exports = {
  jsonArrToCSV$,
  CSVToJsonArr$,
};
