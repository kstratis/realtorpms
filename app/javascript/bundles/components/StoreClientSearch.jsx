import React, { useState, useRef } from 'react';
import AsyncSelectContainer from './selects/AsyncSelectContainer';
import useFetch from '../hooks/useFetch';
import useSearchParams from '../hooks/useSearchParams';
import RenderEntry from './RenderEntry';
import {
  categoryFilterOptions,
  floorFilterOptions,
  priceFilterOptions,
  renderHTML,
  sizeFilterOptions
} from '../utilities/helpers';

function StoreClientSearch({
  child,
  clientsEndpoint,
  assignmentshipsEndpoint,
  i18n,
  i18nPriceOptions,
  i18nSizeOptions,
  i18nFloorOptions,
  i18nCategoryOptions
}) {
  const [selectedOption, setSelectedOption] = useState('');
  const [selectionRequest, setSelectionRequest] = useState({});
  const [remoteResponse, setRemoteResponse] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const didMountForSaveSearchRef = useRef(false);
  const { data, loading } = useFetch(selectionRequest, false, didMountForSaveSearchRef);
  const params = useSearchParams(window.location.search);

  const savePreferencesHandler = () => {
    if (!selectedOption) return;
    // DEBUG
    // console.log('setting ajax call - the option sent is:');
    // console.log(selectedOption);
    setSelectionRequest({
      url: assignmentshipsEndpoint,
      method: 'post',
      payload: { selection: selectedOption || [], searchstring: window.location.search },
      callback: response => {
        // DEBUG
        // console.log(response);
        setRemoteResponse(response);
        setIsFinished(true);
      }
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
        <h3>{i18n.search_save_subtitle}</h3>
        <div className={'col-12'}>
          <table className="table table-striped">
            <tbody>
              {params.map((element, index) => {
                return (
                  <RenderEntry
                    key={index}
                    element={element}
                    index={index}
                    i18n={i18n}
                    i18nPriceOptions={priceFilterOptions(i18nPriceOptions)}
                    i18nSizeOptions={sizeFilterOptions(i18nSizeOptions)}
                    i18nFloorOptions={floorFilterOptions(i18nFloorOptions)}
                    i18nCategoryOptions={categoryFilterOptions(i18nCategoryOptions)}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
        {child === 'SaveSearchAlt' ? (
          ''
        ) : (
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
        )}
        {isFinished ? (
          <div className={'row justify-content-center text-center'}>
            <div className="col-lg-12">
              <div className="alert alert-success has-icon" role="alert">
                <div className="alert-icon">
                  <span className="oi oi-check" />
                </div>
                <span>{renderHTML(remoteResponse)}</span>
              </div>
            </div>
          </div>
        ) : null}
        <div className={'row my-2'} />
      </div>
    </div>
  );
}

export default StoreClientSearch;
