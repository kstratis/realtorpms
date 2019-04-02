// This is basically a customized version of ujs.js of activestorage.
// The main idea used here is that is changes DirectUploadsController to CustomDirectUploadsController which in turn
// changes a few things on how uploads work in conjuction with a file uploading library. The lines that changed include
// a comment so that they can be easily spotted.

// changed line
import { CustomDirectUploadsController } from './custom_direct_uploads_controller';
import { findElement } from 'activestorage/src/helpers';

const processingAttribute = 'data-direct-uploads-processing';
const submitButtonsByForm = new WeakMap();
let started = false;

export function start() {
  if (!started) {
    started = true;
    document.addEventListener('click', didClick, true);
    document.addEventListener('submit', didSubmitForm);
    document.addEventListener('ajax:before', didSubmitRemoteElement);
  }
}

function didClick(event) {
  const { target } = event;
  if ((target.tagName == 'INPUT' || target.tagName == 'BUTTON') && target.type == 'submit' && target.form) {
    submitButtonsByForm.set(target.form, target);
  }
}

function didSubmitForm(event) {
  handleFormSubmissionEvent(event);
}

function didSubmitRemoteElement(event) {
  if (event.target.tagName == 'FORM') {
    handleFormSubmissionEvent(event);
  }
}

function handleFormSubmissionEvent(event) {
  const form = event.target;

  if (form.hasAttribute(processingAttribute)) {
    event.preventDefault();
    return;
  }

  // changed line
  const controller = new CustomDirectUploadsController(form);
  // changed line
  const { $inputs } = controller;

  // changed line
  if ($inputs.length) {
    event.preventDefault();
    form.setAttribute(processingAttribute, '');
    // changed line
    $.each($inputs, (index, element) => disable(element));
    controller.start(error => {
      form.removeAttribute(processingAttribute);
      if (error) {
        $inputs.forEach(enable);
      } else {
        submitForm(form);
      }
    });
  }
}

function submitForm(form) {
  let button = submitButtonsByForm.get(form) || findElement(form, 'input[type=submit], button[type=submit]');

  if (button) {
    const { disabled } = button;
    button.disabled = false;
    button.focus();
    button.click();
    button.disabled = disabled;
  } else {
    button = document.createElement('input');
    button.type = 'submit';
    button.style.display = 'none';
    form.appendChild(button);
    button.click();
    form.removeChild(button);
  }
  submitButtonsByForm.delete(form);
}

function disable(input) {
  input.disabled = true;
}

function enable(input) {
  input.disabled = false;
}
