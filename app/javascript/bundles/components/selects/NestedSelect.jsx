import React from 'react';
import PropTypes from 'prop-types';
import FormSelect from './FormSelect';

class NestedSelect extends React.Component {
  static propTypes = {
    formdata: PropTypes.shape({
      formid: PropTypes.string,
      categoryid: PropTypes.string.isRequired,
      categoryname: PropTypes.string.isRequired,
      subcategoryid: PropTypes.string.isRequired,
      subcategoryname: PropTypes.string.isRequired
    }),
    storedMasterOption: PropTypes.object,
    storedSlaveOption: PropTypes.object,
    options: PropTypes.object.isRequired,
    searchable: PropTypes.bool,
    i18n: PropTypes.shape({
      select: PropTypes.object.isRequired
    })
  };

  constructor(props) {
    super(props);
    this.buildSelectOptions = this.buildSelectOptions.bind(this);
    this.getCategoryKey = this.getCategoryKey.bind(this);
  }

  // In dependant select the first component is called the 'master' and can be thought of as the 'parent' of the two.
  // The dependent one is called the 'slave' and takes the 'slaveOptions' options.
  state = {
    dependantMenuIsOpen: false,
    slaveDisabled: !this.props.storedSlaveOption, // This changes according to the controlling parent
    // This gets the sibling categories given the stored one.
    slaveOptions: this.props.storedSlaveOption
      ? this.buildSelectOptions(this.props.options[this.getCategoryKey()], false)
      : []
    // slaveOptions: []  // The subcategory component gets its options from state according to parent selection
  };

  // Set the subcategory's options according to parent selection.
  // Mind that this fires for both components (master & slave).
  handleOptions = (selectedOption, isMaster) => {
    // 'master' is the parent component. When 'onChanged' fires on subcategory dropdown, do nothing.
    // For example if 'apartment' is changed to 'villa' you don't need to change the property category
    // because they are both under 'residential'.
    if (!isMaster) return;
    // If it fires on the parent, set subcategory's options and enable it
    if (selectedOption) {
      if (
        this.masterComponent.state.selectedOption &&
        this.masterComponent.state.selectedOption.value !== selectedOption.value
      ) {
        // Since we imperativelly control the slave component (no onChange is fired on slave), we have also
        // call updateExternalDOM to actually update the true value
        this.slaveComponent.clearSelection();
        this.slaveComponent.updateExternalDOM(selectedOption);
      }
      this.setState({ slaveOptions: this.buildSelectOptions(this.props.options[selectedOption.value], false) });
      this.setState({ slaveDisabled: false });
    } else {
      // otherwise if 'x' is pressed on 'master', clear the slave's current selection then fire the validator and disable the field.
      // Handle the master (subcategory component
      this.slaveComponent.clearSelection();
      this.slaveComponent.blurSelectComponent(); // This is needed in react-select v2
      this.slaveComponent.updateExternalDOM('', false);
      this.setState({ slaveDisabled: true, dependantMenuIsOpen: false });
    }
  };

  // This builds the options of the select component based on the given parameters.
  // i.e. For the 'Master' component it would suffice to iterate over the `this.props.options` keys
  // The master's data is coming from Rails. When filtered by key the result becomes the slave's options
  // Get an overview here: https://repl.it/@kstratis/Transformationsfinal
  buildSelectOptions(options, isController) {
    const data = options;
    const iterable = isController ? Object.keys(data) : data['subcategory'];
    // "transformLevel1" / "transformLevel2"
    return iterable.map(e => {
      return {
        label: isController ? Object.values(data[e]['category'])[0] : Object.values(e)[0],
        value: isController ? Object.keys(data[e]['category'])[0] : Object.keys(e)[0]
      };
    });
  }

  // Helper function to retrieve the category value of the master given the slave's one.
  filterFn(arr) {
    // arr at this point is exactly this:
    // [ null, null, null, null, null, null, null, null, null ]
    // [ null, null, null, null, null, null, null, null, null ]
    // [ null, null, 'land', null ]
    // [ null, null, null, null, null, null ]
    // 4 arrays cause we have 4 categories. It is full of nulls
    // because of no match except one in the third array which
    // is what we are looking for. Now we pull out the nulls off
    // of each array which leaves us with 3 empty arrays. If it's
    // empty retun null, otherwise return it's first
    // and only element which is our match.
    const filtered_array = arr.filter(Boolean);
    return filtered_array.length > 0 ? filtered_array[0] : null;
  }

  // This retrieves the category key given a preselected subcategory.
  // For example assume that the database has stored a slave's component value
  // as "{ island: 'Νησί' }". This function allows to retrieve its category which is 'land' through which we'll manage
  // to get its other siblings which are:
  // { land_plot: 'Οικόπεδο' },
  // { parcels: 'Αγροτεμάχιο' },
  // { island: 'Νησί' },
  // { other_categories: 'Λοιπές κατηγορίες' },
  // For detailed info have a look here: https://repl.it/@kstratis/Transformationsfinal
  // // "transformLevel3"
  getCategoryKey() {
    const data = this.props.options;
    const preselectedOption = this.props.storedSlaveOption;
    const interim_result = Object.keys(data).map(e => {
      // This thing below returns an array of flattened arrays. i.e.
      // [ null, null, 'land', null ]
      return this.filterFn(
        Object.values(data[e]['subcategory']).map(el => {
          return Object.keys(el)[0] === preselectedOption.value ? e : null;
        })
      );
    });
    // This last line filters out the nulls and picks the
    // only value left which is a string.
    return interim_result.filter(Boolean)[0];
  }

  render() {
    return (
      <div>
        <div className="form-group mb-4">
          <label htmlFor="property_category">
            {this.props.i18n.select.category} <abbr title={this.props.i18n.select.required}>*</abbr>
          </label>
          <FormSelect
            id={'property_category_container'}
            identity={'property_category_component'}
            inputID={this.props.formdata.categoryid}
            inputName={this.props.formdata.categoryname}
            inputClassName={this.props.formdata.categoryClassName}
            className={this.props.className}
            formID={this.props.formdata.formid}
            isMaster={true}
            storedOption={this.props.storedMasterOption}
            options={this.buildSelectOptions(this.props.options, true)}
            handleOptions={this.handleOptions}
            i18n={this.props.i18n}
            isDisabled={false}
            onRef={ref => (this.masterComponent = ref)}
            soloMode={false}
            isSearchable={this.props.isSearchable}
            isClearable={this.props.isClearable}
            ajaxEnabled={false}
            validatorGroup={this.props.validatorGroup}
            feedback={this.props.formdata.categoryFeedback}
            isRequired={this.props.isRequired}
          />
        </div>
        <div className="form-group mb-4">
          <label htmlFor="property_subcategory">
            {this.props.i18n.select.subcategory} <abbr title={this.props.i18n.select.required}>*</abbr>
          </label>
          <FormSelect
            id={'property_subcategory_container'}
            identity={'property_subcategory_component'}
            inputID={this.props.formdata.subcategoryid}
            inputName={this.props.formdata.subcategoryname}
            inputClassName={this.props.formdata.subcategoryClassName}
            className={this.props.className}
            formID={this.props.formdata.formid}
            isMaster={false}
            storedOption={this.props.storedSlaveOption}
            options={this.state.slaveOptions}
            handleOptions={this.handleOptions}
            i18n={this.props.i18n}
            isDisabled={this.state.slaveDisabled}
            onRef={ref => (this.slaveComponent = ref)}
            soloMode={false}
            isSearchable={this.props.isSearchable}
            isClearable={this.props.isClearable}
            ajaxEnabled={false}
            validatorGroup={this.props.validatorGroup}
            feedback={this.props.formdata.subcategoryFeedback}
            isRequired={this.props.isRequired}
          />
        </div>
      </div>
    );
  }
}

export default NestedSelect;
