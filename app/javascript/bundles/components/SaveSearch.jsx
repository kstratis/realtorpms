import React, { useState, useEffect, useRef } from 'react';
import URLSearchParams from '@ungap/url-search-params';

const renderParams = () => {
  let searchParams = new URLSearchParams(window.location.search);
  console.log(searchParams.toString());
};

function SaveSearch({ modalHeader, criteriaSelection, avatar, favlists_url, favorites_url, property_id, i18n }) {
  const [currentParams, setCurrentParams] = useState([]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const input = [];
    for(let pair of searchParams.entries()) {
      input.push({[pair[0]]: pair[1]});
    }
    console.log(input);
    setCurrentParams(input);
  }, []);

  return (
    <div className="favlist-container mt-3">

      <div className="d-flex justify-content-center mt-2">
          <i className="pr-icon md disk"></i>
      </div>

      {/*<h2 className={'mt-2'}>{modalHeader}</h2>*/}
      <hr />
      <div className={'favlist-body'}>
        <h3>{criteriaSelection}</h3>
        <div className={'col-8 offset-2'}>
        <table className="table">
          <tbody>
          {currentParams.map((el, index) => (
            <tr key={index}>
              <td>{Object.keys(el)[0]}</td>
              <td>{Object.values(el)[0]}</td>
            </tr>
          ))}

          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}

export default SaveSearch;
