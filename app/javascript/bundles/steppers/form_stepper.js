import Stepper from 'bs-stepper';

class FormStepper {
  constructor() {
    console.log('running');
    this.init();
  }

  init() {
    // event handlers
    this.handleValidations();
    this.handleSteps();
  }

  validateBy(trigger) {
    const $trigger = $(trigger);
    console.log($trigger);
    const group = $trigger.data().validate;
    console.log(group); // fieldset01
    const groupId = $trigger.parents('.content').attr('id');
    console.log(groupId); // test-l-1
    const $groupStep = $(`[data-target="#${groupId}"]`);
    console.log($groupStep); // li.step.active


    $('#stepper-form')
      .parsley()
      .on('form:validate', function(formInstance) {
        const isValid = formInstance.isValid({
          group: group
        });
        // normalize states
        $groupStep.removeClass('success error');

        // formInstance.whenValid({
        //   group: group
        // }).then(function(value){
        //   console.log('resolved');

        // }).fail(function(){
        //   console.log('not resolved');
        // });

        console.log('checking isValid');

        // give step item a validate state
        if (isValid) {
          $groupStep.addClass('success');
          // go to next step or submit
          if ($trigger.hasClass('submit')) {
            $('#submitfeedback').toast('show');
            console.log($('#stepper-form').serializeArray());
          } else {
            stepperDemo.next();
          }
        } else {
          $groupStep.addClass('error');
        }
      })
      .validate({
        group: group
      });

    // kill listener
    $('#stepper-form')
      .parsley()
      .off('form:validate');
  }

  handleValidations() {
    const self = this;
    // validate on next buttons
    $('.next').on('click', function() {
      self.validateBy(this);
    });

    // prev buttons
    $('.prev').on('click', function() {
      const $trigger = $(this);
      const groupId = $trigger.parents('.content').attr('id');
      const $groupStep = $(`[data-target="#${groupId}"]`);
      // normalize states
      $groupStep.removeClass('success error');
      $groupStep.prev().removeClass('success error');

      stepperDemo.previous();
    });

    // save creadit card
    $('#savecc').on('click', () => {
      $('#stepper-form')
        .parsley()
        .whenValidate({
          group: 'creditcard'
        });
    });

    // submit button
    $('.submit').on('click', function() {
      self.validateBy(this);

      return false;
    });
  }

  handleSteps() {
    const selector = document.querySelector('#stepper');
    window.stepperDemo = new Stepper(selector, {
      linear: false
    });
  }
}

export default FormStepper;
