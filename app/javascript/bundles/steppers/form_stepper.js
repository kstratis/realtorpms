import Stepper from 'bs-stepper';

class FormStepper {
  constructor() {
    console.log('running');
    this.init();
    this.form = $('#stepper-form').parsley();
    this.current_step = 1;
  }

  init() {
    // event handlers
    this.handleValidations();
    this.handleSteps();
  }

  validateField(field){
    if (field){
      $(`#${field}`).parsley().validate();
    }
  }



  validateBy(group, groupStep, onSuccessMove=true) {
    this.form
      .on('form:validate', function(formInstance) {
        const isValid = formInstance.isValid({
          group: group
        });
        // normalize states
        groupStep.removeClass('success error');

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
          console.log('it is valid');

          groupStep.addClass('success');
          // go to next step or submit
          // .split('-').pop()
          console.log(this);
          let currentStep = FormStepper.getStep(groupStep);
          console.log(currentStep);


          // if ($trigger.hasClass('submit')) {
        if (currentStep === $('.step').length){
            $('#submitfeedback').toast('show');
            console.log($('#stepper-form').serializeArray());
          } else {
            onSuccessMove ? stepperDemo.next() : '';
          }


        } else {
          console.log('it is NOT valid');
          groupStep.addClass('error');
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

  static getStep(element){
    console.log(element);
    return element.attr('data-target').split('-').pop();
  };

  handleValidations() {
    const self = this;
    // validate on next buttons
    $('.next').on('click', function() {
      console.log(this); // button.next.btn.btn-primary.ml-auto
      const $group = $(this).data().validate;
      const $groupStep = $(`[data-target="#${$(this).parents('.content').attr('id')}"]`);
      self.validateBy($group, $groupStep);
    });

    // prev buttons
    $('.prev').on('click', function() {
      const $trigger = $(this);
      const groupId = $trigger.parents('.content').attr('id'); // test-l-2

      const $groupStep = $(`[data-target="#${groupId}"]`);  // li.step.active
      // normalize states
      $groupStep.removeClass('success error');
      $groupStep.prev().removeClass('success error');

      stepperDemo.previous();
    });


    $('.step-trigger').on('leaveStep', function(){
      const $groupStep = $(`[data-target="#test-l-${self.current_step}"]`);
      const $group = $groupStep.data().fieldset;
      console.log('leaving step: ' + self.current_step);
      self.validateBy($group, $groupStep);
    });

    $('.step-trigger').on('showStep', function(){
      self.current_step = FormStepper.getStep($(this).parent());
      console.log('entering step: ' + self.current_step)
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
      const $group = $(this).data().validate;
      const $groupStep = $(`[data-target="#${$(this).parents('.content').attr('id')}"]`);
      self.validateBy($group, $groupStep);
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
