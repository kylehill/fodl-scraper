// This is a constant; we can refresh the value by running the
// checkoutRates.js script and replacing the object below with the output
const trancheCheckoutRates = {
  dx2: 0.304498,
  dx1: 0.21843,
  sd: 0.172084,
  house: 0.155462,
  ssd: 0.094512,
  ssb: 0.036585,
  tsd: 0.014614,
  tsb: 0.006329,
  ttd: 0.002016,
  ttb: 0,
};

const turnValue = (startScore, turnScore) => {
  if (turnScore === 0) {
    return 0;
  }

  if (startScore === turnScore) {
    return 1;
  }

  if (startScore > 220) {
    return turnScore / 180;
  }

  if (startScore > 170 || isBogon(startScore)) {
    return Math.min(turnScore / (startScore - 40), 1);
  }

  const startCheckoutRate = trancheCheckoutRates[checkoutTranche(startScore)];
  const endCheckoutRate = trancheCheckoutRates[checkoutTranche(startScore - turnScore)];

  return Math.min(turnScore / 180 + endCheckoutRate - startCheckoutRate, 1);
};

const checkoutTranche = (score) => {
  if (isBogon(score)) {
    return false;
  }

  if (score <= 3) {
    return "house";
  }

  if (score <= 40) {
    if (score % 4 === 0) {
      return "dx2";
    }
    if (score % 2 === 0) {
      return "dx1";
    }
    return "sd";
  }
  if (score <= 60) {
    return "sd";
  }
  if (score <= 80) {
    return "ssd";
  }
  if (score <= 90) {
    return "ssb";
  }
  if (score <= 120) {
    return "tsd";
  }
  if (score <= 130) {
    return "tsb";
  }
  if (score <= 160) {
    return "ttd";
  }
  if (score <= 170) {
    return "ttb";
  }
  return false;
};

const isBogon = (score) => {
  return [159, 162, 163, 165, 166, 168, 169].indexOf(score) > -1;
};

const process501Leg = (leg, match_id) => {
  const points = [501, 501];
  const darts = [0, 0];
  const visits = [0, 0];
  const turnScores = [{}, {}];
  const busts = [0, 0];
  const bogons = [0, 0];
  const checkoutChances = [{}, {}];
  const tCheckoutChances = [{}, {}];
  const checkouts = [{}, {}];
  const tCheckouts = [{}, {}];
  const turnValues = [0, 0];

  leg.turns.forEach((turn, idx) => {
    const thrower = (leg.firstThrow + idx) % 2;
    const startScore = points[thrower];
    darts[thrower] += 3;
    visits[thrower] += 1;

    if (startScore <= 170 && isBogon(startScore) === false) {
      const tranche = checkoutTranche(startScore);
      checkoutChances[thrower][startScore] = (checkoutChances[thrower][startScore] || 0) + 1;
      tCheckoutChances[thrower][tranche] = (tCheckoutChances[thrower][tranche] || 0) + 1;
    }

    if (turn === "X") {
      turnScores[thrower][0] = (turnScores[thrower][0] || 0) + 1;
      busts[thrower] += 1;
      return;
    }
    // empty set
    if (turn === "&#8709;") {
      turnScores[thrower][0] = (turnScores[thrower][0] || 0) + 1;
      return;
    }

    const score = Number(turn);
    turnScores[thrower][score] = (turnScores[thrower][score] || 0) + 1;
    turnValues[thrower] += turnValue(startScore, score);

    points[thrower] -= score;
    if (isBogon(points[thrower])) {
      bogons[thrower] += 1;
    }

    if (points[thrower] === 0) {
      const tranche = checkoutTranche(startScore);
      checkouts[thrower][score] = (checkouts[thrower][score] || 0) + 1;
      tCheckouts[thrower][tranche] = (tCheckouts[thrower][tranche] || 0) + 1;
    }
  });

  darts[leg.winner] = leg.darts;
  return points.map((_, idx) => ({
    match_id,
    _game: "501",
    darts: darts[idx],
    points: 501 - points[idx],
    visits: visits[idx],
    turnValues: turnValues[idx],
    turnScores: turnScores[idx],
    busts: busts[idx],
    bogons: bogons[idx],
    checkoutChances: checkoutChances[idx],
    checkouts: checkouts[idx],
    tCheckoutChances: tCheckoutChances[idx],
    tCheckouts: tCheckouts[idx],
    firstThrow: leg.firstThrow === idx ? 1 : 0,
    winner: leg.winner === idx ? 1 : 0,
    legs: 1,
    lwat: leg.winner === idx && leg.firstThrow !== idx ? 1 : 0,
    llwt: leg.winner !== idx && leg.firstThrow === idx ? 1 : 0,
  }));
};

module.exports = process501Leg;
