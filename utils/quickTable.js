const quickTable = (header, rows) => {
  const colLengths = rows.reduce((mem, row) => {
    return row.reduce((mem, cell, idx) => {
      mem[idx] = Math.max(mem[idx] || header[idx].length, cell.length);
      return mem;
    }, mem);
  }, []);

  const headerText =
    "| " +
    header
      .map((cell, idx) => {
        if (isNaN(cell)) {
          return cell.padEnd(colLengths[idx]);
        }
        return cell.padStart(colLengths[idx]);
      })
      .join(" | ") +
    " |";

  const divider =
    "|" +
    header
      .map((cell, idx) => {
        return "-".repeat(colLengths[idx] + 2);
      })
      .join("+") +
    "|";

  const bodyText = rows
    .map((row) => {
      return (
        "| " +
        row
          .map((cell, idx) => {
            if (isNaN(cell)) {
              return cell.padEnd(colLengths[idx]);
            }
            return cell.padStart(colLengths[idx]);
          })
          .join(" | ") +
        " |"
      );
    })
    .join("\n");

  return [headerText, divider, bodyText].join("\n");
};

module.exports = quickTable;
