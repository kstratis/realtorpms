import PropTypes from 'prop-types';
import React from 'react';
import withDatatable from './withDatatable';
import ControlsContainer from './ControlsContainer';

class SortFilter extends React.Component {
  constructor(props) {
    super(props);
  }

  updateName = name => {
    this.setState({ name });
  };

  render() {
    return (
      <div className="col-md-auto">
        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false">
            {this.props.i18n.title}
          </button>
          <div className="dropdown-arrow dropdown-arrow-left" />
          <div className="dropdown-menu">
            <a className="dropdown-item" href="#" onClick={e => this.props.handleFn(e)}>
              <i className={'fas fa-sort-amount-up'} /> {this.props.i18n.option1}
            </a>
            <a className="dropdown-item" href="#">
              <i className={'fas fa-sort-amount-down'} /> {this.props.i18n.option2}
            </a>
          </div>
        </div>
      </div>
    );
  }
}

SortFilter.propTypes = {
  name: PropTypes.string,
  handleFn: PropTypes.func,
  i18n: PropTypes.shape({
    title: PropTypes.string,
    option1: PropTypes.string,
    option2: PropTypes.string
  })
};

export default SortFilter;
