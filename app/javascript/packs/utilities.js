/**
 * Clears the validation attributes on dynamic form fields.
 * i.e. If a field is dynamically removed, its validation should also be turned off.
 * @param {string} className - The class name of the element in question
 */
const clearValidatableFields = className => {
  $(className).each(function(index, element) {
    if (
      $(element)
        .parent()
        .closest('div.form-row, div.client-fields')
        .hasClass('d-none') ||
      (!$(element)
        .closest('div')
        .hasClass('d-block') &&
        className === '.cfield-validatable')  // Cancel out the second OR condition if dealing with non-cfields
    ) {
      $(element).removeAttr('data-parsley-required');
      $(element).removeAttr('data-parsley-required-message');
    }
  });
};

const setFlatPickrSettings = (locale) => {
    window.flatpickr.defaultConfig.locale = locale;
    // flatpickr.defaultConfig.dateFormat = "l, d M Y";
    window.flatpickr.defaultConfig.dateFormat = 'Z';
    window.flatpickr.defaultConfig.altInput = true;
    window.flatpickr.defaultConfig.altFormat = locale === 'gr' ? 'd M Y' : 'M d, Y';
};

// We need to normalize the date taken from JS due to this:
// https://stackoverflow.com/questions/7556591/is-the-javascript-date-object-always-one-day-off
const normalizeFlatPickrDate = (dateStr) => {
  const dateString = new Date(dateStr);
  const normalizedDateObject = new Date( dateString.getTime() + Math.abs(dateString.getTimezoneOffset()*60000) )

  return normalizedDateObject.toJSON();
}

const getParticles = () => {
  return Promise.all([
    import(/* webpackChunkName: "particlesjs" */
      'particles.js'),
    import(/* webpackChunkName: "particlesJSONData" */
      './particles.json')
  ]);
};

function initLanguageSwitcher() {
  $('#locale-switch-reject').on('click', (e) => {
    e.preventDefault();
    $('#language-switcher-container').hide();
    setCookie('locale_switch_dismissed','ok',2);
  });
}

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
  let nameEQ = name + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
function eraseCookie(name) {
  document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function initCrisp(lang){
  window.CRISP_RUNTIME_CONFIG = {
    locale : lang
  };
  window.$crisp = [];
  window.CRISP_WEBSITE_ID = "166e3d44-c91d-4359-bab2-80b3aff6d583";

  (function() {
    var d = document;
    var s = d.createElement("script");

    s.src = "https://client.crisp.chat/l.js";
    s.async = 1;
    d.getElementsByTagName("head")[0].appendChild(s);
  })();
}

export { clearValidatableFields, setFlatPickrSettings, normalizeFlatPickrDate, getParticles, setCookie, getCookie, eraseCookie, initLanguageSwitcher, initCrisp };
