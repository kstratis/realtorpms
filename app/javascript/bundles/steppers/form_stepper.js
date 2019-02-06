import Stepper from 'bs-stepper';

class FormStepper {
  constructor() {
    console.log('running');
    this.init();
    this.form = $('#stepper-form').parsley();
  }

  init() {
    // event handlers
    this.handleValidations();
    this.handleSteps();
  }

  // validateSelect(group){
  //   const $form = $('#stepper-form');
  //   $form.parsley().on('form:validate', function(formInstance) {
  //     const isValid = formInstance.isValid({
  //       group: group
  //     });
  //   }).validate({
  //     group: group
  //   });
  //
  //
  //   $form.parsley().validate({group: group});
  //   const $activeStep = $('.step.active');
  //
  //
  //
  //
  //
  //
  // }

  validateField(field){
    if (field){
      $(`#${field}`).parsley().validate();
    }
  }

  validateBy(trigger, requestedGroup='', onSuccessMove=true) {
    let $group = '';
    let $groupId = '';
    let $groupStep = '';
    if (trigger && !requestedGroup){
      const $trigger = $(trigger);
      $group = $trigger.data().validate;
      $groupId = $trigger.parents('.content').attr('id');
      $groupStep = $(`[data-target="#${$groupId}"]`);
    } else if (!trigger && requestedGroup) {
      $group = requestedGroup;
      $groupStep = $('li.step.active');
    }

    // DEBUG
    console.log($group); // fieldset01
    console.log($groupId); // test-l-1
    console.log($groupStep); // li.step.active


    this.form
      .on('form:validate', function(formInstance) {
        const isValid = formInstance.isValid({
          group: $group
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
          // .split('-').pop()
          let currentStep = $groupStep.attr('data-target').split('-').pop();
          console.log(currentStep);



          // }





          // if ($trigger.hasClass('submit')) {
        if (currentStep === $('.step').length){
            $('#submitfeedback').toast('show');
            console.log($('#stepper-form').serializeArray());
          } else {
            onSuccessMove ? stepperDemo.next() : '';
          }


        } else {
          $groupStep.addClass('error');
        }
      })
      .validate({
        group: $group
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
