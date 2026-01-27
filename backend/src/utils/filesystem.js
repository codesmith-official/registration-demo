const fs = require('fs');
const path = require('path');

const checkAndCreateDirectory = (dirPath) => {
  const resolvedPath = path.resolve(dirPath);

  if (!fs.existsSync(resolvedPath)) {
    fs.mkdirSync(resolvedPath, { recursive: true });
  }

  return resolvedPath;
};

module.exports = {
  checkAndCreateDirectory,
};
