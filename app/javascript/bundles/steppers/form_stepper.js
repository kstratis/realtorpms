import Stepper from 'bs-stepper';

class FormStepper {
  constructor() {
    this.init();
    this.form = $('#stepper-form').parsley();
    this.current_step = 1; // Always start at step 1
    // Keeps track of whether a step has been validated at least once.
    this.stepsInitialValidation = {};
    for (let i = 1; i <= $('li.step').length; i++) {
      this.stepsInitialValidation[i] = false;
    }
  }

  // Bootstraps the form wizard
  init() {
    this.handleValidations();
    this.handleSteps();
  }

  // Validates a single field. Mainly used by the react-select components
  validateField(field) {
    if (field) {
      $(`#${field}`)
        .parsley()
        .validate();
    }
  }

  // Main validation function. Partially validates the form.
  validateBy(group, groupStep, stepDirection = '', onSuccessMove = true) {
    this.form
      // On form validation stop the normal behaviour and do it in groups
      .on('form:validate', function(formInstance) {
        const isValid = formInstance.isValid({
          group: group
        });
        // Normalize states
        groupStep.removeClass('success error');

        // Give step item a validate state
        if (isValid) {
          groupStep.addClass('success');
          // go to next step or submit
          let currentStep = FormStepper.getStep(groupStep);

          if (currentStep === $('.step').length) {
            $('#submitfeedback').toast('show');
            // DEBUG
            console.log($('#stepper-form').serializeArray());
          } else {
            onSuccessMove ? stepperDemo.next() : '';
          }
        } else {
          groupStep.addClass('error');
        }
      })
      // Triggers the form validation.
      .validate({
        group: group
      });

    // Kills the form listener
    $('#stepper-form')
      .parsley()
      .off('form:validate');
  }

  // Gets the current step
  static getStep(element) {
    console.log(element);
    return element
      .data()
      .target.split('-')
      .pop();
  }

  // Gets the step direction. You can reference a static method
  // from within another static method using `this`.
  // Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static#Calling_static_methods
  static getStepDirection(newStepElement, currentStep) {
    const newStep = this.getStep(
      $(newStepElement)
        .parents('li.step')
        .first()
    );
    if (currentStep !== newStep) {
      return currentStep < newStep ? 'forward' : 'backward';
    }
    return 'forward';
  }

  // Handles the event listeners
  handleValidations() {
    // Store away the `this`
    const self = this;

    // Next button handler
    $('.next').on('click', function() {
      const $group = $(this).data().validate;
      const $groupStep = $(
        `[data-target="#${$(this)
          .parents('.content')
          .attr('id')}"]`
      );
      self.validateBy($group, $groupStep);
    });

    // Previous button handler
    $('.prev').on('click', function() {
      const $trigger = $(this);
      const groupId = $trigger.parents('.content').attr('id'); // i.e. test-l-2

      const $groupStep = $(`[data-target="#${groupId}"]`); // i.e. li.step.active
      // Normalize states
      $groupStep.removeClass('success error');
      $groupStep.prev().removeClass('success error');
      stepperDemo.previous();
    });

    // `leaveStep` listener
    $('.step-trigger').on('leaveStep', function(element) {
      const direction = FormStepper.getStepDirection(element.target, self.current_step);
      if (direction === 'backward' && !self.stepsInitialValidation[self.current_step]) return;
      // DEBUG
      // console.log('the direction is: ' + direction);
      self.stepsInitialValidation[self.current_step] = true;
      const $groupStep = $(`[data-target="#test-l-${self.current_step}"]`);
      const $group = $groupStep.data().fieldset;
      // DEBUG
      // console.log('leaving step: ' + self.current_step);
      self.validateBy($group, $groupStep);
    });

    // `showStep` listener
    $('.step-trigger').on('showStep', function(element) {
      // Set the new step
      self.current_step = FormStepper.getStep($(this).parent());
      // DEBUG
      // console.log('entering step: ' + self.current_step)
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
      const $groupStep = $(
        `[data-target="#${$(this)
          .parents('.content')
          .attr('id')}"]`
      );
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
