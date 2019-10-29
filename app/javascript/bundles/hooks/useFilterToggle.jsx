import React, { useState, useEffect } from 'react';

function useFilterToggle(name) {
  const [filtersOpen, setFiltersOpen] = useState(() => JSON.parse(localStorage.getItem(name)));

  useEffect(() => {
    localStorage.setItem(name, filtersOpen);
  }, [filtersOpen]);

  return { filtersOpen, setFiltersOpen };
}

export default useFilterToggle;
