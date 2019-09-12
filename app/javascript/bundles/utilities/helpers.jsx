import React from 'react';
import fromEntries from '@ungap/from-entries';

const debounce = (func, wait, immediate) => {
  var timeout;
  return function() {
    var context = this, args = arguments;
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

const capitalizeFirstLetter = (string) => {
  if (typeof string !== 'string') return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const renderHTML = (htmlContent) => {
  return <div dangerouslySetInnerHTML={{__html: htmlContent}} />;
};

const buildUserURL = (freeze_url, user_id) => {
  return freeze_url.replace(/USERID/i, user_id);

};

const isUrl = (string) => {
  const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
  return regexp.test(string);
};

const safelyExecCallback = (fnParent, ...params) => {
  if (fnParent.callback && typeof fnParent.callback === 'function')
    fnParent.callback(...params);

};

const arrayToObject = (array) => {
  return array.reduce((obj, item) => {
    obj[Object.keys(item)[0]] = Object.values(item)[0];
    return obj
  }, {});
};

const priceFilterOptions = (data) => {
  const datarent = data['rent']['subcategory'];
  const datasell = data['sell']['subcategory'];
  return arrayToObject(datarent.concat(datasell).flat());
};

const sizeFilterOptions = (data) => {
  const datarent = data['building']['subcategory'];
  const datasell = data['land']['subcategory'];
  return arrayToObject(datarent.concat(datasell).flat());
};

const floorFilterOptions = (data) => {
  const datarent = data['building']['subcategory'];
  const datasell = data['land']['subcategory'];
  return arrayToObject(datarent.concat(datasell).flat());
};


export {debounce, capitalizeFirstLetter, renderHTML, buildUserURL, isUrl, safelyExecCallback, priceFilterOptions, sizeFilterOptions, floorFilterOptions};