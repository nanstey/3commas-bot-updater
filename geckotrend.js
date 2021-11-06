const fetch = require("cross-fetch");
const { response } = require("express");

async function updateGeckotrend(api) {
  const coins = await getSmallestCapHighVolumeBtcPairs();
  const geckobots = await api.getBotsByName("geckotrend");

  const modifiedBots = geckobots.map((bot) => {
    return {
      ...bot,
      pairs: JSON.stringify(coins),
    };
  });

  api.updateBots(modifiedBots).then((updatedBots) => {
    updatedBots.forEach((bot) => {
      console.log(new Date().toISOString());
      console.log(`Updated bot "${bot.name}" with the following pairs:`);
      console.log(bot.pairs);
    });
  });
}

module.exports = updateGeckotrend;

async function getSmallestCapHighVolumeBtcPairs() {
  // get top 25 coins by volume
  const response = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=BTC&order=volume_desc&per_page=25&price_change_percentage=1h,24h,7d"
  );
  const data = await response.json();

  // order by small cap
  const sorted = data.sort((a, b) =>
    a.market_cap_rank < b.market_cap_rank ? 1 : -1
  );

  // remove btc, eth, and stables
  const filtered1 = sorted.filter((coin) => {
    return !(
      coin.symbol.includes("btc") ||
      coin.symbol.includes("eth") ||
      coin.symbol.includes("usd")
    );
  });

  // filter out unavailable btc pairs
  const filtered2 = await asyncFilter(filtered1, async (coin) => {
    const response = await fetch(
      `https://api.binance.com/api/v3/exchangeInfo?symbol=${coin.symbol.toUpperCase()}BTC`
    );
    const data = await response.json();
    return !(data.msg === "Invalid symbol.");
  });

  return filtered2.map((coin) => `BTC_${coin.symbol.toUpperCase()}`);
}

async function asyncFilter(arr, predicate) {
  const results = await Promise.all(arr.map(predicate));

  return arr.filter((_v, index) => results[index]);
}
