import React, { Suspense } from 'react';
import {
  FirebaseAppProvider,
  AuthCheck
} from 'reactfire';
import firebaseConfig from './firebase-config';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import SignIn from './views/SignIn';
import Dashboard from './views/Dashboard';

function App() {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <CssBaseline />

      <Suspense fallback={<div></div>}>
        <Router>
          <Switch>
            <Route path="/auth/sign-in">
              <SignIn />
            </Route>

            <MustBeAuthRoute path="/dashboard">
              <Dashboard />
            </MustBeAuthRoute>

            <Redirect from="/" to="/dashboard" />
          </Switch>
        </Router>
      </Suspense>
    </FirebaseAppProvider>
  );
}

function MustBeAuthRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) => (
        <AuthCheck fallback={
          <Redirect
            to={{
              pathname: '/auth/sign-in',
              state: { from: location }
            }}
          />
        }>
          {children}
        </AuthCheck>
      )}
    />
  );
}

export default App;
