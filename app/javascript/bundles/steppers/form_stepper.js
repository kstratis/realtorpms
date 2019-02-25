import Stepper from 'bs-stepper';

class FormStepper {
  constructor($stepperForm) {
    this.init();
    // Initialize and store away the parsley form
    this.form = $stepperForm.parsley();
    this.current_step = 1; // Always start at step 1
    this.status = 0;
    // Keeps track of whether a step has been validated at least once.
    this.stepsInitialValidation = {};
    this.stepperDOMelements = $('li.step');
    // this.allStepElements = [{}]
    const stepsCount = this.stepperDOMelements.length;
    for (let i = 1; i <= stepsCount; i++) {
      this.stepsInitialValidation[i] = false;
    }
  }

  // Bootstraps the form wizard
  init() {
    this.handleValidations();
    this.handleSteps();
  }

  // Sets the stepper status
  setStatus(status) {
    this.status = status;
  }

  // Retrievess the stepper status
  getStatus() {
    return this.status;
  }

  // Validates a single field. Mainly used by the react-select components
  validateField(field) {
    if (field) {
      $(`#${field}`)
        .parsley()
        .validate();
    }
  }

  // Main validation function. It can either validate single steps or the entire form alltogether.
  validateStep(steps, currentStep, multiple = false) {
    // We always return the result of form validation. This is useful in next/back buttons.
    const formInstance = this.form
      // On form validation stop the normal behaviour and do it in groups
      .on('form:validate', function(formInstance) {
        $.each(steps, (index, step) => {
          step['stepperDOMel'].removeClass('success error');
          formInstance.isValid({ group: step['group'] })
            ? step['stepperDOMel'].addClass('success')
            : step['stepperDOMel'].addClass('error');
        });
      });

    const isFormValid = formInstance.validate(multiple ? {} : { group: steps[0]['group'] });

    // Kills the form listener cause it adds up after each validation
    this.form.off('form:validate');
    return isFormValid;
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

    // Next/Previous button handler
    $('.next, .prev').on('click', function(e) {
      self.setStatus(1);
      const $group = $(this).data().validate;
      const $groupStep = $(
        `[data-target="#${$(this)
          .parents('.content')
          .attr('id')}"]`
      );
      // We use the result of the form validation step so that we can decide whether to proceed to the requested step or not.
      self.validateStep([{ group: $group, stepperDOMel: $groupStep }], self.current_step)
        ? $(e.target).hasClass('next')
          ? stepperDemo.next()
          : stepperDemo.previous()
        : '';
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

      self.validateStep([{ group: $group, stepperDOMel: $groupStep }], self.current_step);
    });

    // `showStep` listener. This only applies to the step navigation ribbon and won't fire on next/back buttons.
    // params is the number of the current step.
    $('body').on('showStep', function(element, params) {
      self.setStatus(1);
      // DEBUG
      // console.trace();
      // Set the new step
      self.current_step = params;
    });

    $('button.submit').on('click', function(e) {
      const groups = self.stepperDOMelements.map((index, el) => ({
        group: `fieldset-${index + 1}`,
        stepperDOMel: $(el)
      }));
      if (self.validateStep(groups, self.current_step, true)) {
        self.setStatus(0);
      }
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
