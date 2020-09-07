const fs = require("fs");
const { from, of } = require("rxjs");
const { toArray, mergeMap, map, tap, mergeAll } = require("rxjs/operators");
const { CSVToJsonArr$ } = require("./csv-util");

const { removeObjectProps } = require("./object-util");

const data = fs.readFileSync("./empty.csv", { encoding: "utf8", flag: "r" });

const propsToBeRemoved = [
  "metaDescriptionCount",
  "metaOgTitleCount",
  "metaOgDescriptionCount",
  "metaOgImageCount",
  "metaTwitterDescriptionCount",
  "metaTwitterTitleCount",
  "metaTwitterImageCount",
];

const processToDB$ = (jsonArray) =>
  from(jsonArray).pipe(
    map((refData) => removeObjectProps(refData, propsToBeRemoved)),
    toArray()
  );

CSVToJsonArr$(data)
  .pipe(
    mergeMap((jsonArr) =>
      jsonArr.length === 0 ? of({ msg: `Empty csv` }) : processToDB$(jsonArr)
    )
  )
  .subscribe(console.log);
