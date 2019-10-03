import React, { useContext } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import AuthPage from './pages/Auth';
import EventsPage from './pages/Events';
import BookingsPage from './pages/Bookings';
import MainNavigaton from './components/Navigation/MainNavigation';
import { AuthContext } from './context/auth-context';
import './App.css';

const App = () => {
  const context = useContext(AuthContext);
  return (
    <BrowserRouter>
      <MainNavigaton />
      <main className='main-content'>
        <Switch>
          {context.token && <Redirect from='/' to='/events' exact />}
          {context.token && <Redirect from='/auth' to='/events' exact />}
          {!context.token && <Route path='/auth' component={AuthPage} />}
          <Route path='/events' component={EventsPage} />
          {context.token && <Route path='/bookings' component={BookingsPage} />}
          {!context.token && <Redirect to='/auth' exact />}
        </Switch>
      </main>
    </BrowserRouter>
  );
};

export default App;
