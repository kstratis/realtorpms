import React, { useState, useEffect, useRef } from 'react';
import URLSearchParams from '@ungap/url-search-params';
import { priceFilterOptions, renderHTML } from '../utilities/helpers';
import AsyncSelectContainer from './selects/AsyncSelectContainer';
import useFetch from '../hooks/useFetch';
import useModalToggle from '../hooks/useModalToggle';

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
              <RenderRow name={i18n.search_save_filters[objKey]} value={renderHTML(i18nSizeOptions[objValue])} index={index} />
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
            const locationValue = objValue
              .split(',')
              .map(element => {
                return element.split(':')[1];
              })
              .join(', ');
            return <RenderRow name={i18n.search_save_filters[objKey]} value={locationValue} index={index} />;
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
  favorites_url,
  property_id,
  clientsEndpoint,
  assignmentshipsEndpoint,
  i18n,
  i18nPriceOptions,
  i18nSizeOptions,
  i18nFloorOptions,
  i18nCategoryOptions
}) {
  const [currentParams, setCurrentParams] = useState([]);

  const [selectedOption, setSelectedOption] = useState('');

  const [selectionRequest, setSelectionRequest] = useState({});

  const [isFinished, setIsFinished] = useState(false);

  const didMountForSaveSearchRef = useRef(false);

  const { data, loading } = useFetch(selectionRequest, false, didMountForSaveSearchRef);

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

  const savePreferencesHandler = () => {
    if (!selectedOption) return;
    // DEBUG
    // console.log('setting ajax call - the option sent is:');
    // console.log(selectedOption);
    setSelectionRequest({
      url: assignmentshipsEndpoint,
      method: 'post',
      payload: { selection: selectedOption || [], searchstring: window.location.search },
      callback: () => setIsFinished(true)
    });
  };

  // This is executed as the action callback handler in AsyncSelect and passes over the selection in this component.
  const asyncSelectCallback = selection => {
    // DEBUG
    // console.log(selection);
    if (!selection) {
      console.log('no selection');
    }
    setSelectedOption(selection);
  };

  return (
    <div className="favlist-container mt-3">
      <div className="d-flex justify-content-center mt-2">
        <i className="pr-icon md disk" />
      </div>
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

        <div className={'row justify-content-center mb-4'}>
          <div className={'col-lg-8 col-sm-12'}>
            <AsyncSelectContainer
              id={'AsyncSelectContainer'}
              i18n={{
                select: {
                  placeholder: i18n.select.placeholder_clients,
                  noresults: i18n.select.noresults,
                  loading: i18n.select.loading,
                  feedback: i18n.select.clientship_feedback
                }
              }}
              isCreatable={true}
              isDisabled={isFinished}
              isClearable={true}
              collection_endpoint={{ url: clientsEndpoint, action: 'get' }}
              action_endpoint={{ url: '', action: '', callback: asyncSelectCallback }}
              storedOptions={[]}
              hasFeedback={false}
            />
            <div className={'text-center'}>
              <small className={'text-muted mt-1'}>{i18n.select.clientship_feedback}</small>
            </div>
          </div>
          <div className={'col-lg-4 col-sm-12 text-center'}>
            <button
              className={'btn btn-primary'}
              onClick={savePreferencesHandler}
              disabled={selectedOption && !isFinished ? '' : 'disabled'}>
              {`${isFinished && !loading ? i18n.select.saved_btn : i18n.select.save_btn}`}
            </button>
          </div>
        </div>
        {isFinished ? (
          <div className={'row justify-content-center text-center'}>
            <div className="col-lg-12">
              <div className="alert alert-success has-icon" role="alert">
                <div className="alert-icon">
                  <span className="oi oi-check"></span>
                </div>
                <span>{i18n.select.search_saved_success}</span>
              </div>
            </div>
          </div>
        ) : null}
        <div className={'row my-2'} />
      </div>
    </div>
  );
}

export default SaveSearch;
