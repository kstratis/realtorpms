import React, { useEffect, useRef } from 'react';

function usePopovers() {
  const popoverElements = useRef(null);
  // Activate any Bootstrap popovers
  useEffect(() => {
    popoverElements.current = $('[data-toggle="popover"]');
    popoverElements.current.popover();

    // In contrast to tooltips, this one seems to have no effects. Maybe popper.js is immune to multiple instantiations
    // return () => {
    //   popoverElements.current.popover('dispose');
    // };
  });
}

export default usePopovers;
