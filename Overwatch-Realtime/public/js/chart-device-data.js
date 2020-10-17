/* eslint-disable max-classes-per-file */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
$(document).ready(() => {
  // if deployed to a site supporting SSL, use wss://
  const protocol = document.location.protocol.startsWith("https")
    ? "wss://"
    : "ws://";
  const webSocket = new WebSocket(protocol + location.host);

  // A class for holding the last N points of telemetry for a device
  class DeviceData {
    constructor(deviceId) {
      this.deviceId = deviceId;
      this.maxLen = 50;
      this.timeData = new Array(this.maxLen);
      this.tirePressure1Data = new Array(this.maxLen);
      this.tirePressure2Data = new Array(this.maxLen);
      this.emissionData = new Array(this.maxLen);
      this.engineHeatData = new Array(this.maxLen);
      this.suspension1Data = new Array(this.maxLen);
      this.suspension2Data = new Array(this.maxLen);
      this.batteryLevelData = new Array(this.maxLen);
      this.fuelLevelData = new Array(this.maxLen);
      this.speedData = new Array(this.maxLen);
    }

    addData(
      time,
      tirePressure1,
      tirePressure2,
      emission,
      engineHeat,
      suspension1,
      suspension2,
      batteryLevel,
      fuelLevel,
      speed
    ) {
      this.timeData.push(time);
      this.tirePressure1Data.push(tirePressure1 || null);
      this.tirePressure2Data.push(tirePressure2 || null);
      this.emissionData.push(emission || null);
      this.engineHeatData.push(engineHeat || null);
      this.suspension1Data.push(suspension1 || null);
      this.suspension2Data.push(suspension2 || null);
      this.batteryLevelData.push(batteryLevel || null);
      this.fuelLevelData.push(fuelLevel || null);
      this.speedData.push(speed || null);

      if (this.timeData.length > this.maxLen) {
        this.timeData.shift();
        this.tirePressure1Data.shift();
        this.tirePressure2Data.shift();
        this.emissionData.shift();
        this.engineHeatData.shift();
        this.suspension1Data.shift();
        this.suspension2Data.shift();
        this.batteryLevelData.shift();
        this.fuelLevelData.shift();
        this.speedData.shift();
      }
    }
  }

  // All the devices in the list (those that have been sending telemetry)
  class TrackedDevices {
    constructor() {
      this.devices = [];
    }

    // Find a device based on its Id
    findDevice(deviceId) {
      for (let i = 0; i < this.devices.length; ++i) {
        if (this.devices[i].deviceId === deviceId) {
          return this.devices[i];
        }
      }

      return undefined;
    }

    getDevicesCount() {
      return this.devices.length;
    }
  }

  const trackedDevices = new TrackedDevices();

  // Define the chart axes
  const chartData = {
    datasets: [
      {
        fill: false,
        label: "tirePressure1",
        yAxisID: "tirePressure1",
        borderColor: "rgba(255, 204, 10, 1)",
        pointBoarderColor: "rgba(255, 204, 10, 1)",
        backgroundColor: "rgba(255, 204, 0, 10.4)",
        pointHoverBackgroundColor: "rgba(255, 204, 10, 1)",
        pointHoverBorderColor: "rgba(255, 204, 10, 1)",
        spanGaps: true,
      },
      {
        fill: false,
        label: "tirePressure2",
        yAxisID: "tirePressure2",
        borderColor: "rgba(24, 120, 240, 1)",
        pointBoarderColor: "rgba(24, 120, 240, 1)",
        backgroundColor: "rgba(24, 120, 240, 1)",
        pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
        pointHoverBorderColor: "rgba(24, 120, 240, 1)",
        spanGaps: true,
      },
      {
        fill: false,
        label: "emission",
        yAxisID: "emission",
        borderColor: "rgba(0, 255, 0, 1)",
        pointBoarderColor: "rgba(0, 255, 0, 1)",
        backgroundColor: "rgba(0, 255, 0, 1)",
        pointHoverBackgroundColor: "rgba(0, 255, 0, 1)",
        pointHoverBorderColor: "rgba(0, 255, 0, 1)",
        spanGaps: true,
      },
      {
        fill: false,
        label: "engineHeat",
        yAxisID: "engineHeat",
        borderColor: "rgba(128, 0, 32, 1)",
        pointBoarderColor: "rgba(128, 0, 32, 1)",
        backgroundColor: "rgba(128, 0, 32, 1)",
        pointHoverBackgroundColor: "rgba(128, 0, 32, 1)",
        pointHoverBorderColor: "rgba(128, 0, 32, 1)",
        spanGaps: true,
      },
      {
        fill: false,
        label: "suspension1",
        yAxisID: "suspension1",
        borderColor: "rgba(64, 224, 208, 1)",
        pointBoarderColor: "rgba(64, 224, 208, 1)",
        backgroundColor: "rgba(64, 224, 208, 1)",
        pointHoverBackgroundColor: "rgba(64, 224, 208, 1)",
        pointHoverBorderColor: "rgba(64, 224, 208, 1)",
        spanGaps: true,
      },
      {
        fill: false,
        label: "suspension2",
        yAxisID: "suspension2",
        borderColor: "rgba(0, 0, 0, 1)",
        pointBoarderColor: "rgba(0, 0, 0, 1)",
        backgroundColor: "rgba(0, 0, 0, 1)",
        pointHoverBackgroundColor: "rgba(0, 0, 0, 1)",
        pointHoverBorderColor: "rgba(0, 0, 0, 1)",
        spanGaps: true,
      },
      {
        fill: false,
        label: "batteryLevel",
        yAxisID: "batteryLevel",
        borderColor: "rgba(128, 0, 128, 1)",
        pointBoarderColor: "rgba(128, 0, 128, 1)",
        backgroundColor: "rgba(128, 0, 128, 1)",
        pointHoverBackgroundColor: "rgba(128, 0, 128, 1)",
        pointHoverBorderColor: "rgba(128, 0, 128, 1)",
        spanGaps: true,
      },
      {
        fill: false,
        label: "fuelLevel",
        yAxisID: "fuelLevel",
        borderColor: "rgba(0, 255, 255, 1)",
        pointBoarderColor: "rgba(0, 255, 255, 1)",
        backgroundColor: "rgba(0, 255, 255, 1)",
        pointHoverBackgroundColor: "rgba(0, 255, 255, 1)",
        pointHoverBorderColor: "rgba(0, 255, 255, 1)",
        spanGaps: true,
      },
      {
        fill: false,
        label: "speed",
        yAxisID: "speed",
        borderColor: "rgba(249, 120, 10, 1)",
        pointBoarderColor: "rgba(249, 120, 10, 1)",
        backgroundColor: "rgba(249, 120, 10, 1)",
        pointHoverBackgroundColor: "rgba(249, 120, 10, 1)",
        pointHoverBorderColor: "rgba(249, 120, 10, 1)",
        spanGaps: true,
      },
    ],
  };

  const chartOptions = {
    scales: {
      yAxes: [
        {
          id: "tirePressure1",
          type: "linear",
          scaleLabel: {
            labelString: "tirePressure1 (bar)",
            display: true,
          },
          position: "left",
        },
        {
          id: "tirePressure2",
          type: "linear",
          scaleLabel: {
            labelString: "tirePressure2 (bar)",
            display: true,
          },
          position: "right",
        },
        {
          id: "suspension1",
          type: "linear",
          scaleLabel: {
            labelString: "suspension1 (pascal)",
            display: true,
          },
          position: "left",
        },
        {
          id: "suspension2",
          type: "linear",
          scaleLabel: {
            labelString: "suspension2 (pascal)",
            display: true,
          },
          position: "right",
        },
        {
          id: "emission",
          type: "linear",
          scaleLabel: {
            labelString: "emission (m^3)",
            display: true,
          },
          position: "left",
        },
        {
          id: "engineHeat",
          type: "linear",
          scaleLabel: {
            labelString: "engineHeat (C)",
            display: true,
          },
          position: "right",
        },
        {
          id: "fuelLevel",
          type: "linear",
          scaleLabel: {
            labelString: "fuelLevel (%)",
            display: true,
          },
          position: "left",
        },
        {
          id: "speed",
          type: "linear",
          scaleLabel: {
            labelString: "speed (kmph)",
            display: true,
          },
          position: "right",
        },
        {
          id: "batteryLevel",
          type: "linear",
          scaleLabel: {
            labelString: "batteryLevel (%)",
            display: true,
          },
          position: "left",
        },
      ],
    },
  };

  // Get the context of the canvas element we want to select
  const ctx = document.getElementById("iotChart").getContext("2d");
  const myLineChart = new Chart(ctx, {
    type: "line",
    data: chartData,
    options: chartOptions,
  });

  // Manage a list of devices in the UI, and update which device data the chart is showing
  // based on selection
  let needsAutoSelect = true;
  const deviceCount = document.getElementById("deviceCount");
  const listOfDevices = document.getElementById("listOfDevices");
  function OnSelectionChange() {
    const device = trackedDevices.findDevice(
      listOfDevices[listOfDevices.selectedIndex].text
    );
    chartData.labels = device.timeData;
    chartData.datasets[0].data = device.tirePressure1Data;
    chartData.datasets[1].data = device.tirePressure2Data;
    chartData.datasets[2].data = device.emissionData;
    chartData.datasets[3].data = device.engineHeatData;
    chartData.datasets[4].data = device.suspension1Data;
    chartData.datasets[5].data = device.suspension2Data;
    chartData.datasets[6].data = device.batteryLevelData;
    chartData.datasets[7].data = device.fuelLevelData;
    chartData.datasets[8].data = device.speedData;

    myLineChart.update();
  }
  listOfDevices.addEventListener("change", OnSelectionChange, false);

  // When a web socket message arrives:
  // 1. Unpack it
  // 2. Validate it has date/time and tirePressure1
  // 3. Find or create a cached device to hold the telemetry data
  // 4. Append the telemetry data
  // 5. Update the chart UI
  webSocket.onmessage = function onMessage(message) {
    try {
      const messageData = JSON.parse(message.data);
      console.log(messageData);

      // time and either tirePressure1 or tirePressure2 are required
      if (!messageData.MessageDate) {
        return;
      }

      // find or add device to list of tracked devices
      const existingDeviceData = trackedDevices.findDevice(
        messageData.DeviceId
      );

      if (existingDeviceData) {
        existingDeviceData.addData(
          messageData.MessageDate,
          messageData.IotData.tirePressure1,
          messageData.IotData.tirePressure2,
          messageData.IotData.emission,
          messageData.IotData.engineHeat,
          messageData.IotData.suspension1,
          messageData.IotData.suspension2,
          messageData.IotData.batteryLevel,
          messageData.IotData.fuelLevel,
          messageData.IotData.speed
        );
      } else {
        const newDeviceData = new DeviceData(messageData.DeviceId);
        trackedDevices.devices.push(newDeviceData);
        const numDevices = trackedDevices.getDevicesCount();
        deviceCount.innerText =
          numDevices === 1 ? `${numDevices} device` : `${numDevices} devices`;
        newDeviceData.addData(
          messageData.MessageDate,
          messageData.IotData.tirePressure1,
          messageData.IotData.tirePressure2,
          messageData.IotData.emission,
          messageData.IotData.engineHeat,
          messageData.IotData.suspension1,
          messageData.IotData.suspension2,
          messageData.IotData.batteryLevel,
          messageData.IotData.fuelLevel,
          messageData.IotData.speed
        );

        // add device to the UI list
        const node = document.createElement("option");
        const nodeText = document.createTextNode(messageData.DeviceId);
        node.appendChild(nodeText);
        listOfDevices.appendChild(node);

        // if this is the first device being discovered, auto-select it
        if (needsAutoSelect) {
          needsAutoSelect = false;
          listOfDevices.selectedIndex = 0;
          OnSelectionChange();
        }
      }

      myLineChart.update();
    } catch (err) {
      console.error(err);
    }
  };
});
