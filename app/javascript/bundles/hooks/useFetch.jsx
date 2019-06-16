import React, { useState, useEffect } from 'react';
import axios from 'axios';

function useFetch(request) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const executeAjax = async () => {
      setLoading(true);
      const result = await axios({
        method: request.method,
        url: request.url,
        data: request.payload
      });
      setData(result.data.message);
      setLoading(false);
    };
    executeAjax();

  }, [request]);
  // Retun setData is case the includer needs to use it.
  return { data, loading, setData };
}

export default useFetch;