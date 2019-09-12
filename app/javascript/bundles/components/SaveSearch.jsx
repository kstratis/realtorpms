import React, { useState, useEffect, useRef } from 'react';
import URLSearchParams from '@ungap/url-search-params';
import { priceFilterOptions, renderHTML } from '../utilities/helpers';
import AsyncSelectContainer from './selects/AsyncSelectContainer';

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

function RenderEntry({
  element,
  index,
  i18n,
  i18nPriceOptions,
  i18nSizeOptions,
  i18nFloorOptions,
  i18nCategoryOptions
}) {
  return (
    <>
      {(() => {
        const objKey = Object.keys(element)[0];
        const objValue = Object.values(element)[0];
        // DEBUG
        // console.log(objKey, objValue);
        switch (true) {
          case ['pricemin', 'pricemax'].includes(objKey):
            return (
              <RenderRow name={i18n.search_save_filters[objKey]} value={i18nPriceOptions[objValue]} index={index} />
            );
          case ['sizemin', 'sizemax'].includes(objKey):
            return (
              <RenderRow name={i18n.search_save_filters[objKey]} value={i18nSizeOptions[objValue]} index={index} />
            );
          case ['floorsmin', 'floorsmax'].includes(objKey):
            return (
              <RenderRow name={i18n.search_save_filters[objKey]} value={i18nFloorOptions[objValue]} index={index} />
            );
          case ['category', 'subcategory'].includes(objKey):
            return (
              <RenderRow name={i18n.search_save_filters[objKey]} value={i18nCategoryOptions[objValue]} index={index} />
            );
          case ['purpose'].includes(objKey):
            return (
              <RenderRow
                name={i18n.search_save_filters[objKey]}
                value={i18n.search_save_filters[objValue]}
                index={index}
              />
            );
          case ['locations'].includes(objKey):
            const locationValue = objValue.split(',').map((element) => {return element.split(':')[1]}).join(', ');
            return (
              <RenderRow name={i18n.search_save_filters[objKey]} value={locationValue} index={index} />
            );
          case ['roomsmin', 'roomsmax'].includes(objKey):
          case ['constructionmin', 'constructionmax'].includes(objKey):
            return <RenderRow name={i18n.search_save_filters[objKey]} value={objValue} index={index} />;
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
  i18nSizeOptions,
  i18nFloorOptions,
  i18nCategoryOptions
}) {
  const [currentParams, setCurrentParams] = useState([]);
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const searchParamsObjectified = [];
    for (let pair of searchParams.entries()) {
      searchParamsObjectified.push({ [pair[0]]: pair[1] });
    }
    // DEBUG
    // console.log(searchParamsObjectified);
    setCurrentParams(searchParamsObjectified);
  }, []);

  return (
    <div className="favlist-container mt-3">
      <div className="d-flex justify-content-center mt-2">
        <i className="pr-icon md disk" />
      </div>

      {/*<hr />*/}
      <div className={'favlist-body mt-2'}>
        <h3>{i18n.search_save_criteria}</h3>
        <div className={'col-12'}>
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
                    i18nFloorOptions={i18nFloorOptions}
                    i18nCategoryOptions={i18nCategoryOptions}
                  />
                );
              })}
            </tbody>
          </table>

        </div>
        <div className={'row'}>
          <div className={'col-lg-6 offset-lg-3 col-sm-12 mb-5'}>
            <AsyncSelectContainer
              id={'AsyncSelectContainer'}
              i18n={{
                select: {
                  placeholder: i18n.select.placeholder_clients,
                  noresults: i18n.select.noresults,
                  loading: i18n.select.loading_html,
                  feedback: i18n.select.clientship_feedback
                }
              }}
              collection_endpoint={{ url: '', action: 'get' }}
              action_endpoint={{ url: '', action: '', callback: '' }}
              storedOptions={[]}
              hasFeedback={false}

            />
            <div className={'text-center'}>
              <small className={'text-muted mt-1'}>{i18n.select.clientship_feedback}</small>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default SaveSearch;
