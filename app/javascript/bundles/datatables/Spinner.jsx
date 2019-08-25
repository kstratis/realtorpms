import React from 'react';
import PropTypes from 'prop-types';

export default class Spinner extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.isLoading !== nextProps.isLoading;
  }

  render() {
    return (
      <div>
        {this.props.isLoading === true ? (
          <div className="justify-content-center align-items-center">
            <div className="w-100 d-flex justify-content-center align-items-center">
              <div className={`${this.props.version === 2 ? 'properties-spinner' : 'spinner'}`} />
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}
