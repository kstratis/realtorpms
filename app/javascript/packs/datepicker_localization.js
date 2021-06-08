import { setFlatPickrSettings } from './utilities';

$(document).on('turbolinks:load', function (e) {
  const active_locale_domelement = $('#current_locale');
  if (!active_locale_domelement.length) return;
  const lang = active_locale_domelement.data().i18n.locale || 'en';
  setFlatPickrSettings(lang === 'el' ? 'gr' : lang);
});
