$(document).on('turbolinks:load', function(e) {
  if (window.location.pathname === '/properties/new' || window.location.pathname.match(/^\/properties\/\d+\/edit$/)) {
    let active_locale = $('#current_locale').data().i18n.locale || 'en';
    if (active_locale !== 'en') {
      if (active_locale === 'el') {
        flatpickr.defaultConfig.locale = 'gr';
        flatpickr.defaultConfig.dateFormat = "l, d M Y";
      } else {
        console.warn('Unknown lang selected for pickers.');
        // Need to load the lang and set it as
        // flatpickr.defaultConfig.locale = active_locale
      }
    }
  }
});