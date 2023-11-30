const { readData } = require("../helper/PromiseModule");

const createPaperId = async () => {
  const currentTimeInSecond = Math.floor(Date.now() / 1000);

  return `${currentTimeInSecond}`;
};

module.exports = createPaperId;
