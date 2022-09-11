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
  set_sync_spitogatos_property_url,
  get_sync_spitogatos_property_url,
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

  // Spitogatos toggle
  const [spitogatosRequest, setSpitogatosRequest] = useState({
    url: `${get_sync_spitogatos_property_url}.json`,
    method: 'get',
    payload: {},
  });

  const { data: spitogatosData, loading: spitogatosLoading } = useFetch(spitogatosRequest, false, fireOnMount);

  const handleSpitogatosSetRequest = request => setSpitogatosRequest(request);

  const handleSpitogatosChange = e => {
    handleSpitogatosSetRequest({
      url: `${set_sync_spitogatos_property_url}.json`,
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
          <strong>{i18n['sync_title']}:</strong>
        </div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="custom-control custom-switch d-block">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  name={'property_spitogatos_toggle'}
                  id={'property_spitogatos_toggle'}
                  checked={!!spitogatosData.spitogatos_sync}
                  onChange={e => handleSpitogatosChange(e)}
                />
                <label className="custom-control-label cursor-pointer" htmlFor={'property_spitogatos_toggle'}>
                  {renderHTML(i18n['sync_spitogatos'], 'inline')}&nbsp;&nbsp;
                  <span>
                    <svg width="20px" height="20px" viewBox="0 0 333 270" xmlns="http://www.w3.org/2000/svg">
                      <g id="spitogatos_logo" fill="#ffffff" fillRule="nonzero">
                        <path
                          d="M166.522 265C66.236 265 26.956 196.536 8.166 158.9l-5.858-11.494c-5.141-10.105-1.42-22.464 8.448-28.054l28.095-15.863c1.726-.869 2.75-2.613 3.268-4.524l14.646-71.779a38.521 38.521 0 0 1 2.929-8.887C64.689 8.377 73.648 1.58 84.169.36c1.356-.172 2.75-.351 4.304-.172 11.537-.524 23.26 5.916 31.53 16.886l20.336 24.756a6.309 6.309 0 0 0 4.995 2.428h42.913c1.893 0 3.786-.875 4.989-2.428l20.337-24.93C221.663 5.943 233.559-.337 245.12.014c1.202 0 2.577 0 4.131.173 12.062 1.392 22.57 10.446 26.529 23.172l.351 1.387 14.985 74.06a6.714 6.714 0 0 0 3.28 4.51l28.089 16.036c9.657 5.399 13.27 17.953 8.27 27.875l-5.693 11.321C306.113 196.53 266.66 265 166.547 265h-.025ZM35.404 137.477a6.635 6.635 0 0 0-2.59 8.893c26.195 52.262 60.654 90.761 133.9 90.761 73.054 0 107.519-38.5 133.708-90.94a6.58 6.58 0 0 0-2.59-8.714l-23.766-13.589c-.357-.172-.69-.333-1.036-.696a21.79 21.79 0 0 1-7.763-12.72L249.419 31.9c-.863-1.91-2.239-3.303-3.453-3.488h-1.9c-2.072-.167-5.34 1.405-8.614 5.934l-.352.524-24.296 29.798a27.303 27.303 0 0 1-4.483 4.523l-2.226 1.745-2.763.69a25.543 25.543 0 0 1-6.37.869H138.6c-2.226 0-4.464-.173-6.376-.87l-2.744-.702-2.244-1.744a27.68 27.68 0 0 1-4.477-4.523L98.123 34.52c-3.465-4.702-6.906-6.107-8.787-6.107h-1.918c-1.375.185-2.762 1.583-3.613 3.488l-15.848 78.398a23.688 23.688 0 0 1-8.263 13.417l-1.388.869-22.915 12.892h.013Z"
                          fill="#FE900A"
                        />
                      </g>
                    </svg>
                  </span>
                </label>
                {spitogatosLoading ? (
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
