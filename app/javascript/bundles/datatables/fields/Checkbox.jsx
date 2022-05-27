import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Checkbox = props => {
  const { slug, name } = Object.values(props.cfield)[0];
  const [isChecked, setIsChecked] = useState(() => (props.storedSelection ? props.storedSelection[slug] : ''));

  const handleChange = e => {
    setIsChecked(e.target.checked);
    props.handleCfieldCheckbox(e.target.checked, slug);
  };

  return (
    <div className={'mb-3'}>
      <div className="form-group mb-4">
        <div className="custom-control custom-checkbox app-checkbox custom-field-checkbox">
          <input
            id={slug}
            type="checkbox"
            name={slug}
            className="custom-control-input"
            checked={!!isChecked}
            onChange={handleChange}
          />
          <label htmlFor={slug} className={'custom-control-label'}>
            <strong>{name}</strong>
          </label>
        </div>
      </div>
    </div>
  );
};

Checkbox.propTypes = {
  cfield: PropTypes.object.isRequired,
  storedSelection: PropTypes.object,
  i18n: PropTypes.object.isRequired,
  handleCfieldDropdown: PropTypes.func.isRequired,
  handleCfieldTextfield: PropTypes.func.isRequired,
  handleCfieldCheckbox: PropTypes.func.isRequired
};

export default Checkbox;
