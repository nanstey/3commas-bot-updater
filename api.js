const API = require("3commas-api-node");

class api {
  constructor() {
    this._api = new API({
      apiKey: process.env.API_KEY,
      apiSecret: process.env.API_SECRET,
      forcedMode: "real",
    });
  }

  async getBotsByName(botName) {
    const bots = await this._api.getBots();

    return bots.filter((bot) => bot.name.includes(botName));
  }

  async updateBots(bots) {
    return Promise.all(
      bots.map(async (bot) => {
        return await this._api.botUpdate({ ...bot, bot_id: bot.id });
      })
    );
  }
}

module.exports = api;
