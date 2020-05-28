const getBroadcastMatches = require("./utils/getBroadcastMatches");
const getMatchData = require("./utils/getMatchData");
const addStats = require("./utils/addStats");

const seasonCounts = async (write) => {
  const postBody = `{"match_type":"L","id":"FODL","limit":5000,"timezone":"America/New_York","refresh":"notrefresh"}`;
  const matchLinks = await getBroadcastMatches(postBody);
  const matches = await getMatchData(matchLinks);

  const compiledStats = matches.reduce((mem, match) => {
    return match.reduce((mem, stats) => {
      mem[stats.player] = mem[stats.player] || { 501: {}, cricket: {} };
      mem[stats.player]["501"] = addStats(stats["501"], mem[stats.player]["501"]);
      mem[stats.player]["cricket"] = addStats(stats["cricket"], mem[stats.player]["cricket"]);
      return mem;
    }, mem);
  }, {});

  if (write) {
    await fs.writeFile(
      `${process.cwd()}/data.json`,
      JSON.stringify(compiledStats, null, 2),
      "utf8"
    );
  }

  return compiledStats;
};

module.exports = seasonCounts;
