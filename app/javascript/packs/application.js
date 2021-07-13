/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb
import bootbox from "bootbox";

require("@rails/ujs").start();
import './turbolinks_wrapper';
import './calendar';

// import 'stacked-menu'

// ---
// require("@rails/activestorage").start();
// require("channels");
// ---

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

function noop() {}

$(document).on('turbolinks:load', function(e) {
  if ($(".uppy-emitters, .file-emitters").length > 0){
    let modules = Promise.all([
      import(/* webpackChunkName: "UppyController" */
        '../bundles/uploaders/uppy_controller.js'),
      import(/* webpackChunkName: "ASUploadHandler" */
        './activestorage_upload_handler.js')
    ]);
    modules = modules || Promise.resolve({ default: noop });
    modules.then(([{default: Uppy_ctrl}, {default: As_handler}]) => {
      new Uppy_ctrl();
      CustomActiveStorage.start();
      new As_handler();
    });
  }
  if ($('.dependent_input').length) setup_dependent_checkboxes();
  // TODO remove this on deploy
  if (window.location.pathname === '/demo'){
    import(/* webpackChunkName: "ExampleWOOT", webpackPrefetch: true */ '../bundles/Example.jsx').then(({default: Example}) => {
      ReactDOM.render(<Example />, document.getElementById('lazy'))
    });
  }

  $('[data-toggle="tooltip"]').tooltip();
  $('[data-toggle="popover"]').popover();

  // BOOTBOX STUFF
  // Set its language
  const translation = JSON.parse(document.getElementById('menu_i18n').dataset.menui18n);

  // This is for the Menu item 'Support'
  $('#support').on('click', (e) => {
    e.preventDefault()
    bootbox.alert({
      title: translation['support']['title'],
      message: translation['support']['message_html'],
      centerVertical: true,
    })
  })

  // TOUR DATA
  const tour_check = JSON.parse(document.getElementById('tour-check').dataset.tour);

  if ((!tour_check['has_taken_tour']) && (window.innerWidth > 767)){
    const tour_data = JSON.parse(document.getElementById('tour').dataset.tour);
    import(/* webpackChunkName: "TourManager", webpackPrefetch: true */ '../packs/tour_manager.js').then(({default: TourManager}) => {
      new TourManager(tour_data).start();
    });
  }
});

