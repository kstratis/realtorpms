import React, { useEffect } from 'react';

function useTooltips() {

  // Activate any Bootstrap tooltips
  useEffect(() => {
    $('[data-toggle="tooltip"]').tooltip();
    return () => {
      $('[data-toggle="tooltip"]').tooltip('dispose');
    };
  });

}

export default useTooltips;
