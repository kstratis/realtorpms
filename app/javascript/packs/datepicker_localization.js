$(document).on('turbolinks:load', function(e) {
  if (window.location.pathname === '/properties/new') {
    let active_locale = $('#current_locale').data().i18n.locale || 'en';
    if (active_locale !== 'en') {
      if (active_locale === 'el') {
        flatpickr.defaultConfig.locale = 'gr';
      } else {
        console.warn('Unknown lang selected for pickers.');
        // Need to load the lang and set it as
        // flatpickr.defaultConfig.locale = active_locale
      }
    }
  }
});