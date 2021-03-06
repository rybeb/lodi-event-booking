import React, { useContext } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from '@apollo/react-hooks';

import AuthPage from './pages/Auth';
import EventsPage from './pages/Events';
import MainNavigaton from './components/Navigation/MainNavigation';
import { AuthContext } from './context/auth-context';
import './App.css';

const httpLink = createHttpLink({
  uri: '/graphql'
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('lodiToken');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

const App = () => {
  const context = useContext(AuthContext);
  const token = localStorage.getItem('lodiToken');
  const userId = localStorage.getItem('lodiUserId');
  const userEmail = localStorage.getItem('lodiUserEmail');
  if (token && userId && userEmail) {
    context.reAuth(token, userId);
    context.setEmail(userEmail);
  }

  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <MainNavigaton />
        <main className='main-content container-fluid'>
          <Switch>
            {context.token && <Redirect from='/' to='/events' exact />}
            {context.token && <Redirect from='/auth' to='/events' exact />}
            {!context.token && <Route path='/auth' component={AuthPage} />}
            <Route path='/events' component={EventsPage} />
            {!context.token && <Redirect to='/auth' exact />}
          </Switch>
        </main>
      </BrowserRouter>
    </ApolloProvider>
  );
};

export default App;
