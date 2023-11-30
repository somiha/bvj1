const { readData } = require("../helper/PromiseModule");

const createPaperId = async () => {
  // Get the current date
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');

  const yyyymmdd = `${year}${month}${day}`;

  const select_query = `SELECT COUNT(id) as count FROM paper_info WHERE paper_info.id LIKE '${yyyymmdd}%'`
  const data = await readData(select_query);
  const count = data[0].count;

  return `${yyyymmdd}${String(count + 1).padStart(2, '0')}`
};

module.exports = createPaperId;