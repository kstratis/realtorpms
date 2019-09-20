import PropTypes from 'prop-types';
import React from 'react';

class SortFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0
    };
  }

  componentDidMount() {
    if (this.props.currentSorting === this.props.slug) {
      const option = this.props.options.find(option => {
        return option.sort_order === this.props.currentOrdering;
      });
      this.setState({ selectedIndex: option.sn });
    }
  }

  handleMenuItemClick = (e, index, filter, order) => {
    e.preventDefault();
    this.setState({ selectedIndex: index }, () => {
      this.props.handleFn('', filter, order);
    });
  };

  render() {
    return (
      <div className="flex-nowrap flex-shrink-1 px-2">
        <div className="dropdown">
          <button
            className="btn btn-secondary"
            type="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false">
            <span className={'d-none d-sm-inline'}>{this.props.title}&nbsp;</span><i className="fas fa-sort" />
          </button>
          <div className="dropdown-arrow dropdown-arrow-left" />
          <div className="dropdown-menu">
            {this.props.options.map((option, index) => (
              <a
                href={''}
                className={`dropdown-item ${index === this.state.selectedIndex ? 'selected-option' : ''}`}
                key={option.text}
                onClick={e => this.handleMenuItemClick(e, index, option.sort_filter, option.sort_order)}>
                <i className={option.icon} />
                &nbsp; {option.text}
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

SortFilter.propTypes = {
  slug: PropTypes.string,
  title: PropTypes.string,
  currentSorting: PropTypes.string,
  currentOrdering: PropTypes.string,
  handleFn: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      sn: PropTypes.number.isRequired,
      text: PropTypes.string.isRequired,
      sort_filter: PropTypes.string.isRequired,
      sort_order: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired
    })
  ).isRequired
};

export default SortFilter;
