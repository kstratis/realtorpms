// filters_controller.js
import { Controller } from 'stimulus';
import Rails from '@rails/ujs';
import URLSearchParams from '@ungap/url-search-params';

export default class extends Controller {
  static targets = ['filter', 'count', 'multiFilter'];

  connect() {
    // Initialize bootstrap-select
    $('#businesstype, #category').selectpicker();
    const params = new URLSearchParams(window.location.search);

    // Sets the counter visibility
    this.setResultCounterVisibility(params)

    // Initialize the bootstrap-select multiselect with pre-selections from url
    $('#location').selectpicker('val', params.getAll('location[]'));
  }

  setResultCounterVisibility(params) {
    if (params.toString().length){
      $('#results-count-container').removeClass('d-none');
      $('#clear-form').attr('disabled', false);
    } else {
      $('#results-count-container').addClass('d-none');
      $('#clear-form').attr('disabled', true);
    }
  }

  setCount() {
    const url = `/results-count?${this.params}`;
    this.fetchCount(url);
  }

  fetchCount(url) {
    Rails.ajax({
      type: 'GET',
      url: url,
      dataType: 'json',
      success: response => {
        this.countTarget.innerHTML = response.message;
        // Make sure the counter tag is always visible when the count changes
        this.setResultCounterVisibility(this.params);
      },
    });
  }

  navigate(url){
    Turbolinks.clearCache();
    Turbolinks.visit(url);
  }

  clear(){
    this.navigate(window.location.pathname);
  }

  filter() {
    const url = `${window.location.pathname}?${this.params}`;
    this.navigate(url)
  }

  get params() {
    // Single select values. i.e. ?category=residential
    const searchString = this.filterTargets
      .map(t => {
        if (t.value.length) {
          return `${t.name}=${t.value}`;
        }
      })
      .join('&');

    // Initialize URLSearchParams
    const params = new URLSearchParams(searchString);

    // We have to have to handle multiselect values slightly different
    // i.e. ?category=residential&location%5B%5D=163&location%5B%5D=183
    const locationValues = $('#location').val()
    locationValues.forEach((locationValue) => {
      // Append to URLSearchParams
      params.append('location[]', locationValue)
    });

    return params.toString();
  }
}
