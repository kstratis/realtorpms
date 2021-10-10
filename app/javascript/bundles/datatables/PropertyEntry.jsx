import { renderHTML } from '../utilities/helpers';
import React from 'react';
import PropTypes from 'prop-types';

class PropertyEntry extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className={`${this.props.filtersOpen ? 'col-lg-12' : 'col-lg-6'}`}>
        <div className={`text-center text-md-left`}>
          <div className="card card-figure card-figure-custom d-block d-sm-none">
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

          <div className="list-group list-group-media mb-3 d-none d-sm-block">
            <a
              href={this.props.entry['allow_view'] ? this.props.entry['view_entity_path'] : ''}
              className={`list-group-item list-group-item-action property-index-avatar ${
                this.props.entry['website_enabled'] ? 'on' : 'off'
              }`}>
              <div className={`d-flex justify-content-end ${this.props.entry['pinned'] || this.props.entry['website_enabled'] ? 'badges' : ''} `}>
                {this.props.entry['pinned'] ? <div className="pinned-bookmark" data-toggle="tooltip" data-position="top" title={this.props.i18n['pinned']}><i className="fas fa-bookmark"/></div> : '' }
                {this.props.entry['website_enabled'] ? <div className="pinned-globe" data-toggle="tooltip" data-position="top" title={this.props.i18n['website_enabled']}><i className="fas fa-globe"/></div> : '' }
              </div>
              <div className="list-group-item-figure rounded-left ">
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
                                {renderHTML(this.props.entry.pricepersqmeter, 'inline')}
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
                            <i className={'fas fa-copy fa-copy-on fa-fw'} />
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
