import React, { useState, useEffect, useRef } from 'react';
import useModalToggle from '../../hooks/useModalToggle';
import makeAnimated from 'react-select/animated';
import { renderHTML, safelyExecCallback } from '../../utilities/helpers';
import Select from 'react-select';
import { reactSelectStyles } from '../../styles/componentStyles';
import PropTypes from 'prop-types';
const animatedComponents = makeAnimated();

RangeSelect.propTypes = {
  // collection_endpoint: PropTypes.shape({
  //   url: PropTypes.string.isRequired,
  //   action: PropTypes.string.isRequired
  // }).isRequired,
  // action_endpoint: PropTypes.shape({
  //   url: PropTypes.string.isRequired,
  //   action: PropTypes.string.isRequired,
  //   callback: PropTypes.func
  // }).isRequired,
  // storedOptions: PropTypes.array,
  // hasFeedback: PropTypes.bool,
  // i18n: PropTypes.shape({
  //   select: PropTypes.shape({
  //     placeholder: PropTypes.string.isRequired,
  //     noresults: PropTypes.string.isRequired,
  //     loading: PropTypes.string.isRequired,
  //     feedback: PropTypes.string.isRequired
  //   })
  // }).isRequired
};

function RangeSelect() {
  // custom hook to open/close modal
  const { isOpen, setIsOpen } = useModalToggle();

  const handleChange = selectedOptions => {
  };

  // `callback` is a react-select native function which is used to build the dropdown options. It is passed over to
  // our useFetch custom hook so that we can manipulate it and call it whenever we see fit.
  const loadAsyncOptions = (query, callback) => {
  };

  return (
    /**
     * @param i18 Main translations object
     * @param i18.select
     * @param i18.select.placeholder
     * @param i18.select.noresults
     * @param i18.select.loading
     * @param i18.select.feedback
     */
      <div className="form-row">
        <div className="form-group col">
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
          {/*<input type="number" className="form-control" id="priceFrom" placeholder={i18n.priceFrom} min={0}/>*/}
        </div>
        <div className="form-group col">
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
          {/*<input type="number" className="form-control" id="priceTo" placeholder={i18n.priceTo} min={0}/>*/}
        </div>
      </div>


  );
}

export default RangeSelect;
