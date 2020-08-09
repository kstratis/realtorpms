const { environment } = require('@rails/webpacker');
const webpack = require('webpack');

environment.plugins.append("Provide", new webpack.ProvidePlugin({
  $: 'jquery',
  jQuery: 'jquery',
  Popper: ['popper.js', 'default'],
  $clamp: ['clamp-js-main']
}));

// This is needed because of this:
// https://stackoverflow.com/questions/54758232/rendering-js-from-a-rails-controller-with-webpacker
// environment.config.merge({
//   module: {
//     rules: [
//       {
//         test: require.resolve('jquery'),
//         loader: 'expose-loader',
//         options: {
//           exposes: ['$', 'jQuery'],
//         }
//       }
//     ]
//   }
// });

// console.log(typeof(environment));

// console.log(environment);
// environment.splitChunks();
environment.splitChunks(config => {
  // console.log(config);
  config.externals = {moment: 'moment'};
  let newconf = Object.assign({}, config, {
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        // maxInitialRequests: Infinity,
        // minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            // test: /[\\/]node_modules[\\/]/,
            name(module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

              // npm package names are URL-safe, but some servers don't like @ symbols
              return `npm.${packageName.replace('@', '')}`;
            },

          }
        }
      }
    }
  });
  // console.log(newconf);
  return newconf;
});
  // let newconf = config.optimization.splitChunks.name = true;
  // console.log(newconf);
  // return newconf;
  // let ret = Object.assign({}, config, {
  //   splitChunks: {
  //     chunks: 'all',
  //     name: 'vendor'
  //   }
  // });
  // console.log(ret);
  // return ret;
// });
// environment.splitChunks();

// environment.optimization = {
//   runtimeChunk: 'single',
//   splitChunks: {
//     cacheGroups: {
//       vendor: {
//         test: /[\\/]node_modules[\\/]/,
//         name: 'vendors',
//         chunks: 'all'
//       }
//     }
//   }
// };

// console.log(environment);
module.exports = environment;
