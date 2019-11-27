import React from 'react';
import fromEntries from '@ungap/from-entries';
import URLSearchParams from '@ungap/url-search-params';

const debounce = (func, wait, immediate) => {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

const capitalizeFirstLetter = string => {
  if (typeof string !== 'string') return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const renderHTML = (htmlContent, mode='block') => {
  return mode === 'block' ? <div dangerouslySetInnerHTML={{ __html: htmlContent }} /> : <span dangerouslySetInnerHTML={{ __html: htmlContent }} />
};

const buildUserURL = (freeze_url, user_id) => {
  return freeze_url.replace(/USERID/i, user_id);
};

const isUrl = string => {
  const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  return regexp.test(string);
};

const safelyExecCallback = (fnParent, ...params) => {
  if (fnParent.callback && typeof fnParent.callback === 'function') fnParent.callback(...params);
};

const arrayToObject = array => {
  return array.reduce((obj, item) => {
    obj[Object.keys(item)[0]] = Object.values(item)[0];
    return obj;
  }, {});
};

const priceFilterOptions = data => {
  const datarent = data['rent']['subcategory'];
  const datasell = data['sell']['subcategory'];
  return arrayToObject(datarent.concat(datasell).flat());
};

const sizeFilterOptions = data => {
  const databuilding = data['building']['subcategory'];
  const dataland = data['land']['subcategory'];
  return arrayToObject(databuilding.concat(dataland).flat());
};

const floorFilterOptions = data => {
  const databuilding = data['building']['subcategory'];
  const dataland = data['land']['subcategory'];
  return arrayToObject(databuilding.concat(dataland).flat());
};

const categoryFilterOptions = data => {
  const dataresidential = data['residential']['subcategory'];
  const dataresidential_title = data['residential']['category'];
  const datacommercial = data['commercial']['subcategory'];
  const datacommercial_title = data['commercial']['category'];
  const dataland = data['land']['subcategory'];
  const dataland_title = data['land']['category'];
  const dataother = data['other']['subcategory'];
  const dataother_title = data['other']['category'];
  return arrayToObject(
    dataresidential
      .concat(datacommercial)
      .concat(dataland)
      .concat(dataother)
      .concat(dataother)
      .concat(dataresidential_title)
      .concat(datacommercial_title)
      .concat(dataland_title)
      .concat(dataother_title)
      .flat()
  );
};

const ifExists = (collection, item) => {
  return collection ? collection[item] : '';
};

// Disable the save search button when no params are available
const hasParams = () => {
  let searchParams = new URLSearchParams(window.location.search);
  let param_counter = 0;
  for (let p of searchParams) {
    // count these out
    if (['page', 'sizeminmeta', 'sizemaxmeta', 'ordering', 'sorting'].indexOf(p[0]) === -1) {
      param_counter = param_counter + 1;
    }
  }
  return param_counter > 0;
};

// Sets up the
const setup_dependent_checkboxes = () => {
  var elements = $('.dependent_check');
  var status;
  elements.each(function() {
    status = $(this).prop('checked');
    $(this)
      .parent()
      .siblings()
      .find('.dependent_input')
      .prop('disabled', !status);
    $(this)
      .parent()
      .siblings()
      .find('.dependent_label.plain')
      .toggleClass('disabled', !status);
  });
  elements.change(function() {
    $(this)
      .parent()
      .siblings()
      .find('.dependent_input')
      .prop('disabled', !this.checked).find('.dependent_label.plain').toggleClass('disabled', !this.checked);
    $(this)
      .parent()
      .siblings()
      .find('.dependent_label.plain')
      .toggleClass('disabled', !this.checked);
  });
};

export {
  debounce,
  capitalizeFirstLetter,
  renderHTML,
  buildUserURL,
  isUrl,
  safelyExecCallback,
  priceFilterOptions,
  sizeFilterOptions,
  floorFilterOptions,
  categoryFilterOptions,
  ifExists,
  hasParams,
  setup_dependent_checkboxes
};
