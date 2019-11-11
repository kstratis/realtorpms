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

export { clearValidatableFields };
