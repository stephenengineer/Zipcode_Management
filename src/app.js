const axios = require("axios");
const express = require("express");
const morgan = require("morgan");

const app = express();
app.use(morgan("dev"));
app.use(express.json());

const zipcodes = require("../data/zipcodes.json").zipcodes;
const API_BASE_URL =
  process.env.API_BASE_URL || "http://localhost:3000/zipcodes";

const zipcodeValidation = (req, res, next) => {
  const { zipcode } = req.params;
  if (zipcode && zipcode.length === 5) {
    const zipcodeArray = [...zipcode];
    if (
      zipcodeArray.every(
        (letter) => letter.charCodeAt(0) > 47 && letter.charCodeAt(0) < 58
      )
    ) {
      res.locals.zipcode = zipcode;
      return next();
    }
  }
  next("Error: Zipcode must be 5 digit string of numbers");
};

const zipcodeExists = (req, res, next) => {
  const { zipcode } = req.params;
  if (zipcodes[zipcode]) {
    res.locals.zipcode = zipcode;
    return next();
  }
  next("Error: Zipcode not found");
};

function insert(req, res) {
  const zipcode = res.locals.zipcode;
  axios
    .post(API_BASE_URL, {
      ...zipcodes,
      [zipcode]: "1",
    })
    .catch((error) => {
      console.log(error.message);
    });
  console.log(`Zip code ${zipcode} inserted.`);
  res.status(201).json(`Zip code ${zipcode} inserted.`);
}

function remove(req, res) {
  const zipcode = res.locals.zipcode;
  const alteredZipcodes = { ...zipcodes };
  delete alteredZipcodes[zipcode];
  axios
    .post(API_BASE_URL, {
      ...alteredZipcodes,
    })
    .catch((error) => {
      console.log(error.message);
    });
  console.log(zipcodes);
  console.log(`Zip code ${zipcode} deleted.`);
  res.json(`Zip code ${zipcode} deleted.`);
}

function has(req, res) {
  const { zipcode } = req.params;
  const zipcodeExists = !!zipcodes[zipcode];
  console.log(zipcodeExists);
  res.json(`${zipcodeExists}`);
}

function display(req, res) {
  const zipcodeArray = Object.keys(zipcodes);
  zipcodeArray.sort();
  const entriesToReturn = [];
  let beginningOfRange = "";
  zipcodeArray.forEach((zipcode, index) => {
    let zipcodeNumber = Number(zipcode);
    let nextZipcodeNumber = 0;
    if (zipcodeArray[index + 1]) {
      nextZipcodeNumber = Number(zipcodeArray[index + 1]);
    }
    if (nextZipcodeNumber && nextZipcodeNumber === zipcodeNumber + 1) {
      if (!beginningOfRange) beginningOfRange = zipcode;
    } else {
      if (beginningOfRange) {
        entriesToReturn.push(`${beginningOfRange}-${zipcode}`);
        beginningOfRange = "";
      } else {
        entriesToReturn.push(zipcode);
      }
    }
  });
  const message = entriesToReturn.join(", ");
  console.log(message);
  res.json(`${message}`);
}

app.use("/insert/:zipcode", zipcodeValidation, insert);
app.use("/delete/:zipcode", zipcodeExists, remove);
app.use("/has/:zipcode", has);
app.use("/display", display);

// Not-found handler
app.use((req, res, next) => {
  console.log(`The route ${req.path} does not exist!`);
  res.send(`The route ${req.path} does not exist!`);
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.send(err);
});

module.exports = app;
