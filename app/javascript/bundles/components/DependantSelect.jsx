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
    slaveDisabled: true,
    nonControllerOptions: []
  };

  handleOptions = (selectedOption, controller) => {
    if (!controller) return;
    if (selectedOption) {
      this.setState({nonControllerOptions: this.formatOptions(this.props.options[selectedOption.value], false)});
      this.setState({slaveDisabled: false});
    } else{
      // Handle the controller (subcategory component
      this.subcategorySelectComp.clearSelection();
      this.subcategorySelectComp.updateExternalDOM(selectedOption);
      this.setState({slaveDisabled: true});
    }
  };

  // TODO This can be further optimized to save the if/else statement
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
          <label htmlFor="property_category">{'Κατηγορία'}</label>
          <SimpleSelect
            identity={'property_category_container'}
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
          />
        </div>
        <div className="form-group">
          <label htmlFor="property_subcategory">{'Υποκατηγορία'}</label>
          <SimpleSelect
            identity={'property_subcategory_container'}
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
          />
        </div>
      </div>
    );
  }
}

export default DependantSelect;

