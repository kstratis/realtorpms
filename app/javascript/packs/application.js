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
import { initCrisp } from "./utilities";

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
import 'bootstrap'
import Rails from "@rails/ujs";  // bootstrap js files

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
  if (window.location.pathname === '/app/demo'){
    import(/* webpackChunkName: "ExampleWOOT", webpackPrefetch: true */ '../bundles/Example.jsx').then(({default: Example}) => {
      ReactDOM.render(<Example />, document.getElementById('lazy'))
    });
  }

  $('[data-toggle="tooltip"]').tooltip();
  $('[data-toggle="popover"]').popover();

  // -====BOOTBOX STUFF====-
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
  // -====BOOTBOX STUFF END====-

  // -====TOUR HANDLER====-
  // Preload some data from the HTML
  const { has_taken_tour, tour_data_url } = JSON.parse(document.getElementById('tour_metadata').dataset.tour);

  function loadTour(stage) {
    if (has_taken_tour && (stage === 'onload')) return;

    if (window.innerWidth > 767){
      const tour_content = JSON.parse(document.getElementById('tour_content').dataset.tour);
      import(/* webpackChunkName: "TourManager", webpackPrefetch: true */ '../packs/tour_manager.js').then(({default: TourManager}) => {
        new TourManager(tour_content, stage).start();
      });
    }
  }

  loadTour('onload');

  // This is the on-demand tour handler.
  // If the tour has already been taken by a user, allow him
  // to watch it again on demand. The first time he asks for it load
  // the data through ajax
  $('#tour_toggle').on('click', (e) => {
    e.preventDefault()

    if ($('#tour_content').length === 0) {
      Rails.ajax({
        type: 'GET',
        url: tour_data_url,
        dataType: 'json',
        success: response => {
          const data = response.message;
          $('#tour_container').html(data)
          loadTour('onclick');
        },
      });
    } else{
      loadTour('onclick');
    }
  });
  // -====TOUR HANDLER END====-

  // users_controller#show
  $("#tabUserProperties").on('click', (e) => {
    e.preventDefault();
    location.hash = '#assignments';
    $('.nav-tabs a[href="#assignments"]').tab('show');

  })

  $("#tabUserClients").on('click', (e) => {
    e.preventDefault();
    location.hash = '#clients';
    $('.nav-tabs a[href="#clients"]').tab('show');
  })

  // Website single attribute ajax updater
  $('.solo-attribute-updater').on('change', (e) => {
    e.preventDefault();
    const $form = $(e.currentTarget).closest('form');  // Get the form
    const endpoint = $form.attr('action');
    const formData = $form.serialize()
    const hasCallback = $(e.currentTarget).hasClass('with-callback');

    Rails.ajax({
      type: 'POST',
      data: formData,
      url: endpoint,
      dataType: 'json',
      success: response => {
        if (hasCallback) {
          $('#refresh-link').removeClass('d-none');
        }
      },
    })
  });

  // Payment handler
  $('#pay').on('click', (e) =>{
    e.preventDefault();

    import(/* webpackIgnore: true */ 'https://cdn.paddle.com/paddle/paddle.js').then(()=>{
      if ($(e.currentTarget).data('environment') === 'development'){
        console.log('setting the test mode')
        Paddle.Environment.set('sandbox');
      }
      Paddle.Setup({ vendor: $(e.currentTarget).data('vendor') });
      Paddle.Checkout.open({
        override: $(e.currentTarget).data('paymentLink')
      });
    });
  })
});

