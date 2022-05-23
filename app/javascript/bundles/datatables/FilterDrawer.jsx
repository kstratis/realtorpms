import React, { useState, useLayoutEffect } from 'react';
import PropertyFilters from './PropertyFilters';

function FilterDrawer(props) {
  const [windowSize, setWindowSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setWindowSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  const { filtersOpen } = props;

  return (
    <div
      className={
        windowSize[0] < 1200
          ? filtersOpen
            ? 'side-drawer position-fixed d-block d-xl-none side-drawer-active'
            : 'side-drawer position-fixed'
          : filtersOpen
          ? 'filters col-xl-4 d-none d-lg-block animated fadeIn'
          : 'filters d-none animated fadeIn'
      }>
      <div className={`${windowSize[0] < 1200 ? 'h-100 bg-white' : ''} `}>
        <PropertyFilters {...props} />

        <div className={`${windowSize[0] < 1200 ? '' : 'd-none'} drawer-controls p-3`}>
          <button className={'btn btn-primary btn-lg btn-block'} onClick={e => props.handleChange()}>
            {props.i18n.ok}
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterDrawer;
