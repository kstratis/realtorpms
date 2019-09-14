import React, { useState, useEffect } from 'react';
import URLSearchParams from '@ungap/url-search-params';

function useSearchParams(input) {
  const [params, setParams] = useState([]);

  useEffect(() => {
    const currentParams = new URLSearchParams(input);
    const temp = [];
    for (let pair of currentParams.entries()) {
      temp.push({ [pair[0]]: pair[1] });
    }
    setParams(temp);
  }, [input]);

  return params;
}

export default useSearchParams;
