import { setFlatPickrSettings } from './utilities';

$(document).on('turbolinks:load', function(e) {
  if (window.location.pathname === '/properties/new' || window.location.pathname.match(/^\/properties\/\d+\/edit$/)) {
    const active_locale = $('#current_locale').data().i18n.locale || 'en';
    setFlatPickrSettings(active_locale);
    // if (active_locale !== 'en') {
    //   if (active_locale === 'el') {
    //     flatpickr.defaultConfig.locale = 'gr';
    //     // flatpickr.defaultConfig.dateFormat = "l, d M Y";
    //     flatpickr.defaultConfig.dateFormat = 'Z';
    //     flatpickr.defaultConfig.altInput = true;
    //     flatpickr.defaultConfig.altFormat = 'l, d M Y';
    //   } else {
    //     console.warn('Unknown lang selected for pickers.');
    //     // Need to load the lang and set it as
    //     // flatpickr.defaultConfig.locale = active_locale
    //   }
    // }
  }
});