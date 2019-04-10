const generatePathMap = require('./build/generatePathMap');

module.exports = {
  target: 'serverless',
  exportPathMap: generatePathMap
}