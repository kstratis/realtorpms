import React from 'react';
import PropTypes from 'prop-types';
import SimpleSelect from './SimpleSelect'

class DependantSelect extends React.Component {

  static propTypes = {
    formdata: PropTypes.shape({
      formid: PropTypes.string,
      categoryid: PropTypes.string.isRequired,
      categoryname: PropTypes.string.isRequired,
      subcategoryid: PropTypes.string.isRequired,
      subcategoryname: PropTypes.string.isRequired,
    }),
    options: PropTypes.object.isRequired,
    searchable: PropTypes.bool,
    i18n: PropTypes.shape({
      select: PropTypes.object.isRequired
    })
  };

  // In dependant select the first component is called the 'master' and can be thought of as the 'parent' of the two.
  // The dependent one is called the 'slave' and takes the 'slaveOptions' options.
  state = {
    slaveDisabled: true,  // This changes according to the controlling parent
    slaveOptions: []  // The subcategory component gets its options from state according to parent selection
  };

  // Set the subcategory's options according to parent selection.
  // Mind that this fires for both components (master & slave).
  handleOptions = (selectedOption, isMaster) => {
    // 'master' is the parent component. When 'onChanged' fires on subcategory dropdown, do nothing. For example
    // if 'apartment' is changed to 'villa' you don't nedd to change the property category cause they are both under
    // 'residential'.
    if (!isMaster) return;
    // If it fires on the parent, set subcategory's options and enable it
    if (selectedOption) {
      this.setState({slaveOptions: this.formatOptions(this.props.options[selectedOption.value], false)});
      this.setState({slaveDisabled: false});
    } else{  // otherwise if 'x' is pressed on parent, clear subcategory's selection, fire the validator and disable it.
      // Handle the master (subcategory component
      this.subcategorySelectComp.clearSelection();
      this.subcategorySelectComp.updateExternalDOM(selectedOption);
      this.setState({slaveDisabled: true});
    }
  };

  // TODO This can be further optimized to save the if/else statement
  // This transforms parent/child options data for use with the select component.
  // Parent's data are coming from rails. These data when filtered by key become the child's option
  // Get an overview here: https://repl.it/@kstratis/Transformationsfinal
  formatOptions = (options, isController) => {
    const data = options;
    const iterable = isController ? Object.keys(data) : data['subcategory'];
    console.log(iterable);
    if (isController){
      // "transformLevel1"
      return iterable.map((e) => {
        return {
          'label': Object.values(data[e]['category'])[0],
          'value': Object.keys(data[e]['category'])[0]
        }
      });
    } else {
      // "transformLevel2"
      return iterable.map((e) => {
        return {
          'label': Object.values(e)[0],
          'value': Object.keys(e)[0]
        }
      });
    }
  };

  render() {
    return (
      <div>
        <div className="form-group">
          <label htmlFor="property_category">{this.props.i18n.select.category} <abbr title={this.props.i18n.select.required}>*</abbr></label>
          <SimpleSelect
            id={'property_category_container'}
            identity={'property_category_component'}
            inputID={this.props.formdata.categoryid}
            inputName={this.props.formdata.categoryname}
            formID={this.props.formdata.formid}
            isMaster={true}
            className={'simple-select'}
            options={this.formatOptions(this.props.options, true)}
            handleOptions={this.handleOptions}
            i18n={this.props.i18n}
            disabled={false}
            onRef={ref => (this.categorySelectComp = ref)}
            soloMode={false}
            searchable={this.props.searchable}
          />
        </div>
        <div className="form-group">
          <label htmlFor="property_subcategory">{this.props.i18n.select.subcategory} <abbr title={this.props.i18n.select.required}>*</abbr></label>
          <SimpleSelect
            id={'property_subcategory_container'}
            identity={'property_subcategory_component'}
            inputID={this.props.formdata.subcategoryid}
            inputName={this.props.formdata.subcategoryname}
            formID={this.props.formdata.formid}
            isMaster={false}
            className={'simple-select'}
            options={this.state.slaveOptions}
            handleOptions={this.handleOptions}
            i18n={this.props.i18n}
            disabled={this.state.slaveDisabled}
            onRef={ref => (this.subcategorySelectComp = ref)}
            soloMode={false}
            searchable={this.props.searchable}
          />
        </div>
      </div>
    );
  }
}

export default DependantSelect;

