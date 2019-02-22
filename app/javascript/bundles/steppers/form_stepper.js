import Stepper from 'bs-stepper';

class FormStepper {
  constructor($stepperForm) {
    this.init();
    // Initialize and store away the parsley form
    this.form = $stepperForm.parsley();
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
  validateBy(group, groupStep, currentStep) {
    this.form
      // On form validation stop the normal behaviour and do it in groups
      .on('form:validate', function(formInstance) {
        const isValid = formInstance.isValid({
          group: group
        });
        // Normalize states
        groupStep.removeClass('success error');

        // Give step item a validation state
        if (isValid) {
          groupStep.addClass('success');
          // Go to next step or submit
          // let currentStep = FormStepper.getStep(groupStep);
          // This should never fire as the form is normally handled by ujs
          if (currentStep === $('.step').length) console.warn('The form stepper is handling the submit button. Please contact support');
        } else {
          groupStep.addClass('error');
        }
      })
      // Triggers the form validation.
      .validate({
        group: group
      });

    // Kills the form listener
    this.form.off('form:validate');
  }

  // Gets the current step
  static getStep(element) {
    return element
      .data()
      .target.split('-')
      .pop();
  }

  // Gets the step direction. You can reference a static method
  // from within another static method using `this`.
  // Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static#Calling_static_methods
  static getStepDirection(newStepDomEl, currentStep) {
    const newStep = this.getStep(
      $(newStepDomEl)
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
    // Store away the `this` reference
    const self = this; // FormStepper

    // Next button handler
    $('.next').on('click', function(e) {
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

    // `leaveStep` listener. This only applies to the step navigation ribbon and won't fire on next/back buttons
    $('body').on('leaveStep', function(element) {
      const direction = FormStepper.getStepDirection(element.target, self.current_step);
      if (direction === 'backward' && !self.stepsInitialValidation[self.current_step]) return;
      // DEBUG
      // console.log('the direction is: ' + direction);
      self.stepsInitialValidation[self.current_step] = true;
      const $groupStep = $(`[data-target="#test-l-${self.current_step}"]`);
      const $group = $groupStep.data().fieldset;

      return self.validateBy($group, $groupStep, self.current_step);
    });

    // `showStep` listener. This only applies to the step navigation ribbon and won't fire on next/back buttons
    $('body').on('showStep', function(element, params) {
      // DEBUG
      // console.trace();
      // Set the new step
      self.current_step = params;
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
