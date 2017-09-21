import ReactOnRails from 'react-on-rails';

import HelloWorld from '../bundles/HelloWorld/components/HelloWorld';
import UsersPage from '../bundles/HelloWorld/components/UsersPage';

// This is how react_on_rails can see the HelloWorld in the browser.
ReactOnRails.register({
  HelloWorld,
  UsersPage
});
