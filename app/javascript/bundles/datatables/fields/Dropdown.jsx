import React, { useState } from 'react';
import { reactSelectStyles } from '../../styles/componentStyles';
import Select from 'react-select';
import PropTypes from 'prop-types';

const Dropdown = props => {
  const { slug, name, options } = Object.values(props.cfield)[0];
  const [isOpen, setIsOpen] = useState(false);
  const [selection, setSelection] = useState(() =>
    props.storedSelection ? { value: props.storedSelection[slug], label: props.storedSelection[slug] } : []
  );
  const onMenuOpen = () => setIsOpen(true);
  const onMenuClose = () => setIsOpen(false);

  const select_options = options
    .split(/[\s,.;:"']/)
    .filter(Boolean)
    .map(option => {
      return { label: option, value: option };
    });

  const handleChange = selection => {
    setSelection(selection);
    props.handleCfieldDropdown(selection, slug);
  };

  return (
    <div className={'col-12 mb-3'}>
      <Select
        id={slug}
        name={name}
        value={selection}
        styles={reactSelectStyles}
        onChange={handleChange}
        options={select_options}
        placeholder={props.i18n.select_prompt}
        isDisabled={false}
        isSearchable={false}
        isClearable={true}
        menuIsOpen={isOpen}
        onMenuOpen={onMenuOpen}
        onMenuClose={onMenuClose}
      />
    </div>
  );
};

Dropdown.propTypes = {
  cfield: PropTypes.object.isRequired,
  storedSelection: PropTypes.object,
  i18n: PropTypes.object.isRequired,
  handleCfieldDropdown: PropTypes.func.isRequired,
  handleCfieldTextfield: PropTypes.func.isRequired,
  handleCfieldCheckbox: PropTypes.func.isRequired,
};

export default Dropdown;
