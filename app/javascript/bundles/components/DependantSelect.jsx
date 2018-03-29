import React from 'react';
import PropTypes from 'prop-types';
import SimpleSelect from './SimpleSelect'


class DependantSelect extends React.Component {

  render() {
    const data = this.props.options;
    const options = Object.keys(data).map( (e) => {
      return {
        'label': Object.values(data[e].category)[0],
        'value': Object.keys(data[e].category)[0]
      }
    });
    return (
      <div>
        <div className="form-group">
          <label htmlFor="property_category">{'Κατηγορία'}</label>
          <SimpleSelect
            id={'property_category_container'}
            inputID={'property_category'}
            inputName={'property[category]'}
            className={'simple-select'}
            options={options}
            formdata={this.props.formdata}
            i18n={this.props.i18n}
          />
        </div>
        <div className="form-group">
          <label htmlFor="property_subcategory">{'Υποκατηγορία'}</label>
          <SimpleSelect
            id={'property_subcategory_container'}
            inputID={'property_subcategory'}
            inputName={'property[subcategory]'}
            className={'simple-select'}
            options={options}
            formdata={this.props.formdata}
            i18n={this.props.i18n}
            disabled={true}
          />
        </div>
      </div>


    );
  }
}

export default DependantSelect;

