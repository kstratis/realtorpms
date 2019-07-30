import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactOnRails from 'react-on-rails';
axios.defaults.headers.common['X-CSRF-Token'] = ReactOnRails.authenticityToken();

// react-select keeps its own internal state in which case maintaing our own and setting it on fetch kill performance
// and the user gets input lag
function useFetch(request, dropdown = true, didMountRef = null) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const executeAjax = async () => {
      if (!dropdown) setLoading(true);
      const result = await axios({
        method: request.method,
        url: request.url,
        data: request.payload
      });
      if (!dropdown) {
        setData(result.data.message);
        setLoading(false);
      }
      if (request.callback && typeof request.callback === 'function') {
        request.callback(result.data.message);
      }
    };
    if (didMountRef) {
      if (didMountRef.current) {
        executeAjax();
      } else {
        didMountRef.current = true;
      }
    } else {
      executeAjax();
    }
  }, [request]);

  // Retun setData is case the includer needs to use it.
  return { data, loading, setData };
}

export default useFetch;
