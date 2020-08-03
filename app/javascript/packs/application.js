/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb

import * as uploader from '../bundles/uploaders/uppy_controller';
import flatpickr from "flatpickr";
import { Greek } from "flatpickr/dist/l10n/gr.js"
import { setup_dependent_checkboxes } from '../bundles/utilities/helpers';
import * as CustomActiveStorage from '../bundles/uploaders/custom_active_storage';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import "bootstrap"
import "../stylesheets/application"

// const getExample = () => {
//   return Promise.all([
//     import(/* webpackChunkName: "Example" */
//       '../bundles/Example.jsx'),
//   ]);
// };

$(document).on('turbolinks:load', function(e) {
  if ($(".uppy-emitters, .file-emitters").length > 0){ CustomActiveStorage.start()}
  if ($('.dependent_input').length) setup_dependent_checkboxes();
  if (window.location.pathname === '/demo'){
    import(/* webpackChunkName: "ExampleWOOT", webpackPrefetch: true */ '../bundles/Example.jsx').then(({default: Example}) => {
      ReactDOM.render(<Example />, document.getElementById('lazy'))
    });
  }
  $('[data-toggle="tooltip"]').tooltip();
  $('[data-toggle="popover"]').popover();
});

