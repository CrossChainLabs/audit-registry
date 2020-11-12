import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { initContract } from './utils'
import { CookiesProvider } from 'react-cookie';

window.nearInitPromise = initContract()
  .then(() => {
    ReactDOM.render(
      <CookiesProvider>
        <App />
      </CookiesProvider>,
      document.querySelector('#root')
    )
  })
  .catch(console.error)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
