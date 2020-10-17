const express = require("express");
const router = express.Router();
const db = require("../helpers/db");

router.get("/", function (req, res) {
  data(req, res);
});

/* tirePressure1 ,
    tirePressure2 ,
    emission,
    engineHeat,
    suspension1,
    suspension2,
    batteryLevel,
    fuelLevel,
    speed,
    EventEnqueuedUtcTime as timeStamp */

module.exports = router;

async function data(req, res) {
  let container = "BikeData";
  let parameters = "";
  if (req.query.parameter === undefined || req.query.parameter === "") {
    return res.status(400).send({ message: "Invalid Parameters" });
  }
  if (req.query.parameter === "TirePressure") {
    parameters = "b.tirePressure1, b.tirePressure2";
  } else if (req.query.parameter === "Suspension") {
    parameters = "b.suspension1, b.suspension2";
  } else if (req.query.parameter === "Emission") {
    parameters = "b.emission";
  } else if (req.query.parameter === "EngineHeat") {
    parameters = "b.engineHeat";
  } else if (req.query.parameter === "BatteryLevel") {
    parameters = "b.batteryLevel";
  } else if (req.query.parameter === "fuelLevel") {
    parameters = "b.FuelLevel";
  } else if (req.query.parameter === "speed") {
    parameters = "b.Speed";
  } else {
    return res
      .status(200)
      .send({ message: "Parameter is mssing in the query" });
  }

  let query = `SELECT b.timeStamps, ${parameters} FROM BikeData b  order by b.timeStamps`;
  db.queryItems(container, query, res);
}
