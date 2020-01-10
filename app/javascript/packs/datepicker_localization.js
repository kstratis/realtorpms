import { setFlatPickrSettings } from './utilities';

$(document).on('turbolinks:load', function(e) {
  if (window.location.pathname === '/properties/new' || window.location.pathname.match(/^\/properties\/\d+\/edit$/)) {
    const active_locale = $('#current_locale').data().i18n.locale || 'en';
    // For some reason flatpicker only understands 'gr' instead of 'el'
    setFlatPickrSettings(active_locale === 'el' ? 'gr' : active_locale);
  }
});