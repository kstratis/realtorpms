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

export {debounce, capitalizeFirstLetter, renderHTML};