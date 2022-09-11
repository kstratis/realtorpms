import React, { useState, useRef } from 'react';
import { renderHTML } from '../utilities/helpers';
import useFetch from '../hooks/useFetch';
import useTooltips from '../hooks/useTooltips';
import usePopovers from '../hooks/usePopovers';

function PromotionOptions({
  i18n,
  get_sync_active_property_url,
  set_sync_active_property_url,
  set_sync_website_property_url,
  get_sync_website_property_url,
  set_sync_pinned_property_url,
  get_sync_pinned_property_url,
  handlePageParent,
}) {
  const fireOnMount = useRef(true);

  // Website toggle
  const [websiteRequest, setWebsiteRequest] = useState({
    url: `${get_sync_website_property_url}.json`,
    method: 'get',
    payload: {},
  });

  const { data: websiteData, loading: websiteLoading } = useFetch(websiteRequest, false, fireOnMount);

  const handleWebsiteSetRequest = request => setWebsiteRequest(request);

  const handleWebsiteChange = e => {
    handleWebsiteSetRequest({
      url: `${set_sync_website_property_url}.json`,
      method: 'post',
      payload: {},
    });
  };

  // Pinned toggle
  const [pinnedRequest, setPinnedRequest] = useState({
    url: `${get_sync_pinned_property_url}.json`,
    method: 'get',
    payload: {},
  });

  const { data: pinnedData, loading: pinnedLoading } = useFetch(pinnedRequest, false, fireOnMount);

  const handlePinnedSetRequest = request => setPinnedRequest(request);

  const handlePinnedChange = e => {
    handlePinnedSetRequest({
      url: `${set_sync_pinned_property_url}.json`,
      method: 'post',
      payload: {},
    });
  };

  // Active property toggle
  const [activeRequest, setActiveRequest] = useState({
    url: `${get_sync_active_property_url}.json`,
    method: 'get',
    payload: {},
  });

  const { data: activeData, loading: activeLoading } = useFetch(activeRequest, false, fireOnMount);

  const handleActiveSetRequest = request => setActiveRequest(request);

  const handleActiveChange = e => {
    handlePageParent(true);
    handleActiveSetRequest({
      url: `${set_sync_active_property_url}.json`,
      method: 'post',
      payload: {},
    });
  };

  useTooltips();
  usePopovers();

  return (
    <div>
      <div className="property-quick-actions-container">
        <div className="col-12 mb-2">
          <strong>{i18n['portal_title']}:</strong>
        </div>

        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="custom-control custom-switch d-block">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  name={'property_website_toggle'}
                  id={'property_website_toggle'}
                  checked={!!websiteData.website_enabled}
                  onChange={e => handleWebsiteChange(e)}
                />
                <label className="custom-control-label cursor-pointer" htmlFor={'property_website_toggle'}>
                  {renderHTML(i18n['show_on_portal'])}
                </label>
                {websiteLoading ? (
                  <span>
                    &nbsp;
                    <i className="fas fa-cog fa-spin" />
                  </span>
                ) : null}
              </div>

              <div className="custom-control custom-switch d-block">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  name={'property_pinned_toggle'}
                  id={'property_pinned_toggle'}
                  checked={!!pinnedData.pinned}
                  onChange={e => handlePinnedChange(e)}
                />
                <label className="custom-control-label cursor-pointer" htmlFor={'property_pinned_toggle'}>
                  {renderHTML(i18n['pin_html'])}
                </label>
                {pinnedLoading ? (
                  <span>
                    &nbsp;
                    <i className="fas fa-cog fa-spin" />
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <hr />

        <div className="col-12 mb-2">
          <strong>{i18n['status_title']}:</strong>
        </div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="custom-control custom-switch d-block">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  name={'property_active_toggle'}
                  id={'property_active_toggle'}
                  checked={!!activeData.active}
                  onChange={e => handleActiveChange(e)}
                />
                <label className="custom-control-label cursor-pointer" htmlFor={'property_active_toggle'}>
                  {renderHTML(i18n['set_available'])}
                </label>
                {activeLoading ? (
                  <span>
                    &nbsp;
                    <i className="fas fa-cog fa-spin" />
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PromotionOptions;
