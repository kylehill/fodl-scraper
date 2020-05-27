const fs = require("fs");
const fetch = require("node-fetch");
const HTMLParser = require("node-html-parser");
const playerLookup = require("./playerLookup");
const parseMatch = require("./parseMatch");
const processMatch = require("./processMatch");
const addStats = require("./addStats");

const getMatchLinks = async () => {
  try {
    const response = await fetch("https://app.dartconnect.com/corsapi/getBroadcastMatches", {
      method: "post",
      body: `{"match_type":"L","id":"FODL","limit":5000,"timezone":"America/New_York","refresh":"notrefresh"}`,
    });
    const data = await response.json();
    return data.payload.matches.map((m) => ({
      id: m.match_id,
      players: [playerLookup(m.opponent_0), playerLookup(m.opponent_1)],
    }));
  } catch (e) {
    console.error("Fetch error -- this happens sporadically? Just run it again.");
    return [];
  }
};

const getMatch = async (match_id) => {
  const url = `https://members.dartconnect.com/history/report/games/match/${match_id}`;
  const response = await fetch(url);
  return HTMLParser.parse(await response.text());
};

(async () => {
  const ml = await getMatchLinks();
  const matches = await Promise.all(
    ml.map(async (matchLink) => {
      const matchHtml = await getMatch(matchLink.id);
      const parsed = parseMatch(matchHtml, matchLink.players);
      return processMatch(parsed, matchLink.id);
    })
  );

  const compiledStats = matches.reduce((mem, match) => {
    return match.reduce((mem, stats) => {
      mem[stats.player] = mem[stats.player] || { 501: {}, cricket: {} };
      mem[stats.player]["501"] = addStats(stats["501"], mem[stats.player]["501"]);
      mem[stats.player]["cricket"] = addStats(stats["cricket"], mem[stats.player]["cricket"]);
      return mem;
    }, mem);
  }, {});

  await fs.promises.writeFile(
    `${process.cwd()}/data.json`,
    JSON.stringify(compiledStats, null, 2),
    "utf8"
  );
})();
