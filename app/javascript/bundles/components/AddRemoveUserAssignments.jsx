import React, { useState, useEffect, useRef } from 'react';
import useFetch from '../hooks/useFetch';
import useModalSwitch from '../hooks/useModalSwitch';

import makeAnimated from 'react-select/animated';
import { debounce, renderHTML } from '../utilities/helpers';

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

const colourOptions = [
  { value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true },
  { value: 'blue', label: 'Blue', color: '#0052CC', isDisabled: true },
  { value: 'purple', label: 'Purple', color: '#5243AA' },
  { value: 'red', label: 'Red', color: '#FF5630', isFixed: true },
  { value: 'orange', label: 'Orange', color: '#FF8B00' },
  { value: 'yellow', label: 'Yellow', color: '#FFC400' },
  { value: 'green', label: 'Green', color: '#36B37E' },
  { value: 'forest', label: 'Forest', color: '#00875A' },
  { value: 'slate', label: 'Slate', color: '#253858' },
  { value: 'silver', label: 'Silver', color: '#666666' }
];

const filterColors = inputValue => {
  let res = colourOptions.filter(i => i.label.toLowerCase().includes(inputValue.toLowerCase()));
  return res;
};

function AddRemoveUserAssignments({ modalHeader, avatar, favlists_url, favorites_url, property_id, i18n }) {
  const [request, setRequest] = useState({
    url: `${this.props.collection_endpoint}.json?search=${query}&dropdown=1`,
    method: 'get',
    payload: {}
  });



  const { isOpen, setIsOpen } = useModalSwitch();
  const { data, loading, setData } = useFetch(request);

 render(

 )

}

export default AddRemoveUserAssignments;