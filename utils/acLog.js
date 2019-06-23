module.exports = (content) => {
  const timeNow = new Date().toISOString();
  console.log(`[${timeNow}] ${content}`);
};
