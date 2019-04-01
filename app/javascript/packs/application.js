/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb

// import { start } from '../bundles/activestorageModifiedv52/index';
import * as ActiveStorage from "activestorage"
import * as uploader from '../bundles/uploaders/uppy_controller';
import flatpickr from "flatpickr";
import { Greek } from "flatpickr/dist/l10n/gr.js"

$(document).on('turbolinks:load', function(e) {
  ActiveStorage.start()
  // start();
});