/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb

require("@rails/ujs").start();
import './turbolinks_wrapper';
// import 'stacked-menu'

// ---
// require("@rails/activestorage").start();
// require("channels");
// ---

import * as uploader from '../bundles/uploaders/uppy_controller';
import flatpickr from "flatpickr";
import { Greek } from "flatpickr/dist/l10n/gr.js"
import { setup_dependent_checkboxes } from '../bundles/utilities/helpers';
import * as CustomActiveStorage from '../bundles/uploaders/custom_active_storage';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap'  // bootstrap js files

// This is how we manage to load webpack processed images skipping the asset pipeline entirely.
// Note that images referenced from within webpack-processed scss are automatically included. However for
// view helpers such `image_pack_tag` to work we need to require their context here.
// See more in the docs: https://github.com/rails/webpacker/blob/master/docs/assets.md#link-in-your-rails-views
require.context('../images', true)

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

