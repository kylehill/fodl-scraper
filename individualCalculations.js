const seasonCounts = require("./individualSeasonCounts");
const quickTable = require("./utils/quickTable");

(async () => {
  const counts = await seasonCounts();

  let totalAvg = 0;
  let totalTV = 0;

  const calculations = Object.entries(counts).map(([player, count]) => {
    const avg = (count["501"].points / count["501"].darts) * 3;
    const tv = count["501"].turnValues / count["501"].visits;

    totalAvg += avg;
    totalTV += tv;

    return {
      player,
      avg,
      tv,
    };
  });

  const averageAvg = totalAvg / calculations.length;
  const averageTV = totalTV / calculations.length;

  const display = calculations
    .map((player) => [
      player.player,
      player.avg.toFixed(2),
      player.tv.toFixed(5),
      ((player.avg / averageAvg) * 100).toFixed(1),
      ((player.tv / averageTV) * 100).toFixed(1),
    ])
    .sort((a, b) => b[4] - a[4]);

  console.log(quickTable(["Player", "3DA", "VV", "3DA+", "VV+"], display));
})();
