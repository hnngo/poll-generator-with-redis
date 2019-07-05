// Activities Log
exports.acLog = (content) => {
  const timeNow = new Date().toISOString();
  console.log(`[${timeNow}] ${content}`);
};

// UUIDv4 generator
exports.uuidV4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Sleep 
exports.sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}
