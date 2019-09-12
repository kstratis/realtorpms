import React, { useState, useEffect, useRef } from 'react';
import URLSearchParams from '@ungap/url-search-params';
import { priceFilterOptions, renderHTML } from '../utilities/helpers';

const renderParams = () => {
  let searchParams = new URLSearchParams(window.location.search);
  console.log(searchParams.toString());
};

function RenderRow({ name, value, index }) {
  return (
    <tr key={index}>
      <td>{name}</td>
      <td>{value}</td>
    </tr>
  );
}

function RenderEntry({ element, index, i18n, i18nPriceOptions, i18nSizeOptions }) {
  return (
    <>
      {(() => {

        const objKey = Object.keys(element)[0];
        const objValue = Object.values(element)[0];
        console.log(objKey, objValue);
        switch (true) {
          case ['pricemin', 'pricemax'].includes(objKey):
            console.log(`YAY found ${objKey}`);
            return (
              <RenderRow name={i18n.search_save_filters[objKey]} value={i18nPriceOptions[objValue]} index={index} />
            );
          case ['sizemin', 'sizemax'].includes(objKey):
            console.log(`YAY found ${objKey}`);
            return <RenderRow name={i18n.search_save_filters[objKey]} value={i18nSizeOptions[objValue]} index={index} />;
          default:
            return null;
        }
      })()}
    </>
  );
}

function SaveSearch({
  modalHeader,
  criteriaSelection,
  avatar,
  favlists_url,
  favorites_url,
  property_id,
  i18n,
  i18nPriceOptions,
  i18nSizeOptions
}) {
  const [currentParams, setCurrentParams] = useState([]);
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const input = [];
    for (let pair of searchParams.entries()) {
      input.push({ [pair[0]]: pair[1] });
    }
    // DEBUG
    // console.log(input);
    setCurrentParams(input);
  }, []);

  // console.log(i18nOptions);
  // renderRow(el, index, i18n, i18nPriceOptions, i18nSizeOptions)

  return (
    <div className="favlist-container mt-3">
      <div className="d-flex justify-content-center mt-2">
        <i className="pr-icon md disk" />
      </div>

      <hr />
      <div className={'favlist-body'}>
        <h3>{i18n.search_save_criteria}</h3>
        <div className={'col-10 offset-1'}>
          <table className="table">
            <tbody>
              {currentParams.map((element, index) => {
                return (
                  <RenderEntry
                    key={index}
                    element={element}
                    index={index}
                    i18n={i18n}
                    i18nPriceOptions={i18nPriceOptions}
                    i18nSizeOptions={i18nSizeOptions}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SaveSearch;
