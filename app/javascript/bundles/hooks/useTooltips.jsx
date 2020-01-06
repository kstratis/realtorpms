import React, { useEffect, useRef } from 'react';

function useTooltips() {
  const tooltipElements = useRef(null);
  // Activate any Bootstrap tooltips
  useEffect(() => {
    tooltipElements.current = $('[data-toggle="tooltip"]');
    tooltipElements.current.tooltip();
    return () => {
      tooltipElements.current.tooltip('dispose');
    };
  });
}

export default useTooltips;
