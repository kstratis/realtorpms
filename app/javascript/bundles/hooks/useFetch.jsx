import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { safelyExecCallback } from '../utilities/helpers';
import ReactOnRails from 'react-on-rails';
axios.defaults.headers.common['X-CSRF-Token'] = ReactOnRails.authenticityToken();

// react-select keeps its own internal state in which case maintaining our own and setting it on fetch kills performance
// and the user gets input lag.

// didMountRef is used to control whether useFetch will fire upon first mount. If set to true or is omitted altogether,
// useFetch will fire on first mount. Otherwise, if set to false, the ajax operation won't run on first mount.

// initialLoading is needed because this is optimised to load array of hashes. In case we need to load a hash instead,
// on first render things will blow up (arrays would simply iterate over nothing); that's why we need to be
// protected by initialLoading `true` (a non existing hash won't iterate and will blow up)
function useFetch(request, dropdown = true, fireAjaxOnMount = null, isInitialLoading = false) {
  const [status, setStatus] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(isInitialLoading);

  useEffect(() => {
    const executeAjax = async () => {
      if (!dropdown) setLoading(true);
      const result = await axios({
        method: request.method,
        url: request.url,
        data: request.payload
      });
      if (!dropdown) {
        setStatus(result.data.status);
        setData(result.data.message);
        setLoading(false);
      }
      safelyExecCallback(request, result.data.message);
    };
    if (fireAjaxOnMount) {
      if (fireAjaxOnMount.current) {
        executeAjax();
      } else {
        fireAjaxOnMount.current = true;
      }
    } else {
      executeAjax();
    }
  }, [request]);

  // Return setData is case the includer needs to use it.
  return { status, data, loading, setData };
}

export default useFetch;
