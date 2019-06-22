import PropTypes from 'prop-types';
import React from 'react';

class Filters extends React.Component {
  constructor(props) {
    super(props);
    // How to set initial state in ES6 class syntax
    // https://facebook.github.io/react/docs/reusable-components.html#es6-classes
    this.state = { name: this.props.name };
  }

  updateName = name => {
    this.setState({ name });
  };

  render() {
    return (
      <div className="">
        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false">
            {'Ταξινόμηση'}
          </button>
          <div className="dropdown-arrow dropdown-arrow-left" />
          <div className="dropdown-menu">
            <h6 className="dropdown-header d-none d-md-block d-lg-none">{'asdasd'}</h6>
            <a className="dropdown-item" href="#">
              <i className={'fas fa-sort-amount-up'} /> {'Αύξουσα'}
            </a>
            <a className="dropdown-item" href="#">
              <i className={'fas fa-sort-amount-down'} /> {'Φθίνουσα'}
            </a>
            {/*</div>*/}
          </div>
        </div>
        {/*<a href={''} className={'btn btn-danger'}></a>*/}
        {/*<button*/}
        {/*className="btn btn-secondary"*/}
        {/*type="button"*/}
        {/*id="dropdownMenuButton"*/}
        {/*data-toggle="dropdown"*/}
        {/*aria-haspopup="true"*/}
        {/*aria-expanded="false">*/}
        {/*Open Dropdown <i className="fa fa-caret-down" />*/}
        {/*</button>*/}
        {/*<div className="dropdown-arrow" />*/}
        {/*<div*/}
        {/*className="dropdown-menu"*/}
        {/*aria-labelledby="dropdownMenuButton"*/}
        {/*x-placement="bottom-start"*/}
        {/*style="position: absolute; will-change: top, left; top: 36px; left: 0px;">*/}
        {/*<h6 className="dropdown-header"> Beni Arisandi </h6>*/}
        {/*<a className="dropdown-item" href="#!">*/}
        {/*<span className="dropdown-icon oi oi-person" /> Profile*/}
        {/*</a>{' '}*/}
        {/*<a className="dropdown-item" href="#!">*/}
        {/*<span className="dropdown-icon oi oi-account-logout" /> Logout*/}
        {/*</a>*/}
        {/*<div className="dropdown-divider" />*/}
        {/*<a className="dropdown-item" href="#!">*/}
        {/*Help Center*/}
        {/*</a>{' '}*/}
        {/*<a className="dropdown-item" href="#!">*/}
        {/*Ask Forum*/}
        {/*</a>*/}
        {/*<a className="dropdown-item" href="#!">*/}
        {/*Keyboard Shortcuts*/}
        {/*</a>*/}
        {/*</div>*/}

        {/*<i className={'fas fa-filter fa-fw'}></i>&nbsp; Είδος*/}
        {/*</a>*/}
      </div>
    );
  }
}

export default Filters;
