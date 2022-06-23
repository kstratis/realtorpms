import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Select from 'react-select';
import { default as ASelect } from 'react-select/async';
import { default as ACSelect } from 'react-select/async-creatable';
import ReactOnRails from 'react-on-rails';
import { reactSelectStyles } from '../../styles/componentStyles';
import { debounce, renderHTML, safelyExecCallback } from '../../utilities/helpers';
import Rails from '@rails/ujs';
import bootbox from 'bootbox';

class FormSelect extends React.Component {
  static propTypes = {
    identity: PropTypes.string,
    formID: PropTypes.string,
    inputID: PropTypes.string,
    inputName: PropTypes.string,
    inputIsDisabled: PropTypes.bool,
    endpoint: PropTypes.string,
    create_new_entity_form: PropTypes.string,
    validatorGroup: PropTypes.string,
    isMulti: PropTypes.bool,
    isCreatable: PropTypes.bool,
    isMaster: PropTypes.bool,
    options: PropTypes.array,
    handleOptions: PropTypes.func,
    callback: PropTypes.any,
    isDisabled: PropTypes.bool,
    onRef: PropTypes.func,
    searchable: PropTypes.bool,
    renderFormField: PropTypes.bool,
    storedOption: PropTypes.any,
    placeholderText: PropTypes.string,
    accountFlavor: PropTypes.string,
    // soloMode guards against dynamically setting the dropdown options
    // and gettings a ref which is needed in DependantSelect
    soloMode: PropTypes.bool,
    ajaxEnabled: PropTypes.bool,
    i18n: PropTypes.shape({
      select: PropTypes.object,
      validatorErrMsg: PropTypes.string,
    }),
  };

  constructor(props) {
    super(props);
    this.setTextInputValue = this.setTextInputValue.bind(this);
    this.getOptions = this.getOptions.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updateExternalDOM = this.updateExternalDOM.bind(this);
    this.handleCreateOption = this.handleCreateOption.bind(this);
    this.handleNewClientForm = this.handleNewClientForm.bind(this);
    this.addFormListeners = this.addFormListeners.bind(this);
    this.removeFormListeners = this.removeFormListeners.bind(this);
    this.checkIfRequired = this.checkIfRequired.bind(this);
    this.handleAjaxRequestDelayed = debounce(this.handleAjaxRequest.bind(this), 300);
    axios.defaults.headers.common['X-CSRF-Token'] = ReactOnRails.authenticityToken();
  }

  // This stores a component reference so it can be used from the parent
  componentDidMount() {
    if (!this.props.soloMode) {
      this.props.onRef(this);
    }
    // Take care of the default value. Mind that you can't validate anything before the validation plugin sets up.
    // This is why on first render we don't validate anything. We basically defer until the validation plugin fully
    // loads on page load or the user clicks the form's submit button (which means that the plugin will have loaded by
    // then
    if (!this.props.renderFormField) return;
    this.state.selectedOption ? this.updateExternalDOM(this.state.selectedOption, false) : '';

    window.addEventListener("mapChange", this.checkIfRequired);
  }

  // Same as above but destroys the reference instead
  componentWillUnmount() {
    if (!this.props.soloMode) {
      this.props.onRef(undefined);
    }
    // console.log(this.state.validator);
    // window.form_stepper.destroy();
    // this.state.validator.destroy();
    window.removeEventListener("mapChange", this.checkIfRequired);
  }

  state = {
    selectedOption: this.props.storedOption || '',
    isOpen: false,
    isRequired: this.props.isRequired || false
  };

  onMenuOpen = () => this.setState({ isOpen: true });
  onMenuClose = () => this.setState({ isOpen: false });

  checkIfRequired(e) {
    // DEBUG
    // console.log(`checkIfRequired is running for: ${this.props.inputID}`);
    if (this.props.inputID !== 'property_marker'){
      this.setState({ isRequired: this.props.isRequired });
    } else {
      this.setState({ isRequired: e.detail });
    }
  }

  // This operates outside react and is used to store the value
  // at the true input field which is eventually used by the rails form
  setTextInputValue(value) {
    // DEBUG
    // console.log(`setting value: ${value}`);
    this.textInput.value = value;
  }

  // This is called from DependantSelect to clear the component's value
  clearSelection() {
    this.setState({ selectedOption: '' });
  }

  // react-select v2
  blurSelectComponent() {
    this.selectRef.blur();
  }

  blurAsyncComponent() {
    this.asyncRef.blur();
  }

  handleAjaxRequest(query, callback) {
    axios
      .get(`${this.props.endpoint}.json?search=${query}`) // +1 because rails will_paginate starts from 1 while this starts from 0
      .then(result => {
        // DEBUG
        // console.log(response.data.data.dataset);

        // +callback+ is react-select native function which is used to build the dropdown options. It is passed to
        // our registered function (handleAjaxRequest here) so that we can manipulate it and call it whenever we see fit
        callback(result.data.message);
      });
  }

  getOptions(input, callback) {
    if (!input) {
      return Promise.resolve({ options: [] });
    }
    this.handleAjaxRequestDelayed(input, callback);
  }

  // This updates the true input field (which is hidden) according to the value selected.
  // It uses JQuery and is relatively safe to use since it's located outside of our React Component
  updateExternalDOM(selectedOption, validate = true) {
    let payload = '';
    if (selectedOption) {
      payload = Array.isArray(selectedOption) ? JSON.stringify(selectedOption) : selectedOption.value;
    }

    // JQuery form validator specifics. Requires JQuery.
    // Manipulating a form element outside of this React component should be relatively safe
    // this.setTextInputValue(selectedOption ? selectedOption.value : '');
    this.setTextInputValue(payload);
    if (validate) {
      // DEBUG
      // console.log('select field changed - validating: ' +  this.props.inputID);
      window.form_stepper.validateField(this.props.inputID);
    }
  }

  // Imperative JQuery code for the new client inline form
  addFormListeners(target) {
    // Get new client form
    const $form = $('#new_client,#new_ilocation');
    // Attach js form validator
    let myparsley = $form.parsley();
    // Attach the button listener (we'll use it to ajax POST the new client)
    $form.find("button[type='submit']").on('click', e => {
      e.preventDefault();
      if (!myparsley.validate()) return;

      const endpoint = $form.attr('action');

      // Since we need to upload attachments (blob) we have to use
      // FormData and wrap our form. In any other case we'd simply do
      // const form_data = $form.serialize() and use `form_data`
      // instead.
      // Ref 1: https://stackoverflow.com/questions/58036713/rails-form-submission-by-ajax-with-an-active-storage-attachment
      // Ref 2: https://stackoverflow.com/questions/5392344/sending-multipart-formdata-with-jquery-ajax
      const formData = new FormData($form[0]);

      Rails.ajax({
        type: 'POST',
        data: formData,
        url: endpoint,
        dataType: 'json',
        success: response => {
          // DEBUG
          // console.log(response.message);

          // When all options are removed, `this.state.selectedOption` is `null` and
          // `...this.state.selectedOption` blows up. In this case we need to turn `null`
          // to an empty string first.
          const existingSelection = this.state.selectedOption ? this.state.selectedOption : '';
          this.setState(
            {
              selectedOption: Array.isArray(existingSelection)
                ? [...[existingSelection].flat(), { label: response.message.label, value: response.message.value }]
                : [{ label: response.message.label, value: response.message.value }],
            },
            () => {
              if (this.props.renderFormField) {
                this.updateExternalDOM(this.state.selectedOption);
              }
              $(target).modal('hide');
            }
          );
        },
      });
    });
  }

  // Imperative JQuery code to remove new inline client form listeners
  removeFormListeners() {
    // Fetch the new client form
    const $form = $('#new_client,#new_ilocation');
    if (!$form) return;

    // Detach js form validator on bootbox hide
    $form.parsley().destroy();
    // Detach button listeners on bootbox hide
    $form.find("button[type='submit']").off('click');
  }

  // This is called on every value change to update the current value and the "true" hidden input field.
  // If it is the parent dropdown that is change it will also call the handleOptions from DependantSelect
  // to update the childen's dropdown values accordingly
  handleChange(selectedOption) {
    // selectedOption is an object of type: {label: "Πώληση", value: "sell"}
    // Whenever locations are concerned, value is the id, and not the area_id.
    // check if we are dealing with dependant or solo select
    // DEBUG
    // console.log(selectedOption);
    if (!this.props.soloMode) {
      if (typeof this.props.handleOptions === 'function') {
        this.props.handleOptions(selectedOption, this.props.isMaster);
      }
    }
    this.setState({ selectedOption }, () => {
      safelyExecCallback(this.props, selectedOption);
      if (!this.props.renderFormField) return;
      this.updateExternalDOM(this.state.selectedOption);
    });
  }

  // Imperative JQuery code
  // Invoke bootbox with the new client form and handle it with JQuery
  handleNewClientForm(form, selectedOptions) {
    let modalForm = bootbox.dialog({
      message: form,
      size: 'large',
      title: this.props.i18n.modal_title,
      onShown: e => {
        this.addFormListeners(e.target);
      },
      onHide: e => {
        this.removeFormListeners();
      },
      show: true,
      onEscape: function () {
        modalForm.modal('hide');
      },
    });
  }

  handleCreateOption(newOption) {
    Rails.ajax({
      type: 'GET',
      url: `${this.props.create_new_entity_form}?name=${newOption}`,
      dataType: 'json',
      success: response => {
        const form = response.message;
        this.handleNewClientForm(form, newOption);
      },
    });
  }

  render() {
    const opts = {
      required: this.state.isRequired,
    };
    // This is needed for the menu open/close styles
    const { isOpen } = this.state;

    return (
      <div>
        {!this.props.ajaxEnabled ? (
          <Select
            id={this.props.identity}
            inputProps={{ 'data-name': this.props.name }}
            name={this.props.name}
            value={this.state.selectedOption}
            className={this.props.className}
            menuPortalTarget={document.body}
            styles={reactSelectStyles}
            onChange={this.handleChange}
            options={this.props.options}
            placeholder={this.props.placeholderText ? this.props.placeholderText : this.props.i18n.select.placeholder}
            isDisabled={this.props.isDisabled}
            isSearchable={this.props.isSearchable}
            isClearable={this.props.isClearable}
            isMulti={this.props.isMulti}
            noOptionsMessage={() => renderHTML(this.props.i18n.select.nooptions_sync_html)}
            menuIsOpen={isOpen}
            onMenuOpen={this.onMenuOpen}
            onMenuClose={this.onMenuClose}
            formatOptionLabel={data => {
              return <span dangerouslySetInnerHTML={{ __html: data.label }} />;
            }}
            ref={ref => {
              this.selectRef = ref;
            }}
          />
        ) : (
          <>
            {this.props.isCreatable ? (
              <ACSelect
                id={this.props.identity}
                inputProps={{ 'data-name': this.props.name }}
                styles={reactSelectStyles}
                name={this.props.name}
                value={this.state.selectedOption}
                className={this.props.className}
                loadOptions={this.getOptions}
                placeholder={
                  this.props.placeholderText ? this.props.placeholderText : this.props.i18n.select.placeholder
                }
                formatCreateLabel={inputValue =>
                  renderHTML(
                    `${
                      this.props.accountFlavor === 'international'
                        ? this.props.i18n.select.add_location + ' ' + inputValue
                        : this.props.i18n.select.add + ' ' + inputValue
                    }`
                  )
                }
                isDisabled={this.props.isDisabled}
                isSearchable={this.props.isSearchable}
                isClearable={this.props.isClearable}
                isMulti={this.props.isMulti}
                isCreatable={this.props.isCreatable}
                backspaceRemovesValue={true}
                noOptionsMessage={() => renderHTML(this.props.i18n.select.noresults)}
                loadingMessage={() => renderHTML(this.props.i18n.select.loading_html)}
                autoload={false}
                cache={false}
                menuIsOpen={isOpen}
                onMenuOpen={this.onMenuOpen}
                onMenuClose={this.onMenuClose}
                onChange={this.handleChange}
                onCreateOption={this.handleCreateOption}
                ref={ref => {
                  this.asyncRef = ref;
                }}
              />
            ) : (
              <ASelect
                id={this.props.identity}
                inputProps={{ 'data-name': this.props.name }}
                styles={reactSelectStyles}
                name={this.props.name}
                value={this.state.selectedOption}
                className={this.props.className}
                loadOptions={this.getOptions}
                placeholder={
                  this.props.placeholderText ? this.props.placeholderText : this.props.i18n.select.placeholder
                }
                isDisabled={this.props.isDisabled}
                isSearchable={this.props.isSearchable}
                isClearable={this.props.isClearable}
                isMulti={this.props.isMulti}
                isCreatable={this.props.isCreatable}
                backspaceRemovesValue={true}
                noOptionsMessage={() => renderHTML(this.props.i18n.select.noresults)}
                loadingMessage={() => renderHTML(this.props.i18n.select.loading_html)}
                autoload={false}
                cache={false}
                menuIsOpen={isOpen}
                onMenuOpen={this.onMenuOpen}
                onMenuClose={this.onMenuClose}
                onChange={this.handleChange}
                ref={ref => {
                  this.asyncRef = ref;
                }}
              />
            )}
          </>
        )}
        {this.props.renderFormField ? (
          <>
            <input
              id={this.props.inputID}
              name={this.props.inputName}
              className={`proxy-form-input ${this.props.inputClassName}`}
              disabled={this.props.inputIsDisabled || false}
              data-parsley-group={this.props.validatorGroup}
              data-parsley-required-message={this.props.i18n.validatorErrMsg}
              ref={input => {
                this.textInput = input;
              }}
              {...opts}
            />
            <small className="form-text text-muted">{this.props.feedback}</small>
            <div className="invalid-feedback" />
          </>
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default FormSelect;
