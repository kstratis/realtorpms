import React, { useState, useEffect, useRef } from 'react';
import useModalToggle from '../../hooks/useModalToggle';
import makeAnimated from 'react-select/animated';
import { renderHTML, safelyExecCallback } from '../../utilities/helpers';
import {default as PSelect} from 'react-select';
import { reactSelectStyles } from '../../styles/componentStyles';
import PropTypes from 'prop-types';
const animatedComponents = makeAnimated();

PlainSelect.propTypes = {

};

function PlainSelect({ options, action_endpoint, storedOptions, hasFeedback, i18n }) {

  const { isOpen, setIsOpen } = useModalToggle();

  const handleChange = selectedOptions => {
    console.log(selectedOptions);
  };


  return (
    <>
      <PSelect
        styles={reactSelectStyles}
        onChange={handleChange}
        components={animatedComponents}
        autoload={false}
        cache={false}
        menuIsOpen={isOpen}
        isMulti={false}
        backspaceRemovesValue={false}
        placeholder={i18n.select.placeholder_plain}
        noOptionsMessage={() => renderHTML(i18n.select.noresults)}
        options={options}
        onMenuOpen={() => setIsOpen(true)}
        onMenuClose={() => setIsOpen(false)}
      />
    </>
  );
}

export default PlainSelect;
