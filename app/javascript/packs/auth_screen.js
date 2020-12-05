import { getParticles } from './utilities';

// This properly closes flash messages upon logout
window.addEventListener('DOMContentLoaded', () => {
  // Handle alerts
  const element = document.querySelectorAll("[data-dismiss='alert']")[0];
  const removeAlert = function () {
    document.querySelector('.alert,.alert-container').remove();
  };
  if (element) {
    element.addEventListener('click', removeAlert, false);
  }

  getParticles().then(([particlesjs, particles_data]) => {
    particlesJS('auth-header', particles_data);
  });
});
