const getParticles = () => {
  return Promise.all([
    import(/* webpackChunkName: "particlesjs" */
    'particles.js'),
    import(/* webpackChunkName: "particlesJSONData" */
    './particles.json')
  ]);
};

const getFotorama = () => {
  return Promise.all([
    import(/* webpackChunkName: "fotoramajs" */
      'fotorama.dev.js'),
    import(/* webpackChunkName: "fotoramacss" */
      'fotorama.dev.css')
  ]);
};

// const getDatatables = () => {
//   return import('./components-bundle.js')
  // return Promise.all([
  //   import(/* webpackChunkName: "particlesjs" */
  //     'ReactOnRails' from 'react-on-rails'),
  //   import(/* webpackChunkName: "particlesJSONData" */
  //     './particles.json')
  // ]);
  // import React, { Suspense, lazy } from 'react';
// };

$(document).on('turbolinks:load', function(e) {
  console.log('running');
  if ($('.auth-header').length > 0) {
    getParticles().then(([particlesjs, particles_data]) => {
      particlesJS('auth-header', particles_data);
    });
  }

  if ($('.fotorama').length > 0) {
    getFotorama().then(([fotoramajs, fotoramacss]) => {
      $('.fotorama').fotorama();
    });
  }

  // if ($('#properties_index').length > 0) {
  //   getDatatables().then((loadedModule)=>{
  //     // console.log(loadedModule);
  //     // debugger;
  //     loadedModule.default();
  //     // console.log(module);
  //   })
  // }

});
