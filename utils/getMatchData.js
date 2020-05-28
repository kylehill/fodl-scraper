const fs = require("fs").promises;
const fetch = require("node-fetch");
const HTMLParser = require("node-html-parser");
const parseMatch = require("./parseMatch");
const processMatch = require("./processMatch");

const getMatch = async (match_id) => {
  try {
    const text = await fs.readFile(`${process.cwd()}/archive/${match_id}.html`, "utf8");
    return HTMLParser.parse(text);
  } catch (_) {
    const url = `https://members.dartconnect.com/history/report/games/match/${match_id}`;
    const response = await fetch(url);
    const text = await response.text();
    try {
      await fs.mkdir(`${process.cwd()}/archive`);
    } catch (_) {}
    await fs.writeFile(`${process.cwd()}/archive/${match_id}.html`, text, "utf8");
    return HTMLParser.parse(text);
  }
};

const getMatchData = async (matchLinks) => {
  return Promise.all(
    matchLinks.map(async (matchLink) => {
      const matchHtml = await getMatch(matchLink.id);
      const parsed = parseMatch(matchHtml, matchLink.players);
      return processMatch(parsed, matchLink.id);
    })
  );
};

module.exports = getMatchData;
