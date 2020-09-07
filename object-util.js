const { from, of } = require("rxjs");
const { mergeMap, map, tap, mapTo, reduce } = require("rxjs/operators");

const flattenObject$ = (obj) => {
  let newObject = { ...obj };
  const keys = Object.keys(obj);
  for (const key of keys) {
    if (obj[key] && typeof obj[key] === "object") {
      let childObj = obj[key];
      delete newObject[key];
      newObject = { ...newObject, ...childObj };
    }
  }

  return of(newObject);
};

const removeObjectProps = (object, propsArr) => {
  for (const prop of propsArr) {
    delete object[prop];
  }
  return object;
};

const transferObjectProps$ = (receiverObj, ...senderObjs) =>
  from(senderObjs).pipe(
    reduce((acc, senderObj) => ({ ...acc, ...senderObj }), { ...receiverObj })
  );

const flattenObjects$ = (jsonArr) =>
  from(jsonArr).pipe(mergeMap(flattenObject$));

const transformObjectKeyNames = (object, transformer) => {
  const keys = Object.keys(object);
  let newObject = {};
  for (const key of keys) {
    const newKeyName = transformer(key);
    newObject[newKeyName] = object[key];
  }

  return newObject;
};

const charCountObjProps = (obj) => {
  const keys = Object.keys(obj);
  let objCount = {};
  for (const key of keys) {
    objCount[`${key}Count`] = obj[key].length || 0;
  }
  return objCount;
};

module.exports = {
  charCountObjProps,
  transformObjectKeyNames,
  removeObjectProps,
  flattenObject$,
  flattenObjects$,
  transferObjectProps$,
};
