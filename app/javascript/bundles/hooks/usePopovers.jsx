import React, { useEffect, useRef } from 'react';

function usePopovers() {
  const popoverElements = useRef(null);
  // Activate any Bootstrap popovers
  useEffect(() => {
    popoverElements.current = $('[data-toggle="popover"]');
    popoverElements.current.popover();

    return () => {
      popoverElements.current.popover('dispose');
    };
  });
}

export default usePopovers;
