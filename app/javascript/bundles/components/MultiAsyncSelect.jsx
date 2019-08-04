import React, { useState, useEffect, useRef } from 'react';
import useFetch from '../hooks/useFetch';
import useModalToggle from '../hooks/useModalToggle';
import makeAnimated from 'react-select/animated';
import { debounce, renderHTML, safelyExecCallback } from '../utilities/helpers';
import AsyncSelect from 'react-select/async';
import { reactSelectStyles } from '../styles/componentStyles';
import PropTypes from 'prop-types';
const animatedComponents = makeAnimated();

MultiAsyncSelect.propTypes = {
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
  i18n: PropTypes.shape({
    select: PropTypes.shape({
      placeholder: PropTypes.string.isRequired,
      noresults: PropTypes.string.isRequired,
      loading: PropTypes.string.isRequired,
      feedback: PropTypes.string.isRequired
    })
  }).isRequired
};

function MultiAsyncSelect({ collection_endpoint, action_endpoint, storedOptions, hasFeedback, i18n }) {
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
    if (!action_endpoint.action && !selectedOptions) {
      safelyExecCallback(action_endpoint, selectedOptions);
      return;
    }
    setSelectionRequest({
      url: action_endpoint.url,
      method: action_endpoint.action,
      payload: { selection: selectedOptions || [] },
      callback: () => action_endpoint.callback(selectedOptions) || ''
    });
  };

  // `callback` is a react-select native function which is used to build the dropdown options. It is passed over to
  // our useFetch custom hook so that we can manipulate it and call it whenever we see fit.
  const loadAsyncOptions = (query, callback) => {
    if (!query) {
      return Promise.resolve({ options: [] });
    }
    setRequest({
      url: `${collection_endpoint.url}.json?search=${query}&dropdown=1`,
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
      <AsyncSelect
        styles={reactSelectStyles}
        onChange={handleChange}
        value={data}
        components={animatedComponents}
        autoload={false}
        cache={false}
        menuIsOpen={isOpen}
        isMulti={true}
        backspaceRemovesValue={false}
        placeholder={i18n.select.placeholder}
        noOptionsMessage={() => renderHTML(i18n.select.noresults)}
        loadingMessage={() => renderHTML(i18n.select.loading)}
        loadOptions={loadAsyncOptionsDelayed}
        onMenuOpen={() => setIsOpen(true)}
        onMenuClose={() => setIsOpen(false)}
      />
      {hasFeedback ? <small className="form-text text-muted">{i18n.select.feedback}</small> : ''}
    </>
  );
}

export default MultiAsyncSelect;
