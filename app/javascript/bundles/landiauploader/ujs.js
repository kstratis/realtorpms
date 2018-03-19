import { DirectUploadsController } from "./direct_uploads_controller"
import { findElement } from "./helpers"

const processingAttribute = "data-direct-uploads-processing"
let started = false

export function start() {
  if (!started) {
    started = true;
    document.addEventListener("submit", didSubmitForm);
    document.addEventListener("ajax:before", didSubmitRemoteElement)
  }
}

function didSubmitForm(event) {
  handleFormSubmissionEvent(event)
}

function didSubmitRemoteElement(event) {
  if (event.target.tagName == "FORM") {
    handleFormSubmissionEvent(event)
  }
}

function handleFormSubmissionEvent(event) {
  console.log('handleFormSubmissionEvent called');

  const form = event.target

  if (form.hasAttribute(processingAttribute)) {
    event.preventDefault()
    return
  }

  const controller = new DirectUploadsController(form)
  const { inputs } = controller

  if (inputs.length) {
    console.log('INSIDE THE INPUTS LENGTH');
    event.preventDefault()
    form.setAttribute(processingAttribute, "")
    inputs.forEach(disable)
    controller.start(error => {
      form.removeAttribute(processingAttribute)
      if (error) {
        inputs.forEach(enable)
      } else {
        submitForm(form)
      }
    })
  }
}

function submitForm(form) {
  console.log('this should only print once');
  let button = findElement(form, "input[type=submit]")
  if (button) {
    console.log('inside if')
    const { disabled } = button
    button.disabled = false
    button.focus()
    button.click()
    button.disabled = disabled
  } else {
    console.log('inside else')

    button = document.createElement("input")
    button.type = "submit"
    button.style = "display:none"
    form.appendChild(button)
    button.click()
    form.removeChild(button)
  }
}

function disable(input) {
  input.disabled = true
}

function enable(input) {
  input.disabled = false
}
