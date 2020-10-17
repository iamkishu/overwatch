const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");
const EventHubReader = require("./scripts/event-hub-reader.js");
var cookieParser = require("cookie-parser");

let indexRouter = require("./routes/index");

// const iotHubConnectionString = process.env.IotHubConnectionString;
const iotHubConnectionString =
  "DeviceConnetionString";
if (!iotHubConnectionString) {
  console.error(
    `Environment variable IotHubConnectionString must be specified.`
  );
  return;
}
console.log(`Using IoT Hub connection string [${iotHubConnectionString}]`);

// const eventHubConsumerGroup = process.env.EventHubConsumerGroup;
const eventHubConsumerGroup = "myconsumergroup";
console.log(eventHubConsumerGroup);
if (!eventHubConsumerGroup) {
  console.error(
    `Environment variable EventHubConsumerGroup must be specified.`
  );
  return;
}
console.log(`Using event hub consumer group [${eventHubConsumerGroup}]`);

// Redirect requests to the public subdirectory to the root
const app = express();

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      try {
        console.log(`Broadcasting data ${data}`);
        client.send(data);
      } catch (e) {
        console.error(e);
      }
    }
  });
};

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Origin, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token, Access-Control-Allow-Headers, X-Requested-With, Access-Control-Allow-Origin"
  );
  if ("OPTIONS" === req.method) {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);

server.listen(process.env.PORT || "3000", () => {
  console.log("Listening on %d.", server.address().port);
});

const eventHubReader = new EventHubReader(
  iotHubConnectionString,
  eventHubConsumerGroup
);

(async () => {
  await eventHubReader.startReadMessage((message, date, deviceId) => {
    try {
      const payload = {
        IotData: message,
        MessageDate: date || Date.now().toISOString(),
        DeviceId: deviceId,
      };

      wss.broadcast(JSON.stringify(payload));
    } catch (err) {
      console.error("Error broadcasting: [%s] from [%s].", err, message);
    }
  });
})().catch();
