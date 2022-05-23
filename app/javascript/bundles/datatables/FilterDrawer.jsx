import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
// import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import PropertyFilters from './PropertyFilters';

function FilterDrawer(props) {
  const [windowSize, setWindowSize] = useState([0, 0]);
  const { filtersOpen } = props;
  const targetElement = useRef(null);

  useLayoutEffect(() => {
    function updateSize() {
      setWindowSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // useLayoutEffect(() => {
  //   function fixOveflow() {
  //     if (!targetElement.current) return;
  //
  //     if (windowSize[0] >= 1200) {
  //       disableBodyScroll(targetElement.current);
  //     } else if (windowSize[0] < 1200 && filtersOpen) {
  //       enableBodyScroll(targetElement.current);
  //     }
  //   }
  //   fixOveflow();
  //   return () => {
  //     clearAllBodyScrollLocks();
  //   };
  // }, [filtersOpen, windowSize]);

  // useEffect(() => {
  //   targetElement.current = document.querySelector('#filter-drawer-element');
  // }, []);

  return (
      // <div className={`filter-drawer-container ${windowSize[0] < 1200 && filtersOpen ? 'filter-drawer-container-active' : ''}`}>
      <div className={`
        ${
          windowSize[0] < 1200
              ? filtersOpen
                  ? 'filter-drawer-container d-block d-xl-none filter-drawer-container-active'
                  : 'd-none'
              : filtersOpen
                  ? 'filters col-xl-4 d-none d-lg-block animated fadeIn'
                  : 'filters d-none animated fadeIn'
      }`}>
    <div
      id={'filter-drawer-element'}
      className={`
        ${
          windowSize[0] < 1200
            ? filtersOpen
              ? 'filter-drawer d-block d-xl-none filter-drawer-active'
              : 'd-none'
            : filtersOpen
            ? 'filters animated fadeIn'
            : 'filters d-none animated fadeIn'
        }`}>
      <PropertyFilters {...props} />
      <div className={`${windowSize[0] < 1200 ? '' : 'd-none'} bottom-actions drawer-controls`}>
        <button className={'btn btn-primary btn-md btn-block'} onClick={e => props.handleChange()}>
          {props.i18n.ok}
        </button>
      </div>
    </div>
      </div>
  );
}

export default FilterDrawer;
