import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
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

  useLayoutEffect(() => {
    function fixOveflow() {
      if (!targetElement.current) return;

      if (windowSize[0] >= 1200) {
        disableBodyScroll(targetElement.current);
      } else if (windowSize[0] < 1200 && filtersOpen) {
        enableBodyScroll(targetElement.current);
      }
    }
    fixOveflow();
    return () => {
      clearAllBodyScrollLocks();
    };
  }, [filtersOpen, windowSize]);

  useEffect(() => {
    targetElement.current = document.querySelector('#filters-drawer-element');
  }, []);

  return (
    <div className={`filters-drawer-container ${filtersOpen ? 'active' : ''}` }>
      <section
        id={'filters-drawer-element'}
        className={`
        ${
          windowSize[0] < 1200
            ? filtersOpen
              ? 'side-drawer position-fixed d-block d-xl-none active'
              : 'side-drawer position-fixed'
            : filtersOpen
            ? 'filters col-xl-4 d-none d-lg-block animated fadeIn'
            : 'filters d-none animated fadeIn'
        } bg-white filters-drawer`}>
        <PropertyFilters {...props} />

        <div className={`${windowSize[0] < 1200 ? '' : 'd-none'} drawer-controls d-flex align-items-center py-3`}>
          <button className={'btn btn-primary btn-md btn-block'} onClick={e => props.handleChange()}>
            {props.i18n.ok}
          </button>
        </div>
      </section>
    </div>
  );
}

export default FilterDrawer;
