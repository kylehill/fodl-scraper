const addStats = (source, destination) => {
  source.forEach((leg) => {
    Object.entries(leg).forEach(([key, value]) => {
      if (destination[key] === undefined) {
        destination[key] = value;
        return;
      }

      switch (typeof value) {
        case "string":
          return;

        case "number":
          destination[key] += value;
          return;

        case "object":
          if (Array.isArray(value)) {
            destination[key] = leg[key].map((_, idx) => destination[key][idx] + leg[key][idx]);
            return;
          }
          destination[key] = Object.entries(leg[key]).reduce((mem, [key, value]) => {
            mem[key] = (mem[key] || 0) + value;
            return mem;
          }, destination[key]);
      }
    });
  });

  return destination;
};

module.exports = addStats;
