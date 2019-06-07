import React, { useState, useEffect } from 'react';
import axios from 'axios';

function useFetch(request) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const executeAjax = async () => {
      console.log('fetch executing');
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
  return { data, loading };
}

export default useFetch;