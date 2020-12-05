import { getParticles } from './utilities';

const getFotorama = () => {
  return Promise.all([
    import(/* webpackChunkName: "fotoramajs" */ 'fotorama.dev.js'),
    import(/* webpackChunkName: "fotoramacss" */ 'fotorama.dev.css'),
  ]);
};

$(document).on('turbolinks:load', function (e) {
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
});
