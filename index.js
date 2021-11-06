const cron = require("node-cron");
const express = require("express");

require("dotenv").config();

const API = require("./api");
const updateGeckotrend = require("./geckotrend");

const app = express();
const api = new API();

//Schedule tasks to be run on the server every 12 hours
cron.schedule("0 */12 * * *", async function () {
  run();
});

app.listen(3000);

async function run() {
  await updateGeckotrend(api);
}
