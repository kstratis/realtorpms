const { environment } = require('@rails/webpacker');

// console.log(typeof(environment));
environment.splitChunks();
// environment.splitChunks(config => {
//   console.log(config);
//   newconf = Object.assign({}, config, {
//     optimization: {
//       splitChunks: {
//         cacheGroups: {
//           vendor: {
//             name: 'vendors',
//             chunks: 'all'
//           }
//         }
//       }
//     }
//   });
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
