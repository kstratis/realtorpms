import React from 'react';
import PropTypes from 'prop-types';
import FormSelect from './FormSelect';
import URLSearchParams from '@ungap/url-search-params';

class AssociativeFormSelect extends React.Component {
  static propTypes = {
    formdata: PropTypes.shape({
      formid: PropTypes.string,
      categoryid: PropTypes.string,
      categoryname: PropTypes.string,
      subcategoryid: PropTypes.string,
      subcategoryname: PropTypes.string
    }),

    mode: PropTypes.string,
    renderLabels: PropTypes.bool,
    renderFormFields: PropTypes.bool,
    placeholderTextMaster: PropTypes.string,
    placeholderTextSlave: PropTypes.string,
    isClearable: PropTypes.bool,
    isSearchable: PropTypes.bool,
    storedControllerOption: PropTypes.any,
    storedMasterOption: PropTypes.any,
    storedSlaveOption: PropTypes.any,
    cleanupParams: PropTypes.any,
    callback: PropTypes.func,
    name: PropTypes.string,
    options: PropTypes.object.isRequired,
    i18n: PropTypes.shape({
      select: PropTypes.object.isRequired
    })
  };

  constructor(props) {
    super(props);
    this.buildSelectOptions = this.buildSelectOptions.bind(this);
    this.buildRangeSelectOptions = this.buildRangeSelectOptions.bind(this);
  }

  componentDidMount() {
    console.log('component mounted')
    console.log(this.props.storedMasterOption)
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.mode !== 'range') return;
    // DEBUG SOS
    // Object.entries(this.props).forEach(([key, val]) =>
    //   prevProps[key] !== val && console.log(`Prop '${key}' changed`)
    // );
    // Object.entries(this.state).forEach(([key, val]) =>
    //   prevState[key] !== val && console.log(`State '${key}' changed`)
    // );
    // DEBUG
    // console.log(`componentDidUpdate for ${this.props.name}`);
    // console.log(`prevProps.storedControllerOption is: ${prevProps.storedControllerOption}`);
    // console.log(`this.props.storedControllerOption is: ${this.props.storedControllerOption}`);
    if (prevProps.storedControllerOption !== this.props.storedControllerOption) {
      this.slaveComponent.clearSelection();
      this.masterComponent.clearSelection();
      // When the controlling component changes value remember to also reset the slave component options
      this.setState({ slaveOptions: this.buildRangeSelectOptions(false) });
      // special handling for rooms & floors
      if ((['rooms', 'floors', 'construction'].indexOf(this.props.name) > -1) && ['land', 'other'].indexOf(this.props.storedControllerOption) > -1){
        // DEBUG
        // console.log('disabling selects');
        this.setState({ masterDisabled: true });
        this.setState({ slaveDisabled: true });
      }
      else {
        // DEBUG
        // console.log('enabling selects');
        this.setState({ masterDisabled: false });
        this.setState({ slaveDisabled: false });
      }
    }
  }

  // In dependant select the first component is called the 'master' and can be thought of as the 'parent' of the two.
  // The dependent one is called the 'slave' and takes the 'slaveOptions' options.
  // For detailed info have a look here: https://repl.it/@kstratis/Transformationsfinal
  state = {
    dependantMenuIsOpen: false,
    masterDisabled: ['rooms', 'floors', 'construction'].indexOf(this.props.name) > -1
      ? this.props.storedControllerOption === 'land'
      : false,
    // This changes according to the controlling parent. 'Range' mode is used for the price and size filters.
    slaveDisabled: ['rooms', 'floors', 'construction'].indexOf(this.props.name) > -1
      ? this.props.storedControllerOption === 'land'
      : this.props.mode === 'range' ? false : !this.props.storedMasterOption,

    // This gets the sibling categories given the stored one.
    slaveOptions:
      this.props.mode !== 'range'
        ? this.props.storedMasterOption && this.props.storedMasterOption.value
          ? this.buildSelectOptions(this.props.options[this.props.storedMasterOption.value], false)
          : []
        : this.buildRangeSelectOptions(false)
  };

  // Hides fields according to current selection.
  // i.e. A land plot property can't have bedrooms/bathrooms
  hideInvalidFormFields(selectedOption){
    console.log(selectedOption);
    const optionName = selectedOption['value'];
    if (optionName === 'land'){
      $("input[name='property[bathrooms]']").closest('.form-field-container').addClass('d-none')
    }

  }

  // Set the subcategory's options according to parent selection.
  // Mind that this fires for both components (master & slave).
  handleOptions = (selectedOption, isMaster) => {
    // 'master' is the parent component. When 'onChanged' fires on subcategory dropdown, do nothing.
    // For example if 'apartment' is changed to 'villa' you don't need to change the property category
    // because they are both under 'residential'.
    if (!isMaster) return;
    // If it fires on the parent, set subcategory's options and enable it
    if (selectedOption) {
      this.hideInvalidFormFields(selectedOption)
      // Reset the value if 'max' is smaller than 'min'
      if (
        this.props.mode === 'range' &&
        this.slaveComponent.state.selectedOption &&
        parseInt(this.slaveComponent.state.selectedOption.value) < parseInt(selectedOption.value)
      ) {
        this.slaveComponent.clearSelection();
      }
      if (
        this.masterComponent.state.selectedOption &&
        this.masterComponent.state.selectedOption.value !== selectedOption.value
      ) {
        // Since we imperativelly control the slave component (no onChange is fired on slave), we also have to
        // call updateExternalDOM to actually update the true value. If mode is range then don't clear selection on every
        // master select onchange event but only when the contraints are violated.
        if (this.props.renderFormFields) {
          this.slaveComponent.updateExternalDOM(selectedOption);
        }
        if (this.props.mode !== 'range') {
          this.slaveComponent.clearSelection();
        }
      }
      if (this.props.mode !== 'range') {
        this.setState({ slaveOptions: this.buildSelectOptions(this.props.options[selectedOption.value], false) });
      } else {
        this.setState({ slaveOptions: this.buildRangeSelectOptions(selectedOption) });
      }
      this.setState({ slaveDisabled: false });
    } else {
      // Otherwise if 'x' is pressed on 'master', clear the slave's current selection then fire the validator and disable the field.
      // However when on 'range' mode defer because the user may only wish to specify a max value with no min value
      if (this.props.mode !== 'range') {
        this.slaveComponent.clearSelection();
        this.setState({ slaveDisabled: true, dependantMenuIsOpen: false });
      }
      this.slaveComponent.blurSelectComponent(); // This is needed in react-select v2
      if (this.props.mode === 'range') {
        this.setState({ slaveOptions: this.buildRangeSelectOptions(false) }); // reset the 'max' list of options or it will remember its last position
      }
      if (this.props.renderFormFields) {
        this.slaveComponent.updateExternalDOM('', false);
      }
    }
  };

  // This builds the options of the select component based on the given parameters.
  // Designed for the range mode it is used to contruct the price assosiative selects.
  buildRangeSelectOptions(selectedOption) {
    if (!selectedOption) {
      return this.buildSelectOptions(this.props.options[this.props.storedControllerOption], false);
    }
    const iterable = this.props.options[this.props.storedControllerOption]['subcategory'];
    const meta = Object.keys(this.props.options[this.props.storedControllerOption]['category'])[0];
    let result = iterable.map(el => {
      return parseInt(Object.keys(el)[0]) >= parseInt(selectedOption.value)
        ? { label: Object.values(el)[0], value: Object.keys(el)[0], meta: (this.props.name === 'size') ? meta : '' }
        : null;
    });
    return result.filter(Boolean);
  }

  // This builds the options of the select component based on the given parameters.
  // i.e. For the 'Master' component it would suffice to iterate over the `this.props.options` keys
  // The master's data is coming from Rails. When filtered by key the result becomes the slave's options
  // Get an overview here: https://repl.it/@kstratis/Transformationsfinal
  buildSelectOptions(options, isMaster) {
    const data = options;
    const iterable = isMaster ? Object.keys(data) : data['subcategory'];
    // "transformLevel1" / "transformLevel2"

    return iterable.map(e => {
      return {
        label: isMaster ? Object.values(data[e]['category'])[0] : Object.values(e)[0],
        value: isMaster ? Object.keys(data[e]['category'])[0] : Object.keys(e)[0],
        meta: (this.props.name === 'size')
          ? Object.keys(data.category)[0]
          : ''
      };
    });
  }

  render() {
    return (
      <div className={this.props.renderFormFields ? '' : 'row'}>
        <div className={this.props.renderFormFields ? 'form-group mb-4' : 'form-group col-6'}>
          {this.props.renderLabels ? (
            <label htmlFor="property_category">
              {this.props.i18n.select.category} <abbr title={this.props.i18n.select.required}>*</abbr>
            </label>
          ) : (
            ''
          )}
          <FormSelect
            id={'property_category_container'}
            identity={'property_category_component'}
            inputID={this.props.formdata ? this.props.formdata.categoryid : ''}
            inputName={this.props.formdata ? this.props.formdata.categoryname : ''}
            inputClassName={this.props.formdata ? this.props.formdata.categoryClassName : ''}
            className={this.props.className}
            renderFormField={this.props.renderFormFields}
            formID={this.props.formdata ? this.props.formdata.formid : ''}
            isMaster={true}
            storedOption={this.props.storedMasterOption}
            options={
              this.props.mode === 'range'
                ? this.buildSelectOptions(this.props.options[this.props.storedControllerOption], false)
                : this.buildSelectOptions(this.props.options, true)
            }
            handleOptions={this.handleOptions}
            callback={this.props.callback ? this.props.callback.bind(null, true) : ''}
            i18n={this.props.i18n}
            placeholderText={this.props.placeholderTextMaster}
            isDisabled={this.state.masterDisabled}
            onRef={ref => (this.masterComponent = ref)}
            soloMode={false}
            isSearchable={this.props.isSearchable}
            isClearable={this.props.isClearable}
            ajaxEnabled={false}
            validatorGroup={this.props.validatorGroup}
            feedback={this.props.formdata ? this.props.formdata.categoryFeedback : ''}
            isRequired={this.props.isRequired}
          />
        </div>
        <div className={`${this.props.renderFormFields ? '' : 'col-6'} form-group`}>
          {this.props.renderLabels ? (
            <label htmlFor="property_subcategory">
              {this.props.i18n.select.subcategory} <abbr title={this.props.i18n.select.required}>*</abbr>
            </label>
          ) : (
            ''
          )}
          <FormSelect
            id={'property_subcategory_container'}
            identity={'property_subcategory_component'}
            inputID={this.props.formdata ? this.props.formdata.subcategoryid : ''}
            inputName={this.props.formdata ? this.props.formdata.subcategoryname : ''}
            inputClassName={this.props.formdata ? this.props.formdata.subcategoryClassName : ''}
            className={this.props.className}
            renderFormField={this.props.renderFormFields}
            formID={this.props.formdata ? this.props.formdata.formid : ''}
            isMaster={false}
            storedOption={this.props.storedSlaveOption}
            options={this.state.slaveOptions}
            handleOptions={this.handleOptions}
            callback={this.props.callback ? this.props.callback.bind(null, false) : ''}
            i18n={this.props.i18n}
            placeholderText={this.props.placeholderTextSlave}
            isDisabled={this.state.slaveDisabled}
            onRef={ref => (this.slaveComponent = ref)}
            soloMode={false}
            isSearchable={this.props.isSearchable}
            isClearable={this.props.isClearable}
            ajaxEnabled={false}
            validatorGroup={this.props.validatorGroup}
            feedback={this.props.formdata ? this.props.formdata.categoryFeedback : ''}
            isRequired={this.props.isRequired}
          />
        </div>
      </div>
    );
  }
}

export default AssociativeFormSelect;
