import PropTypes from 'prop-types';
import React from 'react';
import Spinner from './Spinner';
import SortFilter from './SortFilter';
import ShowUserFavListWithDatatable from './ShowUserFavList';
import axios from 'axios';
import URLSearchParams from '@ungap/url-search-params';

class Favlists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: -1,
      resultsPerPage: 10,
      initial_payload: {
        dataset_wrapper: {
          dataset: '',
          pageCount: '',
          isLoading: false,
          count: '',
          selectedPage: '',

        }
      }


      // dataset: this.props.initial_payload.dataset_wrapper.dataset,
      // resultsPerPage: this.props.initial_payload.results_per_page,
      // isLoading: false,
      // pageCount: Math.ceil(this.props.initial_payload.total_entries / this.props.initial_payload.results_per_page),
      // count: this.props.initial_payload.total_entries,

    };
    this.handleFavlist = this.handleFavlist.bind(this);
  }

  handleFavlist(e, index, favlist_id) {
    e.preventDefault();
    this.setState({
      selectedIndex: index,
    });
    const newUrl = this.props.favlist_endpoint_placeholder.replace(/::/g, favlist_id);
    // console.log(this.props.favlist_endpoint_placeholder);
    console.log(newUrl);
    axios.get(`${newUrl}.json`).then(
      function(response) {
        console.log(response);
        this.setState({
          initial_payload: {
            dataset_wrapper: {
              dataset: response.data.userslist.dataset,
              pageCount: Math.ceil(response.data.total_entries / this.state.resultsPerPage),
              isLoading: false,
              count: response.data.total_entries,
              selectedPage: response.data.current_page - 1
            }
          }
        });
      }.bind(this)
    );










    // let searchParams = new URLSearchParams(window.location.search);
    // searchParams.set('sorting', field);
    // searchParams.set('ordering', updatedOrdering);
    // let newUrlParams = searchParams.toString()
    //   ? `${window.location.pathname}?${searchParams.toString()}`
    //   : window.location.pathname;
    // history.replaceState(null, '', newUrlParams);
    // console.log(searchParams.toString());
    // this.handleAjaxRequest(`?${searchParams.toString()}`)


    // axios.get(`/favlists/${favlist_id}.json`)
    //   .then(
    //     function(response) {
    //       console.log(response);
    //       this.setState({
    //         initial_payload: {
    //           dataset_wrapper: {
    //             dataset: response.data.userslist.dataset
    //           },
    //           results_per_page: response.data.results_per_page,
    //           total_entries: response.data.total_entries,
    //           current_page: response.data.current_page,
    //           object_type: 'favlists'
    //         },
    //         isLoading: false
    //
    //
    //           // dataset: newData.dataset,
    //           // pageCount: Math.ceil(response.data.total_entries / this.state.resultsPerPage),
    //           // isLoading: false,
    //           // count: response.data.total_entries,
    //           // selectedPage: response.data.current_page - 1
    //
    //
    //       });
    //
    //     }.bind(this));
  }

  // this.setState(prevState => ({
  // size_filter: {
  //   ...prevState.size_filter,
  //   propertyType: newSelection
  // },

  render() {
    return (
      <>
        {this.props.favlists.length > 0 ? (
          <>
            <div className={'row'}>
              <div className="col-lg-4">
                <div className="list-group list-group-bordered mb-3">
                  {this.props.favlists.map((entry, index) => (
                    <a
                      key={entry['id']}
                      href=""
                      className={`list-group-item list-group-item-action list-group-item-${
                        this.state.selectedIndex === index ? 'success' : 'primary'
                      }`}
                      onClick={e => this.handleFavlist(e, index, entry['id'])}>
                      {entry['name']}
                    </a>
                  ))}
                </div>
              </div>
              {this.state.selectedIndex > -1 ? (
                this.state.isLoading
                  ? <div>{'loading'}</div>
                  : <div>
                    <ShowUserFavListWithDatatable
                      initial_payload={this.state.initial_payload}
                      results_per_page={this.state.resultsPerPage}

                      i18n={this.props.i18n}/>
                  </div>
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
