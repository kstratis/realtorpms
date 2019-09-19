import PropTypes from 'prop-types';
import React from 'react';
import Spinner from './Spinner';
import ShowUserFavListWithDatatable from './ShowUserFavList';
import axios from 'axios';
import { ifExists } from '../utilities/helpers';

class Favlists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: this.props.initial_favlist_id ? this.props.initial_favlist_id : -1,
      resultsPerPage: 10,
      isLoadingFavlist: false,
      dataset: ifExists(this.props.initial_payload, 'dataset_wrapper'),
      isLoading: false,
      pageCount:
        ifExists(this.props.initial_payload, 'total_entries') &&
        ifExists(this.props.initial_payload, 'results_per_page')
          ? Math.ceil(this.props.initial_payload.total_entries / this.props.initial_payload.results_per_page)
          : '',
      count: ifExists(this.props.initial_payload, 'total_entries'),
      current_page: ifExists(this.props.initial_payload, 'current_page'),
      total_entries: ifExists(this.props.initial_payload, 'total_entries'),
      object_type: 'favlists',
      favlists_endpoint: ifExists(this.props.initial_payload, 'favlists_endpoint')
    };
    this.handleFavlist = this.handleFavlist.bind(this);
  }

  handleFavlist(e, favlist_id) {
    e.preventDefault();
    this.setState({
      selectedIndex: favlist_id,
      isLoadingFavlist: true
    });
    // Dynamically construct the next favlist's url.
    const newUrl = `/favlists/${favlist_id}`;
    history.replaceState(null, '', newUrl);
    axios.get(`${newUrl}.json`).then(
      function(response) {
        this.setState({
          dataset: response.data.datalist,
          pageCount: Math.ceil(response.data.total_entries / this.state.resultsPerPage),
          isLoading: false,
          count: response.data.total_entries,
          selectedPage: response.data.current_page - 1,
          current_page: response.data.current_page,
          total_entries: response.data.total_entries,
          isLoadingFavlist: false,
          favlists_endpoint: newUrl
        });
      }.bind(this)
    );
  }

  render() {
    return (
      <>
        {this.props.favlists.length > 0 ? (
          <>
            <div className={'row'}>
              <div className="col-sm-12 col-lg-4">
                <div className="list-group list-group-bordered mb-3">
                  {this.props.favlists.map(entry => (
                    <div className={'d-flex'}>
                      <a
                        className={`flex-fill custom-list-group-item list-group-item list-group-item-action list-group-item-${
                          this.state.selectedIndex === entry['id'] ? 'success' : 'danger'
                        }`}
                        key={entry['id']}
                        href=""
                        onClick={e => this.handleFavlist(e, entry['id'])}>
                        {entry['name']}
                      </a>
                      <div className={'custom-list-button'}>
                        <a
                          className={'btn btn-icon btn-light list-group-item-action text-center'}
                          href={`/favlists/${entry['id']}`}
                          data-method="delete"
                          data-confirm={this.props.i18n['prompt']}>
                          <i className="fas fa-trash" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {this.state.selectedIndex > -1 ? (
                this.state.isLoadingFavlist ? (
                  <Spinner isLoading={this.state.isLoadingFavlist} version={1} />
                ) : (
                  <div className={'col-sm-12 col-lg-8'}>
                    <ShowUserFavListWithDatatable
                      initial_payload={{
                        dataset_wrapper: this.state.dataset,
                        results_per_page: this.state.resultsPerPage,
                        total_entries: this.state.total_entries,
                        current_page: this.state.current_page,
                        object_type: this.state.object_type,
                        favlists_endpoint: this.state.favlists_endpoint
                      }}
                      i18n={this.props.i18n}
                    />
                  </div>
                )
              ) : (
                <div className="col-lg-8">
                  <div className={'no-entries'}>
                    <i className="nothing-yet" />
                    <h3 className={'mt-2'}>{this.props.i18n['pick_list_prompt']}</h3>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="col-12">
            <div className={'no-entries'}>
              <i className="no-results"> </i>
              <h3>{this.props.i18n['no_results']}</h3>
            </div>
          </div>
        )}
      </>
    );
  }
}

Favlists.propTypes = {
  favlists: PropTypes.array,
  i18n: PropTypes.object
};

export default Favlists;
