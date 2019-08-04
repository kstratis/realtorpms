import React from 'react';

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

const safelyExecCallback = (fnParent, params) => {
  if (fnParent.callback && typeof fnParent.callback === 'function')
    fnParent.callback(params);

};


export {debounce, capitalizeFirstLetter, renderHTML, buildUserURL, isUrl, safelyExecCallback};