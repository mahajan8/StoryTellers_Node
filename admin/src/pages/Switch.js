
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Switch, Route } from 'react-router-dom';

import Login from './Login'
import Dashboard from './Dashboard'

export default function App() {
  return (
    <Switch>
      <Route path="/" exact component={Login} />
      <Route path="/dashboard" component={Dashboard} isPrivate />
      {/* redirect user to SignIn page if route does not exist and user is not authenticated */}
      <Route component={Login} />
    </Switch>
  );
}