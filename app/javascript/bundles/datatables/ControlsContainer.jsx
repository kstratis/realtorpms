import PropTypes from 'prop-types';
import React from 'react';
import SortFilter from './SortFilter';

class ControlsContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <SortFilter key={filter['name']} handleFn={filter['fn']} i18n={filter['i18n']} options={''} />
    )
  }
}

ControlsContainer.propTypes = {
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      fn: PropTypes.func,
      i18n: PropTypes.object
    })
  )
};

export default ControlsContainer;
