import ReactOnRails from 'react-on-rails';
import UsersListWithDatatable from '../bundles/datatables/UsersList';
import ClientsListWithDatatable from '../bundles/datatables/ClientsList';
import PropertiesListWithDatatable from '../bundles/datatables/PropertiesList';
import ClientPrefsListWithDatatable from '../bundles/datatables/ClientPrefsList';
import ShowUserFavListWithDatatable from '../bundles/datatables/ShowUserFavList';
import Favlists from '../bundles/datatables/Favlists';
import FormSelect from '../bundles/components/selects/FormSelect';
import AsyncSelectContainer from '../bundles/components/selects/AsyncSelectContainer';
import AssociativeFormSelect from '../bundles/components/selects/AssociativeFormSelect';
import ModalContainer from '../bundles/components/ModalContainer';
import InlineSearch from '../bundles/components/InlineSearch';
import SimpleTableView from '../bundles/components/SimpleTableView';

// That's how react_on_rails "sees" our components in erb views.
// Unfortunately we need to register everything up-front.
ReactOnRails.register({
  UsersListWithDatatable,
  ClientsListWithDatatable,
  PropertiesListWithDatatable,
  ClientPrefsListWithDatatable,
  ShowUserFavListWithDatatable,
  Favlists,
  FormSelect,
  AssociativeFormSelect,
  ModalContainer,
  AsyncSelectContainer,
  InlineSearch,
});




