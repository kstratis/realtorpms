// Docs on how to override default webpack config:
// https://github.com/rails/webpacker/blob/master/docs/webpack.md

const environment = require('./environment');
const config = environment.toWebpackConfig();
config.devtool = 'cheap-module-eval-source-map';
module.exports = config;
