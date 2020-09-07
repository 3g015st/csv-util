const { NS_HMOS, NS_HOSPITALS, NS_SPECIALIZATION } = require("./mock-data");
const { jsonArrToCSV$ } = require("./csv-util");
const {
  flattenObject$,
  transformObjectKeyNames,
  charCountObjProps,
  removeObjectProps,
} = require("./object-util");

const { BASE_BLURB_OBJ, BASE_META_OBJ } = require("./ns-reference-reference");
const { toArray, mergeMap, map, tap } = require("rxjs/operators");
const { from, of, zip } = require("rxjs");

const fs = require("fs");

const connectMetaAndBlurbObj = (refObj) => {
  let newObj = { ...refObj };
  if (!refObj.meta) newObj.meta = BASE_META_OBJ;
  else
    newObj.meta = transformObjectKeyNames(
      newObj.meta,
      (propName) =>
        `meta${propName.charAt(0).toUpperCase() + propName.slice(1)}`
    );

  if (!refObj.blurb) newObj.blurb = BASE_BLURB_OBJ;
  else
    newObj.blurb = newObj.blurb = transformObjectKeyNames(
      newObj.blurb,
      (propName) =>
        `blurb${propName.charAt(0).toUpperCase() + propName.slice(1)}`
    );

  newObj = { ...newObj, ...charCountObjProps(newObj.meta) };

  return of(newObj);
};

const NS_HMO$ = from(NS_HMOS.values).pipe(
  mergeMap(connectMetaAndBlurbObj),
  mergeMap(flattenObject$),
  map((ref) => ({ index: NS_HMOS.category, ...ref })),
  toArray()
);

const NS_HOSPITALS$ = from(NS_HOSPITALS.values).pipe(
  mergeMap(connectMetaAndBlurbObj),
  mergeMap(flattenObject$),
  map((ref) => ({ index: NS_HOSPITALS.category, ...ref })),
  toArray()
);

const NS_SPECIALIZATION$ = from(NS_SPECIALIZATION.values).pipe(
  map((ref) => removeObjectProps(ref, ["specializations"])),
  mergeMap(connectMetaAndBlurbObj),
  mergeMap(flattenObject$),
  map((ref) => ({ index: NS_SPECIALIZATION.category, ...ref })),
  toArray()
);

const NS_REFERENCE_CSV$ = zip(NS_HMO$, NS_HOSPITALS$, NS_SPECIALIZATION$).pipe(
  map((resultArr) => resultArr.flat()),
  mergeMap(jsonArrToCSV$),
  tap((csv) => {
    fs.writeFile("test.csv", csv, "utf8", function (err) {
      if (err) {
        console.log(
          "Some error occured - file either not saved or corrupted file saved."
        );
      } else {
        console.log("It's saved!");
      }
    });
  })
);

NS_REFERENCE_CSV$.subscribe((x) => console.log(x));
