import React, { useState, useRef } from 'react';
import AsyncSelectContainer from './selects/AsyncSelectContainer';
import useFetch from '../hooks/useFetch';
import useSearchParams from '../hooks/useSearchParams';
import ClientEntry from './ClientEntry';
import {
  categoryFilterOptions,
  floorFilterOptions,
  priceFilterOptions,
  renderHTML,
  sizeFilterOptions
} from '../utilities/helpers';
import AsyncSelect from './selects/AsyncSelect';
import useTooltips from '../hooks/useTooltips';
import usePopovers from '../hooks/usePopovers';
import Spinner from "../datatables/Spinner";

function MassAssignProperties({
                             child,
                             clientsEndpoint,
                             assignmentshipsEndpoint,
                             i18n,
                             i18nCfieldOptions,
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


  // useTooltips();
  // usePopovers();

  return (
    <>
      {/*<div className={'mt-3'}>*/}
      {/*  {avatar ? (*/}
      {/*    <figure className="user-avatar property-avatar user-avatar-xxl mx-auto d-block mb-3">*/}
      {/*      <img src={avatar} className={'rounded'} alt={'i18n.property_cover_alt'} />*/}
      {/*    </figure>*/}
      {/*  ) : null}*/}
      {/*  <h2>{renderHTML(modalHeader)}</h2>*/}
      {/*</div>*/}
      {/*<hr />*/}
      {/*<div className={'mb-3'}>*/}
      {/*  {loading ? (*/}
      {/*    <Spinner isLoading={loading} />*/}
      {/*  ) : (*/}
      {/*    <AsyncSelectContainer*/}
      {/*      id={'AsyncSelectContainerPartner'}*/}
      {/*      i18n={i18n}*/}
      {/*      collection_endpoint={{ url: partners_url, action: 'get' }}*/}
      {/*      action_endpoint={{ url: partners_action_endpoint, action: 'post' }}*/}
      {/*      storedOptions={data}*/}
      {/*      openMenuOnClick={openMenuOnClick}*/}
      {/*      closeMenuOnSelect={closeMenuOnSelect}*/}
      {/*      hasFeedback={hasFeedback}*/}
      {/*      isMultiple={isMultiple}*/}
      {/*      defaultOptions={defaultOptions}*/}
      {/*    />*/}
      {/*  )}*/}
      {/*</div>*/}
    </>
  );
}

export default MassAssignProperties;
