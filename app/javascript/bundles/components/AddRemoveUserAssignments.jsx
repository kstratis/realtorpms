import React, { useState, useEffect, useRef } from 'react';
import useFetch from '../hooks/useFetch';
import useModalToggle from '../hooks/useModalToggle';
import makeAnimated from 'react-select/animated';
import { debounce, renderHTML } from '../utilities/helpers';
import AsyncSelect from 'react-select/async/dist/react-select.esm';
const animatedComponents = makeAnimated();

const selectStyles = {
  container: (base, state) => {
    return { ...base };
  },
  option: (base, state) => ({
    ...base,
    '&:hover': {
      cursor: 'pointer'
    }
  }),
  dropdownIndicator: (base, state) => ({
    ...base,
    '&:hover': {
      cursor: 'pointer'
    },
    transform: `${state.selectProps.menuIsOpen && 'rotate(180deg)'}`
  }),
  clearIndicator: (base, state) => ({
    ...base,
    '&:hover': {
      cursor: 'pointer'
    }
  }),
  input: (base, state) => ({
    ...base
    // flexBasis: '33.33%'
    // backgroundColor: 'red'
  }),
  singleValue: (base, state) => ({
    ...base,
    fontWeight: 700,
    backgroundColor: '#216AB0',
    color: '#FFFFFF',
    padding: '10px'
  })
};

function AddRemoveUserAssignments({ collection_endpoint, assignments_endpoint, storedOptions, query, i18n }) {
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
  const { data, loading, setData } = useFetch(assignmentRequest, didMountForAssignmentsRef);

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
    <AsyncSelect
      styles={selectStyles}
      // onChange={this.props.handleChange}
      onChange={handleChange}
      // onChange={''}
      // value={this.state.selectedOptions}
      value={data}
      // value={''}
      components={animatedComponents}
      autoload={false}
      cache={false}
      menuIsOpen={isOpen}
      isMulti={true}
      backspaceRemovesValue={false}
      placeholder={i18n.select.placeholder_users}
      noOptionsMessage={() => renderHTML(i18n.select.nooptions_async_html)}
      loadingMessage={() => renderHTML(i18n.select.loading_html)}
      // loadOptions={this.props.getOptions}
      loadOptions={loadAsyncOptionsDelayed}
      onMenuOpen={() => setIsOpen(true)}
      onMenuClose={() => setIsOpen(false)}
    />
  );
}

export default AddRemoveUserAssignments;
