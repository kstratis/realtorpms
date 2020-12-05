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

const getParticles = () => {
  return Promise.all([
    import(/* webpackChunkName: "particlesjs" */
      'particles.js'),
    import(/* webpackChunkName: "particlesJSONData" */
      './particles.json')
  ]);
};

export { clearValidatableFields, setFlatPickrSettings, getParticles };
