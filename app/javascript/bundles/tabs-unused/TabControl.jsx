import React from "react";
import { Link, Route, Router, Switch, useRoute } from 'wouter';

function TabControl(props) {

  return (
    <Router base={props.base_path}>
    <div>
      <nav>
        <ul>
          <li>
            <Link to="">Home</Link>
          </li>
          <li>
            <ActiveLink href="/about">About Us</ActiveLink>

          </li>
          <li>
            <ActiveLink href="/users">Users</ActiveLink>
            {/*<Link to="/users">Users</Link>*/}
          </li>
        </ul>
      </nav>

      {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
      <Switch>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/users">
          <Users />
        </Route>
        <Route path="">
          <Home />
        </Route>
      </Switch>
    </div>
    </Router>
  );
}

function Home() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}

const ActiveLink = props => {
  const [isActive] = useRoute(props.href);
  return (
    <Link {...props}>
      <a className={isActive ? "activeTab" : ""}>{props.children}</a>
    </Link>
  );
};

export default TabControl;