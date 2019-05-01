const getParticles = () => {
  return Promise.all([
    import(/* webpackChunkName: "particlesjs" */
    'particles.js'),
    import(/* webpackChunkName: "particlesJSONData" */
    './particles.json')
  ]);
};

$(document).on('turbolinks:load', function(e) {
  if ($('.auth-header').length < 1) return;
  getParticles().then(([particlesjs, particles_data]) => {
    particlesJS('auth-header', particles_data);
  });
});
