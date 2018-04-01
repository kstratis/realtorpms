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
    i18n: PropTypes.shape({
      select: PropTypes.object.isRequired
    })
  };

  state = {
    slaveDisabled: true,  // This changes according to the controlling parent
    nonControllerOptions: []  // The subcategory component gets its options from state according to parent selection
  };

  // Set the subcategory's options according to parent selection
  handleOptions = (selectedOption, controller) => {
    // controller is the parent. When 'onChanged' fires on subcategory dropdown, do nothing
    if (!controller) return;
    // when it fires on the parent, set subcategory's options and enable it
    if (selectedOption) {
      this.setState({nonControllerOptions: this.formatOptions(this.props.options[selectedOption.value], false)});
      this.setState({slaveDisabled: false});
    } else{  // otherwise if 'x' is pressed on parent, clear subcategory's selection, fire the validator and disable it.
      // Handle the controller (subcategory component
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
    if (isController){
      return iterable.map((e) => {
        return {
          'label': Object.values(data[e]['category'])[0],
          'value': Object.keys(data[e]['category'])[0]
        }
      });
    } else {
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
          <label htmlFor="property_category">{this.props.i18n.select.category}</label>
          <SimpleSelect
            id={'property_category_container'}
            identity={'property_category_component'}
            inputID={this.props.formdata.categoryid}
            inputName={this.props.formdata.categoryname}
            formID={this.props.formdata.formid}
            controller={true}
            className={'simple-select'}
            options={this.formatOptions(this.props.options, true)}
            handleOptions={this.handleOptions}
            i18n={this.props.i18n}
            disabled={false}
            onRef={ref => (this.categorySelectComp = ref)}
            soloMode={false}
          />
        </div>
        <div className="form-group">
          <label htmlFor="property_subcategory">{this.props.i18n.select.subcategory}</label>
          <SimpleSelect
            id={'property_subcategory_container'}
            identity={'property_subcategory_component'}
            inputID={this.props.formdata.subcategoryid}
            inputName={this.props.formdata.subcategoryname}
            formID={this.props.formdata.formid}
            controller={false}
            className={'simple-select'}
            options={this.state.nonControllerOptions}
            handleOptions={this.handleOptions}
            i18n={this.props.i18n}
            disabled={this.state.slaveDisabled}
            onRef={ref => (this.subcategorySelectComp = ref)}
            soloMode={false}
          />
        </div>
      </div>
    );
  }
}

export default DependantSelect;

