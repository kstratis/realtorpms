import React from 'react';
import PropTypes from 'prop-types';
import MultiAsyncSelect from './MultiAsyncSelect';
import axios from 'axios';

class UsersMultiAsyncSelect extends React.Component {
  constructor(props) {
    super(props);
  }

  changeHandler(selectedOptions) {
    console.log(selectedOptions);
    this.setState({ selectedOptions });
    console.log('changed');
    axios({
      method: 'post',
      url: this.props.assign_endpoint,
      data: { selection: selectedOptions || [] }
    }).then(() => {
      console.log('OK');
    });
  }

  render(){
    return (
      <div>
        <MultiAsyncSelect {...this.props} />
      </div>
    )
  }
}

export default UsersMultiAsyncSelect;