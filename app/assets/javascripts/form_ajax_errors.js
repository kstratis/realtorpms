$.fn.render_form_errors = function(model_name, errors) {
  // console.log('running YOLO ');
  var input;
  var form = this;
  var name;

  // console.log(form);

  this.clear_form_errors();
  // console.log(this);

  // console.log(errors);
  // errors = $.parseJSON(errors);
  // console.log(typeof errors);
  // this.clear_form_errors();

  $.each(errors, function(field, messages) {
    input = form.find('input, select, textarea').filter(function() {
      name = $(this).attr('name') || $(this).data('name'); // caters for react-select component
      // console.log(name);
      if (name) {
        return name.match(new RegExp(model_name + '\\[' + field + '\\(?'));
      }
    });
    console.log(messages);
    input
      .closest('.form-group')
      .addClass('has-error')
      .append(
        '<span class="help-block">' +
          $.map(messages, function(m) {
            return m.charAt(0).toUpperCase() + m.slice(1);
          }).join('<br />') +
          '</span>'
      );
    // input.parent().append('<span class="help-block">' + 'asdds'+ '</span>');
  });
};

$.fn.clear_form_errors = function() {
  this.find('.form-group').removeClass('has-error');
  this.find('span.help-block').remove();
};

$.fn.clear_form_fields = function() {
  this.find(':input', '#myform')
    .not(':button, :submit, :reset, :hidden')
    .val('')
    .removeAttr('checked')
    .removeAttr('selected');
};
