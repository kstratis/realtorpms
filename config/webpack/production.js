const environment = require('./environment');

// module.exports = environment.toWebpackConfig();
const config = environment.toWebpackConfig();

module.exports = config;
