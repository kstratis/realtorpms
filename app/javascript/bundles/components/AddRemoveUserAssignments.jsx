import React, { useState, useEffect, useRef } from 'react';
import useFetch from '../hooks/useFetch';
import useModalToggle from '../hooks/useModalToggle';
import makeAnimated from 'react-select/animated';
import { debounce, renderHTML } from '../utilities/helpers';
import AsyncSelect from 'react-select/async/dist/react-select.esm';
import { reactSelectStyles } from '../styles/componentStyles';
const animatedComponents = makeAnimated();

function AddRemoveUserAssignments({ collection_endpoint, assignments_endpoint, storedOptions, i18n }) {
  // custom hook to open/close modal
  const { isOpen, setIsOpen } = useModalToggle();
  // this is the request for the pool of options - won't run on moount
  const [request, setRequest] = useState({});
  // this is the request for the assignments - won't run on mount
  const [assignmentRequest, setAssignmentRequest] = useState({});

  // We don't need to fetch or post anything upon the initial render.
  // So we use this: https://stackoverflow.com/a/53180013/178728
  // TODO: refactor as a reusable hook
  const didMountForOptionsRef = useRef(false);
  const didMountForAssignmentsRef = useRef(false);

  // We don't need the return value of this particular useFetch { data, loading, setData } due to the way
  // react-select loads its list of options. https://react-select.com/async#loading-asynchronously.
  // The trick is to pass over react-select's native option loading callback instead.
  useFetch(request, didMountForOptionsRef);

  // This takes care of properly setting up the assignment requests
  const { data, setData } = useFetch(assignmentRequest, didMountForAssignmentsRef);

  useEffect(() => {
    setData(storedOptions);
  }, []);

  // selectedOptions on each render contains ALL the selected values (previous & current) concatenated.
  const handleChange = selectedOptions => {
    setAssignmentRequest({
      url: assignments_endpoint,
      method: 'post',
      payload: { selection: selectedOptions || [] },
      callback: ''
    });
  };

  // `callback` is a react-select native function which is used to build the dropdown options. It is passed over to
  // our useFetch custom hook so that we can manipulate it and call it whenever we see fit.
  const loadAsyncOptions = (query, callback) => {
    if (!query) {
      return Promise.resolve({ options: [] });
    }
    setRequest({
      url: `${collection_endpoint}.json?search=${query}&dropdown=1`,
      method: 'get',
      payload: {},
      callback: callback
    });
  };

  // On fast key presses, bounce back the multiple requests
  const loadAsyncOptionsDelayed = debounce(loadAsyncOptions, 300);

  return (
    /**
     * @param i18 Main translations object
     * @param i18.select Main translations for the react-select component
     * @param i18.select.placeholder_users translations for empty users placeholder
     * @param i18.select.nooptions_async_html
     * @param i18.select.loading_html
     */
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
      placeholder={i18n.select.placeholder_users}
      noOptionsMessage={() => renderHTML(i18n.select.nooptions_async_html)}
      loadingMessage={() => renderHTML(i18n.select.loading_html)}
      loadOptions={loadAsyncOptionsDelayed}
      onMenuOpen={() => setIsOpen(true)}
      onMenuClose={() => setIsOpen(false)}
    />
  );
}

export default AddRemoveUserAssignments;
