import PropTypes from 'prop-types';
import React from 'react';
import axios from 'axios';
import ReactOnRails from 'react-on-rails';
import URLSearchParams from '@ungap/url-search-params';
import { debounce, capitalizeFirstLetter, buildUserURL } from '../utilities/helpers';

// Handles the datatable data and part of the filtering login
function withDatatable(WrappedComponent) {
  class withDatatable extends React.Component {
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
        buysell_filter: this.props.initial_payload.buysell_filter
          ? {
              storedOption: this.props.initial_payload.buysell_filter.storedOption,
              options: this.props.initial_payload.buysell_filter.options
            }
          : '',
        status_filter: this.props.initial_payload.status_filter
          ? {
            storedOption: this.props.initial_payload.status_filter.storedOption,
            options: this.props.initial_payload.status_filter.options
          }
          : '',
        category_filter: this.props.initial_payload.category_filter
          ? {
              options: this.props.initial_payload.category_filter.options,
              storedMasterOption: this.props.initial_payload.category_filter.storedMasterOption,
              storedSlaveOption: this.props.initial_payload.category_filter.storedSlaveOption
            }
          : '',
        price_filter: this.props.initial_payload.price_filter
          ? {
              options: this.props.initial_payload.price_filter.options,
              storedMasterOption: this.props.initial_payload.price_filter.storedMasterOption,
              storedSlaveOption: this.props.initial_payload.price_filter.storedSlaveOption
            }
          : '',
        size_filter: this.props.initial_payload.size_filter
          ? {
              propertyType: this.props.initial_payload.size_filter.propertyType,
              options: this.props.initial_payload.size_filter.options,
              storedMasterOption: this.props.initial_payload.size_filter.storedMasterOption,
              storedSlaveOption: this.props.initial_payload.size_filter.storedSlaveOption
            }
          : '',
        rooms_filter: this.props.initial_payload.rooms_filter
          ? {
              propertyType: this.props.initial_payload.rooms_filter.propertyType,
              options: this.props.initial_payload.rooms_filter.options,
              storedMasterOption: this.props.initial_payload.rooms_filter.storedMasterOption,
              storedSlaveOption: this.props.initial_payload.rooms_filter.storedSlaveOption
            }
          : '',
        floors_filter: this.props.initial_payload.floors_filter
          ? {
              propertyType: this.props.initial_payload.rooms_filter.propertyType,
              options: this.props.initial_payload.floors_filter.options,
              storedMasterOption: this.props.initial_payload.floors_filter.storedMasterOption,
              storedSlaveOption: this.props.initial_payload.floors_filter.storedSlaveOption
            }
          : '',
        construction_filter: this.props.initial_payload.construction_filter
          ? {
              propertyType: this.props.initial_payload.construction_filter.propertyType,
              options: this.props.initial_payload.construction_filter.options,
              storedMasterOption: this.props.initial_payload.construction_filter.storedMasterOption,
              storedSlaveOption: this.props.initial_payload.construction_filter.storedSlaveOption
            }
          : '',
        locations_filter: this.props.initial_payload.locations_filter
          ? {
            storedOptions: this.props.initial_payload.locations_filter.storedOptions
          }
          : '',
        cfields: this.props.initial_payload.cfields,
        is_masquerading: this.props.initial_payload.is_masquerading,
        dataset: this.props.initial_payload.dataset_wrapper.dataset,
        resultsPerPage: this.props.initial_payload.results_per_page,
        isLoading: false,
        pageCount: Math.ceil(this.props.initial_payload.total_entries / this.props.initial_payload.results_per_page),
        count: this.props.initial_payload.total_entries,

        /* This is required only in initial loading.
         * We want this to be reflected in our React component. That's why we subtract 1 */
        selectedPage: this.getSelectedPage(),
        searchInput: this.props.initial_payload.initial_search,
        sorting: this.props.initial_payload.initial_sorting,
        ordering: this.props.initial_payload.initial_ordering,
        i18n: this.props.i18n
      };

      axios.defaults.headers.common['X-CSRF-Token'] = ReactOnRails.authenticityToken();

      // bind always returns a new function. This new function is important because without a reference to it
      // we won't be able to remove it as a listener in componentWillUnmount leaving us with memory leaks.
      // https://gist.github.com/Restuta/e400a555ba24daa396cc

      this.breakButtons = [];
      this.handlePageClick = this.handlePageClick.bind(this);
      this.bound_onHistoryButton = this.handleHistoryButton.bind(this);
      this.determineDirection = this.determineDirection.bind(this);
      this.handleSearchInput = this.handleSearchInput.bind(this);
      // this.cleanupParams = this.cleanupParams.bind(this);
      this.handleSort = this.handleSort.bind(this);
      this.handleAjaxRequest = this.handleAjaxRequest.bind(this);
      this.handleAssign = this.handleAssign.bind(this);
      this.advanceByTwo = this.advanceByTwo.bind(this);
      this.handleFreezeUser = this.handleFreezeUser.bind(this);
      this.handleAdminifyUser = this.handleAdminifyUser.bind(this);
      this.handleFav = this.handleFav.bind(this);
      this.handleLocationInput = this.handleLocationInput.bind(this);
      this.handleCategoryInput = this.handleCategoryInput.bind(this);
      this.handlePriceInput = this.handlePriceInput.bind(this);
      this.handleSizeInput = this.handleSizeInput.bind(this);
      this.handleRoomsInput = this.handleRoomsInput.bind(this);
      this.handleFloorsInput = this.handleFloorsInput.bind(this);
      this.handleConstructionInput = this.handleConstructionInput.bind(this);
      this.handleChangePurpose = this.handleChangePurpose.bind(this);
      this.handleChangeStatus = this.handleChangeStatus.bind(this);
      this.handleCfieldDropdown = this.handleCfieldDropdown.bind(this);
      this.handleCfieldTextfield = this.handleCfieldTextfield.bind(this);
      this.handleCfieldCheckbox = this.handleCfieldCheckbox.bind(this);
      this.handleClone = this.handleClone.bind(this);
      this.ajaxCallback = this.ajaxCallback.bind(this);
      this.handleAjaxRequestDelayed = debounce(this.handleAjaxRequest, 300);
      this.handleCfieldTextfieldDelayed = debounce(this.handleCfieldTextfield, 150);
      this.compoundDelayedAction = debounce(this.compoundDelayedAction.bind(this), 300);
    }

    getSelectedPage() {
      const selectedPage = new URL(window.location.href).searchParams.get('page') || 1;
      return parseInt(selectedPage) - 1;
    }

    componentDidMount() {
      window.addEventListener('popstate', this.bound_onHistoryButton);
      $('[data-toggle="tooltip"]').tooltip();
    }

    componentWillUnmount() {
      window.removeEventListener('popstate', this.bound_onHistoryButton);
    }

    // Turbolinks also have some sort of history state management. We don't want React to get in its way.
    // This function will only be used when turbolinks are not in use. That is all ajax requests.
    // If the 'turbolinks' key appears anywhere in history.state that means we need to bailout and let
    // turbolinks handle the re-rendering.
    handleHistoryButton(e) {
      // DEBUG
      // console.log(e.state);
      const historyPage = this.getSelectedPage();
      if (!('turbolinks' in e.state)) {
        this.handlePageClick(historyPage, true, true);
      }
    }

    determineDirection(element) {
      let ellipsisDomElement = $(element)
        .parent()
        .parent();
      let direction = '+';
      ellipsisDomElement.nextAll().each((i, element) => {
        if ($(element).hasClass('active')) {
          direction = '-';
          return false;
        }
      });
      return direction;
    }

    advanceByTwo(e) {
      e.preventDefault();
      e.stopPropagation();
      const sign = this.determineDirection(e.target);
      if (sign === '+') {
        this.handlePageClick(this.state.selectedPage + 2, true);
      } else {
        this.handlePageClick(this.state.selectedPage - 2, true);
      }
    }

    handlePriceInput(topLevel, selection, browserButtonInvoked = false) {
      this.setState({ isLoading: true });
      const getName = topLevel => {
        return topLevel ? 'pricemin' : 'pricemax';
      };
      let searchParams = new URLSearchParams(window.location.search);
      if (!selection) {
        searchParams.delete(getName(topLevel));
      } else {
        if (topLevel && parseInt(selection.value) > parseInt(searchParams.get('pricemax'))) {
          searchParams.delete('pricemax');
        } else if (selection.value === searchParams.get(getName(topLevel))) {
          return;
        }
        searchParams.set(getName(topLevel), selection.value);
        searchParams.delete('page');
      }
      let newUrlParams = searchParams.toString()
        ? `${window.location.pathname}?${searchParams.toString()}`
        : window.location.pathname;
      this.compoundDelayedAction(searchParams, newUrlParams);
    }

    handleSizeInput(topLevel, selection, browserButtonInvoked = false) {
      this.setState({ isLoading: true });
      const getName = topLevel => {
        return topLevel ? 'sizemin' : 'sizemax';
      };
      let searchParams = new URLSearchParams(window.location.search);
      if (!selection) {
        searchParams.delete(getName(topLevel));
        searchParams.delete(`${getName(topLevel)}meta`);
      } else {
        if (topLevel && parseInt(selection.value) > parseInt(searchParams.get('sizemax'))) {
          searchParams.delete('sizemax');
        } else if (selection.value === searchParams.get(getName(topLevel))) {
          return;
        }
        searchParams.set(getName(topLevel), selection.value);
        searchParams.set(`${getName(topLevel)}meta`, selection.meta);
        searchParams.delete('page');
      }
      let newUrlParams = searchParams.toString()
        ? `${window.location.pathname}?${searchParams.toString()}`
        : window.location.pathname;
      this.compoundDelayedAction(searchParams, newUrlParams);
    }

    handleRoomsInput(topLevel, selection, browserButtonInvoked = false) {
      this.setState({ isLoading: true });
      const getName = topLevel => {
        return topLevel ? 'roomsmin' : 'roomsmax';
      };
      let searchParams = new URLSearchParams(window.location.search);
      if (!selection) {
        searchParams.delete(getName(topLevel));
      } else {
        if (topLevel && parseInt(selection.value) > parseInt(searchParams.get('roomsmax'))) {
          searchParams.delete('roomsmax');
        } else if (selection.value === searchParams.get(getName(topLevel))) {
          return;
        }
        searchParams.set(getName(topLevel), selection.value);
        searchParams.delete('page');
      }
      let newUrlParams = searchParams.toString()
        ? `${window.location.pathname}?${searchParams.toString()}`
        : window.location.pathname;
      this.compoundDelayedAction(searchParams, newUrlParams);
    }

    handleFloorsInput(topLevel, selection, browserButtonInvoked = false) {
      this.setState({ isLoading: true });
      const getName = topLevel => {
        return topLevel ? 'floorsmin' : 'floorsmax';
      };
      let searchParams = new URLSearchParams(window.location.search);
      if (!selection) {
        searchParams.delete(getName(topLevel));
      } else {
        if (topLevel && parseInt(selection.value) > parseInt(searchParams.get('floorsmax'))) {
          searchParams.delete('floorsmax');
        } else if (selection.value === searchParams.get(getName(topLevel))) {
          return;
        }
        searchParams.set(getName(topLevel), selection.value);
        searchParams.delete('page');
      }
      let newUrlParams = searchParams.toString()
        ? `${window.location.pathname}?${searchParams.toString()}`
        : window.location.pathname;
      this.compoundDelayedAction(searchParams, newUrlParams);
    }

    handleConstructionInput(topLevel, selection, browserButtonInvoked = false) {
      this.setState({ isLoading: true });
      const getName = topLevel => {
        return topLevel ? 'constructionmin' : 'constructionmax';
      };
      let searchParams = new URLSearchParams(window.location.search);
      if (!selection) {
        searchParams.delete(getName(topLevel));
      } else {
        if (topLevel && parseInt(selection.value) > parseInt(searchParams.get('constructionmax'))) {
          searchParams.delete('constructionmax');
        } else if (selection.value === searchParams.get(getName(topLevel))) {
          return;
        }
        searchParams.set(getName(topLevel), selection.value);
        searchParams.delete('page');
      }
      let newUrlParams = searchParams.toString()
        ? `${window.location.pathname}?${searchParams.toString()}`
        : window.location.pathname;
      this.compoundDelayedAction(searchParams, newUrlParams);
    }

    // topLevel comes from the AssosiativeFormSelect.jsx which uses the currying techique.
    // SOS: The category input is the controlling value for the filters of size, rooms and floor. This means that the
    // options and the selected values of the aforementioned filters change accordingly
    // to reflect the currently selected category.
    handleCategoryInput(topLevel, selection, browserButtonInvoked = false) {
      this.setState({ isLoading: true });
      const getName = topLevel => {
        return topLevel ? 'category' : 'subcategory';
      };
      let searchParams = new URLSearchParams(window.location.search);
      if (!selection) {
        // This is basically clicking 'x' on master category
        // DEBUG
        // console.log('Cancelled selection');
        // Clicking 'x' requires setting a different "leftover" controlling value for each filter because of the way
        // each works. For instance: Set min and max for the size filter. Refresh your page. Pick the 'land' category.
        // If the selected choices fall in the range of the selected category the url and the size selected values
        // should not change. Clicking the 'x' next to the newly selected category also shouldn't change anything.
        // However if 'land' selected (rooms unavailable) and then the 'x' is pressed they should become immediately available.
        // The leftover controlling value for size won't work here. That's why we need separate controlling values.
        if (topLevel) {
          searchParams.delete('subcategory');
          const s =
            ['residential', 'commercial'].indexOf(searchParams.get(getName(topLevel))) > -1 ? 'building' : 'land';
          // DEBUG
          // console.log(`the new leftover state will be: ${s}`);
          this.setState(prevState => ({
            size_filter: {
              ...prevState.size_filter,
              propertyType: s
            },
            rooms_filter: {
              ...prevState.rooms_filter,
              propertyType: 'building'
            },
            floors_filter: {
              ...prevState.floors_filter,
              propertyType: 'building'
            },
            construction_filter: {
              ...prevState.construction_filter,
              propertyType: 'building'
            }
          }));
        }
        searchParams.delete(getName(topLevel));
      } else {
        if (topLevel && selection.value !== searchParams.get(getName(topLevel))) {
          searchParams.delete('subcategory');
          // Initialized property type is building
          const existingPropertyTypeForSize = searchParams.get(getName(topLevel))
            ? ['residential', 'commercial'].indexOf(searchParams.get(getName(topLevel))) > -1
              ? 'building'
              : 'land'
            : this.state.size_filter.propertyType
            ? this.state.size_filter.propertyType
            : 'building';

          const existingPropertyTypeForRooms = searchParams.get(getName(topLevel))
            ? ['residential', 'commercial'].indexOf(searchParams.get(getName(topLevel))) > -1
              ? 'building'
              : 'land'
            : this.state.rooms_filter.propertyType
            ? this.state.rooms_filter.propertyType
            : 'building';

          const existingPropertyTypeForFloors = searchParams.get(getName(topLevel))
            ? ['residential', 'commercial'].indexOf(searchParams.get(getName(topLevel))) > -1
              ? 'building'
              : 'land'
            : this.state.floors_filter.propertyType
            ? this.state.floors_filter.propertyType
            : 'building';

          const existingPropertyTypeForConstruction = searchParams.get(getName(topLevel))
            ? ['residential', 'commercial'].indexOf(searchParams.get(getName(topLevel))) > -1
              ? 'building'
              : 'land'
            : this.state.construction_filter.propertyType
            ? this.state.construction_filter.propertyType
            : 'building';

          const updatedPropertyType = ['residential', 'commercial'].indexOf(selection.value) > -1 ? 'building' : 'land';

          // DEBUG
          // console.log(`params is: ${searchParams.get(getName(topLevel))}`);
          // console.log(`existingPropertyType is: ${existingPropertyType}`);
          // console.log(`updatedPropertyType is: ${updatedPropertyType}`);

          if (existingPropertyTypeForSize !== updatedPropertyType) {
            // DEBUG
            // console.log('cleaning');
            searchParams.delete('sizemin');
            searchParams.delete('sizeminmeta');
            searchParams.delete('sizemax');
            searchParams.delete('sizemaxmeta');
          }

          if (existingPropertyTypeForRooms !== updatedPropertyType) {
            searchParams.delete('roomsmin');
            searchParams.delete('roomsmax');
          }

          if (existingPropertyTypeForFloors !== updatedPropertyType) {
            searchParams.delete('floorsmin');
            searchParams.delete('floorsmax');
          }

          if (existingPropertyTypeForConstruction !== updatedPropertyType) {
            searchParams.delete('constructionmin');
            searchParams.delete('constructionmax');
          }

          // Change the size options only on top level select change
          const newSelection = ['residential', 'commercial'].indexOf(selection.value) > -1 ? 'building' : 'land';
          this.setState(prevState => ({
            size_filter: {
              ...prevState.size_filter,
              propertyType: newSelection
            },
            rooms_filter: {
              ...prevState.rooms_filter,
              propertyType: newSelection
            },
            floors_filter: {
              ...prevState.floors_filter,
              propertyType: newSelection
            },
            construction_filter: {
              ...prevState.construction_filter,
              propertyType: newSelection
            }
          }));
        } else if (selection.value === searchParams.get(getName(topLevel))) {
          return;
        }
        searchParams.set(getName(topLevel), selection.value);
        searchParams.delete('page');
      }
      let newUrlParams = searchParams.toString()
        ? `${window.location.pathname}?${searchParams.toString()}`
        : window.location.pathname;
      this.compoundDelayedAction(searchParams, newUrlParams);
    }

    handleLocationInput(locations, browserButtonInvoked = false) {
      let searchParams = new URLSearchParams(window.location.search);
      // In this case delete the relevant params entry
      if (locations === null || !locations.length) {
        searchParams.delete('locations');
      } else {
        const locationids = locations.map(loc => `${loc.value}:${loc.label}`).join(',');
        searchParams.set('locations', locationids);
        searchParams.delete('page');
      }
      let newUrlParams = searchParams.toString()
        ? `${window.location.pathname}?${searchParams.toString()}`
        : window.location.pathname;
      // DEBUG
      // console.log(`callback running with location id: ${locations[0].value}`);
      // console.log(`callback running with location name: ${locations[0].label}`);
      this.compoundDelayedAction(searchParams, newUrlParams);
    }

    handlePageClick(pageNumber, pageNo = false, browserButtonInvoked = false) {
      this.setState({ isLoading: true });
      const selected = pageNo ? pageNumber : pageNumber.selected;
      let searchParams = new URLSearchParams(window.location.search);
      // debugger;
      searchParams.set('page', selected + 1);
      let newUrlParams = searchParams.toString()
        ? `${window.location.pathname}?${searchParams.toString()}${window.location.hash}`
        : window.location.pathname;
      if (!browserButtonInvoked) history.pushState({ jsonpage: selected + 1 }, null, newUrlParams);
      // console.log(searchParams.toString());
      this.handleAjaxRequest(`?${searchParams.toString()}`);
    }

    handleSearchInput(e) {
      this.setState({ searchInput: e.target.value || '', isLoading: true });
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

    handleFav(e, url, isFaved, id) {
      e.preventDefault();
      console.log(url);
      console.log(isFaved);
      axios[isFaved ? 'delete' : 'post'](url) // +1 because rails will_paginate starts from 1 while this starts from 0
        .then(
          function(response) {
            // DEBUG
            // console.log(response);
            // console.log(this.state.dataset);
            const index = this.state.dataset.findIndex(element => element.id === id);
            let element = this.state.dataset[index];
            element['isFaved'] = !element['isFaved'];
            let newDataset = [...this.state.dataset, ...element];
            this.setState({
              dataset: newDataset
            });
          }.bind(this)
        )
        .catch(
          function(error) {
            console.warn(error);
            // this.setState({isLoading: false});
          }.bind(this)
        );
    }

    handleAdminifyUser(e, adminify_url, user_id) {
      e.preventDefault();
      const url = buildUserURL(adminify_url, user_id);
      axios.patch(url).then(response => {
        // DEBUG
        // console.log(response);
        const index = this.state.dataset.findIndex(element => element.id === user_id);
        let element = this.state.dataset[index];
        element['privileged'] = !element['privileged'];
        let newDataset = [...this.state.dataset];
        this.setState({
          dataset: newDataset
        });
      });


    }

    handleFreezeUser(e, freeze_url, user_id) {
      e.preventDefault();
      const url = buildUserURL(freeze_url, user_id);
      axios.patch(url).then(response => {
        // DEBUG
        // console.log(response);
        const index = this.state.dataset.findIndex(element => element.id === user_id);
        let element = this.state.dataset[index];
        element['active'] = !element['active'];
        let newDataset = [...this.state.dataset];
        this.setState({
          dataset: newDataset
        });
      });
    }

    handleSort(e, field, forcedOrdering = '') {
      if (e.target) e.preventDefault();
      let updatedOrdering = forcedOrdering ? forcedOrdering : this.state.ordering === 'asc' ? 'desc' : 'asc';
      this.setState({ isLoading: true, sorting: field, ordering: updatedOrdering });
      let searchParams = new URLSearchParams(window.location.search);
      searchParams.set('sorting', field);
      searchParams.set('ordering', updatedOrdering);
      let newUrlParams = searchParams.toString()
        ? `${window.location.pathname}?${searchParams.toString()}`
        : window.location.pathname;
      this.compoundDelayedAction(searchParams, newUrlParams);
    }

    handleAjaxRequest(query = '') {
      const object_type = this.props.initial_payload.object_type;
      // DEBUG
      // console.log('handling ajax');
      // console.log(object_type);
      let resource;
      switch (object_type) {
        case 'property_users':
          resource = `app/properties/${this.props.initial_payload.pid}.json${query}`;
          break;
        case 'users':
          resource = `users.json${query}`;
          break;
        case 'clients':
          resource = `clients.json${query}`;
          break;
        case 'clientprefslist':
          resource = `${this.props.initial_payload.client_endpoint}.json${query}`;
          break;
        case 'favlists':
          resource = `${this.props.initial_payload.favlists_endpoint}.json${query}`;
          break;
        case 'properties':
          resource = `properties.json${query}`;
          break;
        default:
          console.warn('No resource specified');
      }
      // axios.get(`/${entity}.json${query}`) // +1 because rails will_paginate starts from 1 while this starts from 0
      // axios.get(`/properties/3.json${query}`) // +1 because rails will_paginate starts from 1 while this starts from 0
      axios
        .get(resource) // +1 because rails will_paginate starts from 1 while this starts from 0
        .then(
          function(response) {
            this.ajaxCallback(response);
          }.bind(this)
        )
        .catch(
          function(error) {
            console.warn(error);
            this.setState({ isLoading: false });
          }.bind(this)
        );
    }

    compoundDelayedAction(searchParams, newUrlParams) {
      history.replaceState(null, '', newUrlParams);
      searchParams.toString() ? this.handleAjaxRequest(`?${searchParams.toString()}`) : this.handleAjaxRequest();
    }

    ajaxCallback(response){
      let newData = response.data.datalist;
      this.setState({
        dataset: newData.dataset,
        pageCount: Math.ceil(response.data.total_entries / this.state.resultsPerPage),
        isLoading: false,
        count: response.data.total_entries,
        selectedPage: response.data.current_page - 1
      });
    }

    handleAssign(e) {
      e.preventDefault();
      // DEBUG
      // console.log('executing handle assign');
      // console.log(e.target.dataset);
      // console.log(e.target.dataset.uid);
      let pid = this.props.initial_payload['pid'];
      let uid = parseInt(e.target.dataset['uid']);
      // Get the type of method from data-method
      const method = e.target.dataset['methodtype'];
      let entity = this.props.initial_payload.object_type;
      // todo This needs refactoring
      axios[method](`app/assignments/property/${pid}/user/${uid}.json`) // +1 because rails will_paginate starts from 1 while this starts from 0
        .then(
          function(response) {
            // console.log('logging the response');
            // console.log(response);
            // console.log(this.state.dataset);
            // copy current state
            let new_dataset = this.state.dataset.slice();
            let el = new_dataset.find(user => user.id === uid);
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
          }.bind(this)
        )
        .catch(
          function(error) {
            console.warn(error);
            console.error('Unable to make the assignment. Please contact support');
            this.setState({ isLoading: false });
          }.bind(this)
        );
    }

    handleChangePurpose(e) {
      this.setState({ isLoading: true });
      const newSelection = e.target.value;
      this.setState(prevState => ({
        buysell_filter: {
          ...prevState.buysell_filter,
          storedOption: newSelection
        }
      }));
      let searchParams = new URLSearchParams(window.location.search);
      if (e.target.value !== undefined && e.target.value.length > 0) {
        searchParams.set('purpose', e.target.value);
        searchParams.delete('pricemin');
        searchParams.delete('pricemax');
      } else {
        searchParams.delete('purpose');
      }
      searchParams.delete('page');

      let newUrlParams = searchParams.toString()
        ? `${window.location.pathname}?${searchParams.toString()}`
        : window.location.pathname;
      // Use this to debounce both the ajax request and the history replaceState
      // https://github.com/ReactTraining/history/issues/291
      this.compoundDelayedAction(searchParams, newUrlParams);
    }

    handleChangeStatus(e) {
      this.setState({ isLoading: true });
      const newSelection = e.target.value;
      this.setState(prevState => ({
        status_filter: {
          ...prevState.status_filter,
          storedOption: newSelection
        }
      }));
      let searchParams = new URLSearchParams(window.location.search);
      if (e.target.value !== undefined && e.target.value.length > 0) {
        searchParams.set('status', e.target.value);
      } else {
        searchParams.delete('status');
      }
      searchParams.delete('page');

      let newUrlParams = searchParams.toString()
        ? `${window.location.pathname}?${searchParams.toString()}`
        : window.location.pathname;
      // Use this to debounce both the ajax request and the history replaceState
      // https://github.com/ReactTraining/history/issues/291
      this.compoundDelayedAction(searchParams, newUrlParams);
    }

    handleCfieldDropdown(selection, slug){
      this.setState({ isLoading: true });
      let searchParams = new URLSearchParams(window.location.search);
      if (!selection) {
        searchParams.delete(`cfield_${slug}`);
      } else {
        searchParams.set(`cfield_${slug}`, selection.value);
        searchParams.delete('page');
      }
      let newUrlParams = searchParams.toString()
        ? `${window.location.pathname}?${searchParams.toString()}`
        : window.location.pathname;
      this.compoundDelayedAction(searchParams, newUrlParams);
    }

    handleCfieldTextfield(selection, slug){
      this.setState({ isLoading: true });
      let searchParams = new URLSearchParams(window.location.search);
      if (!selection) {
        searchParams.delete(`cfield_${slug}`);
      } else {
        searchParams.set(`cfield_${slug}`, selection);
        searchParams.delete('page');
      }
      let newUrlParams = searchParams.toString()
        ? `${window.location.pathname}?${searchParams.toString()}`
        : window.location.pathname;
      this.compoundDelayedAction(searchParams, newUrlParams);
    }

    handleCfieldCheckbox(selection, slug){
      this.setState({ isLoading: true });
      // DEBUG
      // console.log(selection);
      let searchParams = new URLSearchParams(window.location.search);
      if (!selection) {
        searchParams.delete(`cfield_${slug}`);
      } else {
        searchParams.set(`cfield_${slug}`, selection ? '1' : '0');
        searchParams.delete('page');
      }
      let newUrlParams = searchParams.toString()
        ? `${window.location.pathname}?${searchParams.toString()}`
        : window.location.pathname;
      this.compoundDelayedAction(searchParams, newUrlParams);
    }

    handleClone(e, cloneUrl){
      e.preventDefault();
      this.setState({ isLoading: true });
      // DEBUG
      // console.log(cloneUrl);
      let searchParams = new URLSearchParams(window.location.search);
      axios({
        method: 'post',
        url: `${cloneUrl}.json?${searchParams}`,
        data: {}
      }).then((response) => {
        this.ajaxCallback(response)
      }).catch(
        function(error) {
          console.warn(error);
          this.setState({ isLoading: false });
        }.bind(this)
      );
    }

    render() {
      // {console.log(this.displayName)}
      return (
        <div>
          <WrappedComponent
            handleLocationInput={this.handleLocationInput}
            handleCategoryInput={this.handleCategoryInput}
            handlePriceInput={this.handlePriceInput}
            handleSizeInput={this.handleSizeInput}
            handleRoomsInput={this.handleRoomsInput}
            handleFloorsInput={this.handleFloorsInput}
            handleConstructionInput={this.handleConstructionInput}
            handlePageClick={this.handlePageClick}
            handleSort={this.handleSort}
            handleAssign={this.handleAssign}
            handleFav={this.handleFav}
            advanceByTwo={this.advanceByTwo}
            handleSearchInput={this.handleSearchInput}
            handleFreezeUser={this.handleFreezeUser}
            handleAdminifyUser={this.handleAdminifyUser}
            i18n={this.props.i18n}
            meta={this.props.meta}
            add_user_link={this.props.initial_payload.add_user_link}
            add_property_link={this.props.initial_payload.add_property_link}
            locations_endpoint={this.props.initial_payload.locations_endpoint}
            new_property_endpoint={this.props.initial_payload.new_property_endpoint}
            clients_endpoint={this.props.initial_payload.clients_endpoint || ''}
            client_endpoint={this.props.initial_payload.client_endpoint || ''}
            assignmentships_endpoint={this.props.initial_payload.assignmentships_endpoint || ''}
            properties_path={this.props.initial_payload.properties_path}
            users_path={this.props.initial_payload.users_path}
            clients_path={this.props.initial_payload.clients_path}
            showControls={this.props.initial_payload.showControls}
            handleChangePurpose={this.handleChangePurpose}
            handleChangeStatus={this.handleChangeStatus}
            handleCfieldDropdown={this.handleCfieldDropdown}
            handleCfieldTextfield={this.handleCfieldTextfieldDelayed}
            handleCfieldCheckbox={this.handleCfieldCheckbox}
            handleClone={this.handleClone}
            cfields={this.props.initial_payload.cfields}
            {...this.state}
          />
        </div>
      );
    }
  }
  withDatatable.displayName = `withDatatable(${getDisplayName(WrappedComponent)})`;
  return withDatatable;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default withDatatable;
