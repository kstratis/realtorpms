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
            <a href={this.props.entry['allow_view'] ? this.props.entry['view_entity_path'] : ''}>
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
                      <h2>{this.props.entry['slug'].toUpperCase()}</h2>
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
              className="list-group-item list-group-item-action property-index-avatar">
              <div className="list-group-item-figure rounded-left ">
                <div className={`thumb-container ${this.props.entry['allow_view'] ? '' : 'frosty'}`}>
                  {this.props.entry['avatar'] ? (
                    <img src={this.props.entry['avatar']} alt="placeholder image" className={'thumb'} />
                  ) : (
                    <i className={'pr-icon md house-avatar-placeholder'} />
                  )}
                </div>
              </div>
              <div className="list-group-item-body custom-list-group-item-body-padding">
                <div className={'row'}>
                  {!this.props.entry['allow_view'] ? (
                    <div className={'col-12'}>
                      <div>
                        <h2>{this.props.entry['slug'].toUpperCase()}</h2>
                      </div>
                      <div className={'text-center'}>
                        <h3>{this.props.entry['access_msg']}</h3>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className={'col-sm-12 col-md-8 d-none d-sm-block main-info'}>
                        <h4 className="list-group-item-title clamp-1">{renderHTML(this.props.entry.mini_heading)}</h4>
                        <p className="">{this.props.entry.location}</p>
                        <p className="list-group-item-text clamp-2">
                          <strong>{this.props.entry.registration}</strong>
                          {this.props.entry.description ? ` - ${this.props.entry.description}` : ''}
                        </p>
                        <strong className={'d-inline-block pt-1'}>
                          <small className="list-group-item-text text-center extra-index-info-alt highlighted-bg highlighted-fg px-1 w-80 rounded">
                            {this.props.entry.purpose}{' '}
                            {this.props.entry.price ? renderHTML(`&middot; ${this.props.entry.price}`, 'inline') : ''}
                          </small>
                          <small className={'list-group-item-text extra-index-info-alt pt-2 text-left index-slug'}>
                            <strong className={'d-inline-block w-80 rounded text-center'}>
                              {this.props.entry['slug'].toUpperCase()}
                            </strong>
                          </small>
                        </strong>
                      </div>
                      <div className={'col-lg-4 col-md-4 d-none d-md-block extra-index-info'}>
                        <div className={'text-right'}>
                          <span className="d-inline-block list-group-item-text p-2 purpose">
                            {this.props.entry.purpose}
                          </span>
                        </div>
                        <div className={'text-right'}>
                          <span className="d-inline-block list-group-item-text pt-1">{this.props.entry.price}</span>
                        </div>
                        <div className={'text-right'}>
                          <span className="list-group-item-text">{renderHTML(this.props.entry.size)}</span>
                        </div>
                        <div className={'text-right pb-3'}>
                          <span className="list-group-item-text">{renderHTML(this.props.entry.pricepersqmeter)}</span>
                        </div>
                        <div className={'text-right'}>
                          <span className="list-group-item-text uid p-2">
                            <strong>{this.props.entry['slug'].toUpperCase()}</strong>
                          </span>
                        </div>
                      </div>
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
  filtersOpen: PropTypes.bool
};

export default PropertyEntry;
