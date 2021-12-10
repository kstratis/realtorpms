import React, { useState, useEffect } from 'react';

function useFilterToggle(name, forceFiltersOpen) {
  const [filtersOpen, setFiltersOpen] = useState(() => !!forceFiltersOpen || JSON.parse(localStorage.getItem(name)));

  useEffect(() => {
    localStorage.setItem(name, filtersOpen);
  }, [filtersOpen]);

  return { filtersOpen, setFiltersOpen };
}

export default useFilterToggle;
