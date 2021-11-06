const cron = require("node-cron");
const express = require("express");

require("dotenv").config();

const API = require("./api");
const updateGeckotrend = require("./geckotrend");

const app = express();
const api = new API();

const port = process.env.PORT || 5000;
app.listen(port);
console.log(`App listening on port: ${port}`);

if (process.env.DEBUG) {
  run();
}

//Schedule tasks to be run on the server every 12 hours
cron.schedule("0 */12 * * *", async function () {
  run();
});


async function run() {
  await updateGeckotrend(api);
}
