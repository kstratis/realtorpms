import React, { useState, useRef } from 'react';
import Dropdown from './Dropdown';
import Textfield from './Textfield';
import Checkbox from './Checkbox';
import PropTypes from 'prop-types';

const components = {
  dropdown: Dropdown,
  text_field: Textfield,
  check_box: Checkbox
};

const FormComponents = props => {
  const FormElement = components[Object.values(props.cfield)[0]['field_type']];
  return <FormElement cfield={props.cfield}
                      storedSelection={props.storedSelection}
                      i18n={props.i18n}
                      handleCfieldDropdown={props.handleCfieldDropdown}
                      handleCfieldTextfield={props.handleCfieldTextfield}
                      handleCfieldCheckbox={props.handleCfieldCheckbox}/>
};

FormComponents.propTypes = {
  cfield: PropTypes.object.isRequired,
  storedSelection: PropTypes.object,
  i18n: PropTypes.object.isRequired,
  handleCfieldDropdown: PropTypes.func.isRequired,
  handleCfieldTextfield: PropTypes.func.isRequired,
  handleCfieldCheckbox: PropTypes.func.isRequired,
};

export default FormComponents;
