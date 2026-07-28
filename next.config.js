const generatePathMap = require('./build/generatePathMap');

module.exports = {
  distDir: 'dist',
  exportTrailingSlash: true,
  exportPathMap: generatePathMap
}