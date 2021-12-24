import React, { useState, useEffect, useRef } from 'react';
import useFetch from '../../hooks/useFetch';
import useModalToggle from '../../hooks/useModalToggle';
import makeAnimated from 'react-select/animated';
import { debounce, renderHTML, safelyExecCallback } from '../../utilities/helpers';
import { default as ASelect } from 'react-select/async';
import { default as ACSelect } from 'react-select/async-creatable';
import { components } from 'react-select';
import AsyncPaginate from 'react-select-async-paginate';
import { reactSelectStyles } from '../../styles/componentStyles';
import PropTypes from 'prop-types';
import URLSearchParams from '@ungap/url-search-params';
import bootbox from 'bootbox';
import Rails from '@rails/ujs';

const animatedComponents = makeAnimated();

AsyncSelect.propTypes = {
  collection_endpoint: PropTypes.shape({
    url: PropTypes.string.isRequired,
    action: PropTypes.string.isRequired,
  }).isRequired,
  action_endpoint: PropTypes.shape({
    url: PropTypes.string.isRequired,
    action: PropTypes.string.isRequired,
    callback: PropTypes.func,
  }).isRequired,
  storedOptions: PropTypes.array,
  hasFeedback: PropTypes.bool,
  isCreatable: PropTypes.bool,
  isClearable: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isNotAnimated: PropTypes.bool,
  isMultiple: PropTypes.bool,
  i18n: PropTypes.shape({
    select: PropTypes.shape({
      placeholder: PropTypes.string.isRequired,
      noresults: PropTypes.string.isRequired,
      loading: PropTypes.string.isRequired,
      feedback: PropTypes.string
    }),
  }).isRequired,
};

// Normalizes and merges url GET params coming both from javascript and/or backend
const constructURL = (origUrl, query) => {
  // DEBUG
  // console.log(origUrl);
  // console.log(query);
  const url = new URL(origUrl);
  let searchParams = new URLSearchParams(url.search || '');
  url.search = '';
  searchParams.set('search', query);
  searchParams.set('dropdown', '1');
  return `${url.toString()}.json?${searchParams.toString()}`;
};

function AsyncSelect({
  collection_endpoint,
  action_endpoint,
  new_client_endpoint,
  storedOptions,
  hasFeedback,
  isCreatable,
  isClearable,
  isDisabled,
  openMenuOnClick,
  isNotAnimated,
  isMultiple,
  closeMenuOnSelect,
  defaultOptions,
  i18n,
}) {
  // custom hook to open/close modal
  const { isOpen, setIsOpen } = useModalToggle();
  // this is the request for the pool of options - won't run on mount
  const [request, setRequest] = useState({});
  // this is the request for the assignments - won't run on mount
  const [selectionRequest, setSelectionRequest] = useState({});

  // We don't need to fetch or post anything upon the initial render.
  // So we use this trick: https://stackoverflow.com/a/53180013/178728
  // TODO: refactor as a reusable hook
  const didMountForOptionsRef = useRef(false);
  const didMountForAssignmentsRef = useRef(false);

  // This loads the options list.
  // We don't need the return value of this particular useFetch { data, loading, setData } due to the way
  // react-select loads its list of options. https://react-select.com/async#loading-asynchronously.
  // The trick is to pass over react-select's native option-loading callback instead (shim it in the request object).
  useFetch(request, true, didMountForOptionsRef);

  // This loads the selection list.
  // This takes care of properly setting up the assignment requests
  // In this case we do need internal state
  const { data, setData } = useFetch(selectionRequest, false, didMountForAssignmentsRef);

  // Only on mount load the existing data
  useEffect(() => {
    setData(storedOptions);
  }, []);

  // selectedOptions on each render contains ALL the selected values (previous & current) concatenated.
  const handleChange = selectedOptions => {
    // GET requests (or non specified) are simply for searching and thus we skip XHR cause we handle it directly in the HOC
    if (!action_endpoint.action) {
      if (selectedOptions && selectedOptions.__isNew__) {
        Rails.ajax({
          type: 'GET',
          url: `${new_client_endpoint}?name=${selectedOptions['label']}`,
          dataType: 'json',
          success: response => {
            const form = response.message;
            handleNewClientForm(form, selectedOptions);
          },
        });
      }
      else {
        safelyExecCallback(action_endpoint, selectedOptions || {});
        setData(selectedOptions);
      }
      return;
    }
    setSelectionRequest({
      url: action_endpoint.url,
      method: action_endpoint.action,
      payload: { selection: selectedOptions || [] },
      callback: action_endpoint.callback,
    });
  };

  // Imperative JQuery code for the new client inline form
  const addFormListeners = (target) => {
    // Get new client form
    const $new_client_form = $('#new_client');
    // Attach js form validator
    let myparsley = $new_client_form.parsley();
    // Attach the button listener (we'll use it to ajax POST the new client)
    $new_client_form.find("button[type='submit']").on('click', (e) => {
      e.preventDefault();
      if (!myparsley.validate()) return;

      const endpoint = $new_client_form.attr('action');

      // Since we need to upload attachments (blob) we have to use
      // FormData and wrap our form. In any other case we'd simply do
      // const form_data = $new_client_form.serialize() and use `form_data`
      // instead.
      // Ref 1: https://stackoverflow.com/questions/58036713/rails-form-submission-by-ajax-with-an-active-storage-attachment
      // Ref 2: https://stackoverflow.com/questions/5392344/sending-multipart-formdata-with-jquery-ajax
      const formData = new FormData($new_client_form[0])

      Rails.ajax({
        type: 'POST',
        data: formData,
        url: endpoint,
        dataType: 'json',
        success: response => {
          // DEBUG
          // console.log(response.message);
          // Once the response is back, use it to set the visible value
          // in react-select (`setData`) and also update the ajax action
          // handler (`safelyExecCallback` - StoreClientSearch.jsx)
          safelyExecCallback(action_endpoint, response.message || {});
          setData(response.message);
          $(target).modal('hide');
        },
      });
    });
  };

  // Imperative JQuery code to remove new inline client form listeners
  const removeFormListeners = () => {
    // Fetch the new client form
    const $new_client_form = $('#new_client');
    if (!$new_client_form) return;

    // Detach js form validator on bootbox hide
    $new_client_form.parsley().destroy();
    // Detach button listeners on bootbox hide
    $new_client_form.find("button[type='submit']").off('click');
  };

  // Imperative JQuery code
  // Invoke bootbox with the new client form and handle it with JQuery
  const handleNewClientForm = (form, selectedOptions) => {
    const name = selectedOptions['label']
    let modalForm = bootbox.dialog({
      message: form,
      size: 'large',
      title: i18n.select.nested_client_add.modal_title,
      onShown: (e) => {
        addFormListeners(e.target);
      },
      onHide: (e) => {
        removeFormListeners();
      },
      show: true,
      onEscape: function () {
        modalForm.modal('hide');
      },
    });
  }

  // `callback` is a react-select native function which is used to  build the dropdown options. It is passed over to
  // our useFetch custom hook so that we can manipulate it and call it whenever we see fit.
  const loadAsyncOptions = (query, callback) => {
    if (!query) {
      return Promise.resolve({ options: [] });
    }
    setRequest({
      url: constructURL(collection_endpoint.url, query),
      method: collection_endpoint.action,
      payload: {},
      callback: callback,
    });
  };

  // Debounce key presses
  const loadAsyncOptionsDelayed = debounce(loadAsyncOptions, 300);

  return (
    /**
     * @param i18 Main translations object
     * @param i18.select
     * @param i18.select.placeholder
     * @param i18.select.noresults
     * @param i18.select.loading
     * @param i18.select.feedback
     */
    <>
      {isCreatable ? (
        <ACSelect
          styles={reactSelectStyles}
          onChange={handleChange}
          value={data}
          components={isNotAnimated === true ? '' : animatedComponents}
          autoload={false}
          cache={false}
          openMenuOnClick={!!openMenuOnClick}
          menuIsOpen={isOpen}
          isClearable={isClearable}
          isDisabled={isDisabled}
          isMulti={isMultiple == null ? false : isMultiple}
          backspaceRemovesValue={false}
          placeholder={i18n.select.placeholder}
          formatCreateLabel={inputValue => renderHTML(`${i18n.select.add} "${inputValue}"`)}
          noOptionsMessage={() => renderHTML(i18n.select.noresults)}
          loadingMessage={() => renderHTML(i18n.select.loading)}
          loadOptions={loadAsyncOptionsDelayed}
          onMenuOpen={() => setIsOpen(true)}
          onMenuClose={() => setIsOpen(false)}
          closeMenuOnSelect={closeMenuOnSelect}
          defaultOptions={defaultOptions}
        />
      ) : (
        <ASelect
          styles={reactSelectStyles}
          onChange={handleChange}
          value={data}
          components={isNotAnimated === true ? '' : animatedComponents}
          autoload={false}
          cache={false}
          cacheOptions={false}
          openMenuOnClick={!!openMenuOnClick}
          menuIsOpen={isOpen}
          isClearable={isClearable}
          isDisabled={isDisabled}
          isMulti={isMultiple == null ? true : isMultiple}
          backspaceRemovesValue={false}
          placeholder={i18n.select.placeholder}
          noOptionsMessage={() => renderHTML(i18n.select.noresults)}
          loadingMessage={() => renderHTML(i18n.select.loading)}
          loadOptions={loadAsyncOptionsDelayed}
          onMenuOpen={() => setIsOpen(true)}
          onMenuClose={() => setIsOpen(false)}
          closeMenuOnSelect={closeMenuOnSelect}
          defaultOptions={defaultOptions}
        />
      )}
      {hasFeedback ? <small className="form-text text-muted">{i18n.select.feedback}</small> : ''}
    </>
  );
}

export default AsyncSelect;
