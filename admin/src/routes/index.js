
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Switch } from 'react-router-dom';
import Route from './Route'

import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={Login} />

      <Route path="/dashboard" component={Dashboard} isPrivate />

      {/* redirect user to SignIn page if route does not exist and user is not authenticated */}
      <Route component={Login} />
    </Switch>
  );
}