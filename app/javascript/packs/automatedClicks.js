import URLSearchParams from '@ungap/url-search-params';

const availableActions = ['assignments', 'showings'];

$(document).on('turbolinks:load', function(e){
  if ($('#automatedClicks').length) {
    let searchParams = new URLSearchParams(window.location.search);
    let action = searchParams.get('autoclick');
    if (availableActions.includes(action)) $(`#${action}`).click();
  }
});