// filters_controller.js
import { Controller } from '@hotwired/stimulus';
import Rails from '@rails/ujs';
import URLSearchParams from '@ungap/url-search-params';

export default class extends Controller {
  static targets = ['filter', 'count', 'multiFilter'];
  static values = { url: String, location: String }

  connect() {
    // Initialize bootstrap-select
    $('#businesstype, #category').selectpicker();
    const params = new URLSearchParams(window.location.search);

    // Sets the counter visibility
    this.setResultCounterVisibility(params)

    // Initialize the bootstrap-select multiselect with pre-selections from url
    $('#location').selectpicker('val', params.getAll(this.locationParamLabel));
  }

  setResultCounterVisibility(params) {
    if (this._counterVisibilityConditions(params)){
      $('#results-count-container').removeClass('d-none');
      $('#clear-form').attr('disabled', false);
    }
    else {
      $('#results-count-container').addClass('d-none');
      $('#clear-form').attr('disabled', true);
    }
  }

  setCount() {
    const url = `${this.urlValue}?${this.params}`;
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
    const url = this.params === ''
      ? `${window.location.pathname}?search=all`
      : `${window.location.pathname}?${this.params}`
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
      params.append(this.locationParamLabel, locationValue)
    });

    return params.toString();
  }

  get locationParamLabel() {
    return this.locationValue === 'greek' ? 'location[]' : 'ilocation[]'
  }

  // Show the results counter if
  // (1) The ajax request has filter parameters
  // (2) The ajax request has no filter parameters but the existing
  //     address bar contains `?search=all`.
  _counterVisibilityConditions(params){
    return params.toString().length ||
      ((params.toString() === '') && window.location.search)
  }
}
