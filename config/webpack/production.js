const environment = require('./environment');

// module.exports = environment.toWebpackConfig();
const config = environment.toWebpackConfig();
config.devtool = false;
module.exports = config;
