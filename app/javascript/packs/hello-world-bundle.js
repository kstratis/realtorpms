import ReactOnRails from 'react-on-rails';

import HelloWorld from '../bundles/HelloWorld/components/HelloWorld';
import UsersList from '../bundles/HelloWorld/components/UsersList';
import Search from '../bundles/HelloWorld/components/Search';

// This is how react_on_rails can see the HelloWorld in the browser.
ReactOnRails.register({
  HelloWorld,
    UsersList,
  Search
});
