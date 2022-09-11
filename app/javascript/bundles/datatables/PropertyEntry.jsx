import {hasParams, renderHTML} from '../utilities/helpers';
import React from 'react';
import PropTypes from 'prop-types';

class PropertyEntry extends React.Component {
  constructor(props) {
    super(props);
  }

  isVisited() {
    if (!this.props.visited) return false;

    return this.props.visited.includes(this.props.entry['slug'])
  }

  render() {
    return (
      <div className={`${this.props.filtersOpen ? 'col-lg-6 col-xl-12' : 'col-lg-6'}`}>
        <div className={`text-center text-md-left`}>
          <div className={`card card-figure card-figure-custom d-block d-sm-none ${ this.props.active ? '' : 'opaque' }`}>
            <a
              className={'property-entry'}
              href={this.props.entry['allow_view'] ? this.props.entry['view_entity_path'] : ''}>
              <figure className="figure">
                <div className={`${this.props.entry['allow_view'] ? '' : 'frosty'}`}>
                  {this.props.entry['avatar'] ? (
                    <img src={this.props.entry['avatar']} alt="placeholder image" className={'img-fluid'} />
                  ) : (
                    <i className={'pr-icon md house-avatar-placeholder'} />
                  )}
                </div>
                {this.props.entry['allow_view'] ? (
                  <figcaption className="figure-caption">
                    <h6 className="figure-title figure-title-custom">{renderHTML(this.props.entry.mini_heading)}</h6>

                    <p className="text-muted mb-0 pb-1">{this.props.entry.location}</p>
                    <p className="text-muted mb-0 pt-1">
                      <span className={'highlighted-bg highlighted-fg p-1 '}>
                        {this.props.entry.purpose}
                        {this.props.entry.price ? renderHTML(` &middot; ${this.props.entry.price}`, 'inline') : ''}
                      </span>
                    </p>
                  </figcaption>
                ) : (
                  <div className={'col-12'}>
                    <div>
                      <h2>
                        {this.props.entry['slug'].toUpperCase()}&nbsp;
                        <i className={'fas fa-qrcode fa-fw'} />
                      </h2>
                    </div>
                    <div className={'text-center'}>
                      <h3>{this.props.entry['access_msg']}</h3>
                    </div>
                  </div>
                )}
              </figure>
            </a>
          </div>

          <div className={`list-group list-group-media mb-3 d-none d-sm-block ${ this.props.active ? '' : 'opaque' }`}>
            <a
              data-toggle={this.props.active ? '' : 'tooltip'} data-placement={'right'} title={this.props.active ? '' : this.props.i18n['status_inactive']}
              href={this.props.entry['allow_view'] ? this.props.entry['view_entity_path'] : ''}
              className={`list-group-item list-group-item-action property-index-avatar ${
                this.props.entry['website_enabled'] ? 'on' : 'off'
              }`}>
              <div className={`d-flex justify-content-end ${this.props.entry['pinned'] || this.props.entry['website_enabled'] ? 'badges' : ''} `}>
                {this.props.entry['pinned'] ? <div className="pinned-badge pinned-bookmark" data-toggle="tooltip" data-position="top" title={this.props.i18n['pinned']}><i className="fas fa-bookmark"/></div> : '' }
                {this.props.entry['website_enabled'] ? <div className="pinned-badge pinned-globe" data-toggle="tooltip" data-position="top" title={this.props.i18n['website_enabled']}><i className="fas fa-search"/></div> : '' }
                {this.isVisited() ? <div className="pinned-badge pinned-client-visited" data-toggle="tooltip" data-position="top" title={this.props.i18n['client_has_visited']}><i className="fas fa-expand"/></div> : '' }
              </div>
              <div className="list-group-item-figure rounded-left ">
                <div className={`spitogatos-container ${this.props.spitogatosEnabled ? '' : 'd-none'}`}>
                  <button
                      data-toggle="tooltip"
                      data-placement="auto"
                      onClick={e => this.props.handleSpitogatosSync(e, this.props.entry['sync_entity_path'], this.props.entry['id'])}
                      title={this.props.i18n['sync']['spitogatos_label']}
                      className={`btn btn-sm btn-secondary btn-action mr-0 text-center ${this.props.entry['spitogatos_sync'] ? 'active btn-spitogatos' : ''}`}>
                      <svg width="20px" height="20px" viewBox="0 0 333 270" xmlns="http://www.w3.org/2000/svg">
                        <g id="spitogatos_logo" fill="#ffffff" fillRule="nonzero">
                          <path d="M166.522 265C66.236 265 26.956 196.536 8.166 158.9l-5.858-11.494c-5.141-10.105-1.42-22.464 8.448-28.054l28.095-15.863c1.726-.869 2.75-2.613 3.268-4.524l14.646-71.779a38.521 38.521 0 0 1 2.929-8.887C64.689 8.377 73.648 1.58 84.169.36c1.356-.172 2.75-.351 4.304-.172 11.537-.524 23.26 5.916 31.53 16.886l20.336 24.756a6.309 6.309 0 0 0 4.995 2.428h42.913c1.893 0 3.786-.875 4.989-2.428l20.337-24.93C221.663 5.943 233.559-.337 245.12.014c1.202 0 2.577 0 4.131.173 12.062 1.392 22.57 10.446 26.529 23.172l.351 1.387 14.985 74.06a6.714 6.714 0 0 0 3.28 4.51l28.089 16.036c9.657 5.399 13.27 17.953 8.27 27.875l-5.693 11.321C306.113 196.53 266.66 265 166.547 265h-.025ZM35.404 137.477a6.635 6.635 0 0 0-2.59 8.893c26.195 52.262 60.654 90.761 133.9 90.761 73.054 0 107.519-38.5 133.708-90.94a6.58 6.58 0 0 0-2.59-8.714l-23.766-13.589c-.357-.172-.69-.333-1.036-.696a21.79 21.79 0 0 1-7.763-12.72L249.419 31.9c-.863-1.91-2.239-3.303-3.453-3.488h-1.9c-2.072-.167-5.34 1.405-8.614 5.934l-.352.524-24.296 29.798a27.303 27.303 0 0 1-4.483 4.523l-2.226 1.745-2.763.69a25.543 25.543 0 0 1-6.37.869H138.6c-2.226 0-4.464-.173-6.376-.87l-2.744-.702-2.244-1.744a27.68 27.68 0 0 1-4.477-4.523L98.123 34.52c-3.465-4.702-6.906-6.107-8.787-6.107h-1.918c-1.375.185-2.762 1.583-3.613 3.488l-15.848 78.398a23.688 23.688 0 0 1-8.263 13.417l-1.388.869-22.915 12.892h.013Z" fill={`${this.props.entry['spitogatos_sync'] ? '#FFFFFF' : '#FE900A'}`} />
                        </g>
                      </svg>
                  </button>
                </div>
                <div className={`thumb-container ${this.props.entry['allow_view'] ? '' : 'frosty'}`}>
                  {this.props.entry['avatar'] ? (
                    <img src={this.props.entry['avatar']} alt="placeholder image" className={'thumb'} />
                  ) : (
                    <i className={'pr-icon md house-avatar-placeholder'} />
                  )}
                </div>
              </div>
              <div className={`card-businesstype-header ${this.props.entry['allow_view'] ? '' : 'frosty'}`}>
                <span className={'highlighted-bg highlighted-fg'}>{this.props.entry.purpose}</span>
              </div>
              <div className="list-group-item-body custom-list-group-item-body-padding">
                <div className={'row d-flex justify-content-end'}>
                  {!this.props.entry['allow_view'] ? (
                    <div className={'col-12'}>
                      <div>
                        <h2>
                          {this.props.entry['slug'].toUpperCase()}&nbsp;
                          <i className={'fas fa-qrcode fa-fw'} />
                        </h2>
                      </div>
                      <div className={'text-center'}>
                        <h3>{this.props.entry['access_msg']}</h3>
                      </div>
                    </div>
                  ) : (
                    <>
                      {this.props.entry['sample'] ? <div className="sample-ribbon">{this.props.i18n['sample']}</div> : '' }
                      <table className="table table-property-entry table-borderless">
                        <tbody>
                          <tr>
                            <td className={'text-left'}>
                              <i className={'fas fa-cube fa-fw'} />
                              &nbsp;
                              {renderHTML(this.props.entry.mini_heading, 'inline')}
                            </td>
                            <td className={'text-right'}>
                              <span>{this.props.entry['slug'].toUpperCase()}</span>&nbsp;
                              <i className={'fas fa-qrcode fa-fw'} />
                            </td>
                          </tr>
                          <tr>
                            <td className={'text-left'}>
                              <i className={'fas fa-map fa-fw'} />
                              &nbsp;
                              <strong>{this.props.entry.location}</strong>
                            </td>
                            <td className={'text-right text-nowrap'}>{this.props.entry.price}</td>
                          </tr>

                          <tr>
                            {this.props.entry.registration ? (
                              <td className={'text-left'}>
                                <i className={'fas fa-calendar fa-fw'} />
                                &nbsp;
                                {this.props.entry.registration}
                              </td>
                            ) : null}
                            {this.props.entry.price &&
                            this.props.entry.size &&
                            this.props.entry.businesstype === 'sell' ? (
                              <td className={'text-right text-nowrap'}>
                                {renderHTML(this.props.entry.pricepersize, 'inline')}
                              </td>
                            ) : null}
                          </tr>

                          {this.props.entry.description ? (
                            <tr className={'description-border'}>
                              <td colSpan={'2'}>
                                <span className={'clamp-3'}>{this.props.entry.description}</span>
                              </td>
                            </tr>
                          ) : null}
                        </tbody>
                      </table>
                      {this.props.showControls ? (
                        <div className={'properties-listing-controls d-flex justify-content-center'}>
                          {this.props.entry['userEditable'] ?
                          <div
                            title={this.props.i18n.edit}
                            className={'edit-button control-button'}
                            onClick={e => {
                              e.preventDefault();
                              Turbolinks.visit(this.props.entry['edit_entity_path']);
                            }}>
                            <i className={`fas fa-pen fa-fw`} />
                          </div> : '' }
                          <div
                            title={this.props.i18n.clone.label}
                            className={'clone-button control-button'}
                            onClick={e => {
                              if (window.confirm(this.props.i18n.clone.prompt)) {
                                this.props.handleClone(e, this.props.entry['clone_entity_path']);
                              } else {
                                // handleClone already takes care of preventDefault.
                                // We need to use it here as well since canceling the action
                                // will invoke the normal browser click since property entry
                                // is an href
                                e.preventDefault();
                              }
                            }}>
                            <i className={'fas fa-clone fa-fw'} />
                          </div>
                        </div>
                      ) : (
                        ''
                      )}
                    </>
                  )}
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

PropertyEntry.propTypes = {
  entry: PropTypes.object,
  filtersOpen: PropTypes.bool,
  handleClone: PropTypes.func,
  i18n: PropTypes.any,
};

export default PropertyEntry;
