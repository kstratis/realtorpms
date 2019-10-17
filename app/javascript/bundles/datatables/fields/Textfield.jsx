import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Textfield = (props) => {
  const { slug, name } = Object.values(props.cfield)[0];
  const [selection, setSelection] = useState(() =>
    props.storedSelection ? props.storedSelection[slug] : ''
  );

  const handleChange = (e) => {
    setSelection(e.target.value);
    props.handleCfieldTextfield(e.target.value, slug);
  };

  return (
    <div className={'mb-3'}>
      <label htmlFor={name}><strong>{name}:</strong></label>
      <input
        type="text"
        className="input form-control"
        value={selection}
        onChange={handleChange}
        placeholder={props.i18n.text_prompt}
      />
    </div>
  );
};

Textfield.propTypes = {
  cfield: PropTypes.object.isRequired,
  storedSelection: PropTypes.object,
  i18n: PropTypes.object.isRequired,
  handleCfieldDropdown: PropTypes.func.isRequired,
  handleCfieldTextfield: PropTypes.func.isRequired,
  handleCfieldCheckbox: PropTypes.func.isRequired,
};

export default Textfield;
