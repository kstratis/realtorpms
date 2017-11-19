import PropTypes from 'prop-types';
import React from 'react';
import axios from 'axios';
import ReactOnRails from 'react-on-rails';

// import UsersList from "./UsersList";
// import PropertiesList from "./PropertiesList";
import Search from "./Search";

const URLSearchParams = require('url-search-params');
import {debounce, capitalizeFirstLetter} from "./helpers";

function withDatatable(WrappedComponent) {

  return class extends React.Component {

    // These are passed from the Rails view on the first render
    static propTypes = {
      initial_payload: PropTypes.shape({
        dataset_wrapper: PropTypes.object.isRequired,
        results_per_page: PropTypes.number.isRequired,
        total_entries: PropTypes.number.isRequired,
        object_type: PropTypes.string.isRequired,
        current_page: PropTypes.number,
        pid: PropTypes.number // This is the property id
      })
    };

    /**
     * @param props - Comes from your rails view embedded in html thanks to react_on_rails
     */
    constructor(props) {
      super(props);
      this.state = {
        dataset: this.props.initial_payload.dataset_wrapper.dataset,
        resultsPerPage: this.props.initial_payload.results_per_page,
        isLoading: false,
        pageCount: Math.ceil(this.props.initial_payload.total_entries / this.props.initial_payload.results_per_page),
        /* This is required only in initial loading.
         * We want this to be reflected in our React component. That's why we subtract 1 */
        selectedPage: this.getSelectedPage(),
        searchInput: this.props.initial_payload.initial_search,
        sorting: this.props.initial_payload.initial_sorting,
        ordering: this.props.initial_payload.initial_ordering,
      };

      axios.defaults.headers.common['X-CSRF-Token'] = ReactOnRails.authenticityToken();


      // bind always returns a new function. This new function is important because without a reference to it
      // we won't be able to remove it as a listener in componentWillUnmount leading us to memory leaks.
      // https://gist.github.com/Restuta/e400a555ba24daa396cc
      this.bound_onHistoryButton = this.handleHistoryButton.bind(this);
      this.breakButtons = [];
      this.handlePageClick = this.handlePageClick.bind(this);
      this.determineDirection = this.determineDirection.bind(this);
      this.handleSearchInput = this.handleSearchInput.bind(this);
      this.handleSort = this.handleSort.bind(this);
      this.handleAjaxRequest = this.handleAjaxRequest.bind(this);
      this.handleAssign = this.handleAssign.bind(this);
      this.handleAjaxRequestDelayed = debounce(this.handleAjaxRequest, 300);
      this.compoundDelayedAction = debounce(this.compoundDelayedAction.bind(this), 300);
    }

    getSelectedPage() {
      const selectedPage = new URL(window.location.href).searchParams.get('page') || 1;
      return (parseInt(selectedPage) - 1);
    }

    componentDidMount() {
      window.addEventListener("popstate", this.bound_onHistoryButton);
    }

    componentWillUnmount() {
      window.removeEventListener("popstate", this.bound_onHistoryButton);
    }

// Turbolinks also have some sort of history state management. We don't want React to get in its way.
// This function will only be used when turbolinks are not in use. That is all ajax requests.
// If the 'turbolinks' key appears anywhere in history.state that means we need to bailout and let
// turbolinks handle the re-rendering.
    handleHistoryButton(e) {
      const historyPage = this.getSelectedPage();
      if (!('turbolinks' in e.state)) {
        this.handlePageClick(historyPage, true, true);
      }
    }

    determineDirection(element) {
      let ellipsisDomElement = $(element).parent();
      let direction = '+';
      ellipsisDomElement.nextAll().each((i, element) => {
        if ($(element).hasClass('active')) {
          direction = '-';
          return false;
        }
      });
      return direction;
    }
    ;

    advanceByTwo(e) {
      const sign = this.determineDirection(e.target);
      if (sign === '+') {
        this.handlePageClick(this.state.selectedPage + 2, true);
      } else {
        this.handlePageClick(this.state.selectedPage - 2, true);
      }
    }

    handlePageClick(pageNumber, pageNo = false, browserButtonInvoked = false) {
      this.setState({isLoading: true});
      const selected = pageNo ? pageNumber : pageNumber.selected;
      let searchParams = new URLSearchParams(window.location.search);
      searchParams.set('page', selected + 1);
      let newUrlParams = searchParams.toString()
        ? `${window.location.pathname}?${searchParams.toString()}`
        : window.location.pathname;
      if (!browserButtonInvoked) history.pushState({jsonpage: selected + 1}, null, newUrlParams);
      // console.log(searchParams.toString());
      this.handleAjaxRequestDelayed(`?${searchParams.toString()}`);
    }
    ;

    handleSearchInput(e) {
      this.setState({searchInput: e.target.value, isLoading: true});
      let searchParams = new URLSearchParams(window.location.search);
      searchParams.delete('page');
      if (e.target.value !== undefined && e.target.value.length > 0) {
        searchParams.set('search', e.target.value);
      } else {
        searchParams.delete('search');
      }
      let newUrlParams = searchParams.toString()
        ? `${window.location.pathname}?${searchParams.toString()}`
        : window.location.pathname;
      // Use this to debounce both the ajax request and the history replaceState
      // https://github.com/ReactTraining/history/issues/291
      this.compoundDelayedAction(searchParams, newUrlParams);
    }

    handleSort(e, field) {
      e.preventDefault();
      let direction = this.state.ordering === 'asc' ? 'desc' : 'asc';
      this.setState({isLoading: true, sorting: field, ordering: direction});
      let searchParams = new URLSearchParams(window.location.search);
      searchParams.set('sorting', field);
      searchParams.set('ordering', direction);
      let newUrlParams = searchParams.toString()
        ? `${window.location.pathname}?${searchParams.toString()}`
        : window.location.pathname;
      this.compoundDelayedAction(searchParams, newUrlParams);
    }

    handleAjaxRequest(query = '') {
      const object_type = this.props.initial_payload.object_type;
      let resource;
      switch (object_type) {
        case 'property_users':
          resource = `/properties/${this.props.initial_payload.pid}.json${query}`;
          break;
        case 'users':
          resource = `/users.json${query}`;
          break;
        case 'properties':
          resource = `/properties.json${query}`;
          break;
        default:
          console.warn('No resource specified');
      }
      // axios.get(`/${entity}.json${query}`) // +1 because rails will_paginate starts from 1 while this starts from 0
      // axios.get(`/properties/3.json${query}`) // +1 because rails will_paginate starts from 1 while this starts from 0
      axios.get(resource) // +1 because rails will_paginate starts from 1 while this starts from 0
        .then(function (response) {
          let newData = response.data.userslist;
          this.setState({
            dataset: newData.dataset,
            pageCount: Math.ceil(response.data.total_entries / this.state.resultsPerPage),
            isLoading: false,
            selectedPage: response.data.current_page - 1
          });
        }.bind(this))
        .catch(function (error) {
          console.warn(error);
          this.setState({isLoading: false});
        }.bind(this))
    }

    compoundDelayedAction(searchParams, newUrlParams) {
      history.replaceState(null, '', newUrlParams);
      searchParams.toString() ? this.handleAjaxRequest(`?${searchParams.toString()}`) : this.handleAjaxRequest();
    }

    handleAssign(e) {
      e.preventDefault();
      console.log('executing handle assign');
      // console.log(e.target.dataset);
      // console.log(e.target.dataset.uid);
      let pid = this.props.initial_payload['pid'];
      let uid = parseInt(e.target.dataset['uid']);
      // Get the type of method from data-method
      const method = e.target.dataset['methodtype'];
      let entity = this.props.initial_payload.object_type;
      axios[method](`/assignments/property/${pid}/user/${uid}.json`) // +1 because rails will_paginate starts from 1 while this starts from 0
        .then(function (response) {
          console.log('logging the response');
          console.log(response);
          console.log(this.state.dataset);
          // copy current state
          let new_dataset = this.state.dataset.slice();
          let el = new_dataset.find((user) => user.id === uid);
          let position = new_dataset.indexOf(el);
          // copy the object that needs to be modified
          let obj = Object.assign({}, new_dataset[position]);
          // modify the copy
          obj.is_assigned = !obj.is_assigned;
          method === 'delete' ? obj.assignments_count-- : obj.assignments_count++;
          // replace the array item with the new object
          new_dataset[position] = obj;
          this.setState({
            dataset: new_dataset
          });
          // let newData = response.data.userslist;
          // this.setState({
          //   dataset: newData.dataset,
          //   pageCount: Math.ceil(response.data.total_entries / this.state.resultsPerPage),
          //   isLoading: false,
          //   selectedPage: response.data.current_page - 1
          // });
        }.bind(this))
        .catch(function (error) {
          console.warn(error);
          console.error('Unable to make the assignment. Please contact support');
          this.setState({isLoading: false});
        }.bind(this))
    }

    render() {
      return (
        <div>
          <Search
            searchInput={this.state.searchInput}
            handleSearchInput={(e) => this.handleSearchInput(e)}/>
          <WrappedComponent
            handlePageClick={this.handlePageClick}
            handleSort={this.handleSort}
            handleAssign={this.handleAssign}
            advanceByTwo={this.advanceByTwo}
            {...this.state} />
        </div>);
    }
  }
}

export default withDatatable;