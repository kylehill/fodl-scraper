const getBroadcastMatches = require("./utils/getBroadcastMatches");
const getMatchData = require("./utils/getMatchData");
const addStats = require("./utils/addStats");

(async () => {
  const postBody = `{"match_type":"L","id":"FODL","limit":5000,"timezone":"America/New_York","refresh":"notrefresh"}`;
  const matchLinks = await getBroadcastMatches(postBody);
  const matches = await getMatchData(matchLinks);

  const compiledStats = matches.reduce((mem, match) => {
    return match.reduce((mem, stats) => {
      mem = addStats(stats["501"], mem);
      return mem;
    }, mem);
  }, {});

  const rates = Object.entries(compiledStats.tCheckoutChances)
    .map(([out, count]) => {
      const checkedOut = compiledStats.tCheckouts[out] || 0;
      return [out, checkedOut, count, (checkedOut / count).toFixed(6)];
    })
    .sort((a, b) => b[3] - a[3])
    .reduce((mem, tranche) => {
      mem[tranche[0]] = Number(tranche[3]);
      return mem;
    }, {});

  console.log(rates);
})();
