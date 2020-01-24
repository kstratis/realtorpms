import React, { useState, useEffect, useRef } from 'react';
import useFetch from '../../hooks/useFetch';
import useModalToggle from '../../hooks/useModalToggle';
import makeAnimated from 'react-select/animated';
import { debounce, renderHTML, safelyExecCallback } from '../../utilities/helpers';
import { default as ASelect } from 'react-select/async';
import { default as ACSelect } from 'react-select/async-creatable';
import AsyncPaginate from 'react-select-async-paginate';
import { reactSelectStyles } from '../../styles/componentStyles';
import PropTypes from 'prop-types';
import URLSearchParams from '@ungap/url-search-params';
const animatedComponents = makeAnimated();

AsyncSelect.propTypes = {
  collection_endpoint: PropTypes.shape({
    url: PropTypes.string.isRequired,
    action: PropTypes.string.isRequired
  }).isRequired,
  action_endpoint: PropTypes.shape({
    url: PropTypes.string.isRequired,
    action: PropTypes.string.isRequired,
    callback: PropTypes.func
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
      feedback: PropTypes.string.isRequired
    })
  }).isRequired
};

// Normalizes and merges url GET params coming both from javascript and/or backend
const constructURL = (origUrl, query) => {
  console.log(origUrl);
  console.log(query);
  const url = new URL(origUrl);
  let searchParams = new URLSearchParams(url.search || '');
  url.search = '';
  searchParams.set('search', query);
  searchParams.set('dropdown', '1');
  return `${url.toString()}.json?${searchParams.toString()}`;
};

function AsyncSelect({ collection_endpoint, action_endpoint, storedOptions, hasFeedback, isCreatable, isClearable, isDisabled, openMenuOnClick, isNotAnimated, isMultiple, i18n }) {
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

  const [inputValue, setInputValue] = useState('');

  // Only on mount load the existing data
  useEffect(() => {
    setData(storedOptions);
  }, []);

  // selectedOptions on each render contains ALL the selected values (previous & current) concatenated.
  const handleChange = selectedOptions => {
    // GET requests (or non specified) are simply for searching and thus we skip XHR cause we handle it directly in the HOC
    if (!action_endpoint.action) {
      safelyExecCallback(action_endpoint, selectedOptions);
      setData(selectedOptions);
      return;
    }
    setSelectionRequest({
      url: action_endpoint.url,
      method: action_endpoint.action,
      payload: { selection: selectedOptions || [] },
      callback: action_endpoint.callback
    });
  };

  const onInputChange = (query, {action}) => {
    console.log(action);
    // if (query) {
    //   setInputValue(query);
    // }
    // return inputValue;
    if (action !== "set-value") {
    // if (action.action !== "input-blur" && action.action !== "menu-close") {
        setInputValue(query);
        return query;

    }
    return inputValue;
  };

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
      callback: callback
    });
  };

  // On fast key presses, bounce back the multiple requests
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
          formatCreateLabel={(inputValue) => renderHTML(`${i18n.select.add} "${inputValue}"`)}
          noOptionsMessage={() => renderHTML(i18n.select.noresults)}
          loadingMessage={() => renderHTML(i18n.select.loading)}
          loadOptions={loadAsyncOptionsDelayed}
          onMenuOpen={() => setIsOpen(true)}
          onMenuClose={() => setIsOpen(false)}
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
          isMulti={isMultiple == null ? true : isMultiple}
          backspaceRemovesValue={false}
          placeholder={i18n.select.placeholder}
          noOptionsMessage={() => renderHTML(i18n.select.noresults)}
          loadingMessage={() => renderHTML(i18n.select.loading)}
          loadOptions={loadAsyncOptionsDelayed}
          onMenuOpen={() => setIsOpen(true)}
          onMenuClose={() => setIsOpen(false)}
          onInputChange={onInputChange}
          inputValue={inputValue}
          // defaultOptions={[{label: 'Hello', value: 1}, {label: 'world', value: 2}]}
          closeMenuOnSelect={false}
        />
      )}
      {hasFeedback ? <small className="form-text text-muted">{i18n.select.feedback}</small> : ''}
    </>
  );
}

export default AsyncSelect;
