import React, { useState, useEffect, useRef } from 'react';
import useFetch from '../hooks/useFetch';
import useModalToggle from '../hooks/useModalToggle';
import makeAnimated from 'react-select/animated';
import { debounce, renderHTML, safelyExecCallback } from '../utilities/helpers';
import Select from 'react-select';
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

function PlainSelect({ collection_endpoint, action_endpoint, storedOptions, hasFeedback, i18n }) {

  return (
    <>
      <Select
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

export default PlainSelect;
