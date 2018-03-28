import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import SimpleSelect from './SimpleSelect'
// import '!style-loader!css-loader!react-select/dist/react-select.css';

class DependantSelect extends React.Component {

  // static propTypes = {
  //   formdata: PropTypes.shape({
  //     elementid: PropTypes.string.isRequired,
  //     formid: PropTypes.string.isRequired,
  //   }),
  //   i18n: PropTypes.shape({
  //     select: PropTypes.object.isRequired
  //   })
  // };
  //
  // state = {
  //   selectedOption: '',
  // };

  // updateExternalDOM = (selectedOption) => {
  //   // JQuery form validator specifics. Requires JQuery.
  //   // Manipulating a form element outside of this React component should be relatively safe
  //   const elementID = $(`#${this.props.formdata.elementid}`);
  //   const formID = $(`#${this.props.formdata.formid}`);
  //   elementID.val(selectedOption ? selectedOption.value : '');
  //   const validator = formID.validate();
  //   validator.element(elementID);
  // };

  // handleChange = (selectedOption) => {
  //   this.setState({ selectedOption });
  //   this.updateExternalDOM(selectedOption);
  // };

  render() {
    // const { selectedOption } = this.state;
    // const value = selectedOption && selectedOption.value;


    return (
      <div className="form-group">
        <label htmlFor="property_propertycategory">{'Κατηγορία'}</label>
        <Select
          className={'simple-select'}
          options={['cat', 'hat', 'man', 'dog']}
          // options= Property.categories.keys.collect {|propertycategory| {label: Property.human_enum_name(:propertycategory, propertycategory), value: propertycategory}}
          formdata = { this.props.formdata }
          i18n={this.props.i18n}
        />
        <input id="property_propertycategory"
               name="property[propertycategory]"
               className="proxy-form-input"
               tabIndex="-1"
               value=""
               required />

        {/*<Select*/}
          {/*id={this.props.id}*/}
          {/*inputProps={{ 'data-name': this.props.name }}*/}
          {/*name={this.props.name }*/}
          {/*value={value}*/}
          {/*className={this.props.className}*/}
          {/*onChange={this.handleChange}*/}
          {/*options={this.props.options}*/}
          {/*placeholder={this.props.i18n.select.placeholder}*/}
        {/*/>*/}





      </div>












    );
  }
}

export default DependantSelect;

