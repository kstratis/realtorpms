import ReactOnRails from 'react-on-rails';

// import HelloWorld from '../bundles/datatables/components/HelloWorld';
import UsersListWithDatatable from '../bundles/datatables/components/UsersList';
import UsersListAssignableWithDatatable from '../bundles/datatables/components/UsersListAssignable';
import PropertiesListWithDatatable from '../bundles/datatables/components/PropertiesList';

// import { addLocaleData } from 'react-intl';
// import en from 'react-intl/locale-data/en';
// import gr from 'react-intl/locale-data/p';

// addLocaleData([...en]);

// This is how react_on_rails can see the HelloWorld in the browser.
ReactOnRails.register({
  // HelloWorld,
  UsersListWithDatatable,
  UsersListAssignableWithDatatable,
  PropertiesListWithDatatable
});
