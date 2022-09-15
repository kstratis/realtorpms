import React, { useState, useEffect, useRef } from 'react';
import { useStateWithCallbackLazy } from 'use-state-with-callback';
import ListPicker from './ListPicker';
import useFetch from '../hooks/useFetch';
import { objectToUrlParams, renderHTML } from '../utilities/helpers';
import useDebounce from '../hooks/useDebounce';

function AddRemoveProperties({
  handlePageParent,
  properties_action_endpoint,
  properties_list_search_url,
  initial_data_url,
  modalHeader,
  avatar,
  i18n,
}) {
  const [searchInput, setSearchInput] = useStateWithCallbackLazy('');
  const [page, setPage] = useStateWithCallbackLazy(1);

  const [request, setRequest] = useState({
    url: initial_data_url,
    method: 'get',
    payload: {},
  });

  // i.e. const refContainer = useRef(initialValue);
  // FROM THE DOCS: useRef returns a **mutable ref object** whose .current property is initialized to the passed argument (initialValue).
  const fireAjaxOnMount = useRef(true); // Here the .current property of the mutable object is set to true
  const { data, loading } = useFetch(request, false, fireAjaxOnMount, true);

  const firstUpdate = useRef(true);

  const debouncedSearchInput = useDebounce(searchInput, 300);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    const urlParams = objectToUrlParams({ search: debouncedSearchInput });
    setRequest({
      url: `${properties_list_search_url}?${urlParams}`,
      method: 'get',
      payload: {},
    });
  }, [debouncedSearchInput]);

  const calculatePageCount = (totalEntries, resultsPerPage) => {
    return Math.ceil(totalEntries / resultsPerPage);
  };

  const handleAssignProperty = (e, property_id, currentPage) => {
    e.preventDefault();
    handlePageParent(true);
    setRequest({
      url: properties_action_endpoint,
      method: 'post',
      payload: {
        pid: property_id,
        page: currentPage,
        search: searchInput,
      },
    });
  };

  const handlePageClick = (pageNumber, pageNo = false, browserButtonInvoked = false) => {
    // DEBUG
    // console.log(`nextPage is: ${nextPage}`)
    const nextPage = pageNumber.selected + 1;
    setPage(nextPage, () => {
      const urlParams = objectToUrlParams({ page: nextPage, search: searchInput });
      setRequest({
        url: `${initial_data_url}?${urlParams}`,
        method: 'get',
        payload: {},
      });
    });
  };

  return (
    <>
      <div>
        {avatar ? (
          <figure className="user-avatar property-avatar user-avatar-xxl mx-auto d-block mb-3">
            <img src={avatar} className={'rounded'} alt={'i18n.property_cover_alt'} />
          </figure>
        ) : null}
        <h2>{renderHTML(modalHeader)}</h2>
      </div>
      <div className={'mb-3'}>
        <ListPicker
          i18n={i18n}
          isLoading={loading}
          data={data}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          handlePageClick={handlePageClick}
          handleAssignProperty={handleAssignProperty}
          calculatePageCount={calculatePageCount}
        />
      </div>
      {i18n.modal.hasFeedback ? <small className="form-text text-muted">{renderHTML(i18n.modal.feedback)}</small> : ''}
    </>
  );
}

export default AddRemoveProperties;
